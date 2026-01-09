
// controllers/statssController.js

const Budgett = require("../models/bugett");
const Expense = require("../models/expense");
const Target = require("../models/targg");
exports.getWilayasStats = async (req, res) => {
  try {
    const results = await Expense.aggregate([
      {
        $lookup: {
          from: 'budgetts', // ← اسم مجموعة Budget في MongoDB (لاحظ أنه غالباً يكون بصيغة الجمع)
          localField: 'budgettId',
          foreignField: '_id',
          as: 'budgetInfo'
        }
      },
      { $unwind: '$budgetInfo' },
      {
        $group: {
          _id: '$budgetInfo.wilaya',
          totalQuantite: { $sum: '$quantite' }
        }
      }
    ]);

    const formatted = {};
    results.forEach(item => {
      formatted[item._id] = item.totalQuantite;
    });

    res.json(formatted);
  } catch (err) {
    console.error("Error in getWilayasStats:", err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

exports.getWilayaDetail = async (req, res) => {
  try {
    const { wilaya } = req.params;

    const results = await Expense.aggregate([
      {
        $lookup: {
          from: 'budgetts',
          localField: 'budgettId',
          foreignField: '_id',
          as: 'budgetInfo'
        }
      },
      { $unwind: '$budgetInfo' },
      {
        $match: {
          'budgetInfo.wilaya': wilaya
        }
      },
      {
        $group: {
          _id: '$product',
          quantite: { $sum: '$quantite' }
        }
      },
      {
        $lookup: {
          from: 'targets',
          let: { product: '$_id', wilaya: wilaya },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    { $eq: ['$product', '$$product'] },
                    { $eq: ['$wilaya', '$$wilaya'] }
                  ]
                }
              }
            }
          ],
          as: 'targetInfo'
        }
      },
      {
        $unwind: {
          path: '$targetInfo',
          preserveNullAndEmptyArrays: true
        }
      },
      {
        $project: {
          product: '$_id',
          quantite: 1,
          propose: { $ifNull: ['$targetInfo.quantite', 0] },
          _id: 0
        }
      }
    ]);

    res.json(results);
  } catch (err) {
    console.error('❌ Error in getWilayaStatsByProduct:', err.message);
    res.status(500).json({ error: 'خطأ في جلب الإحصائيات' });
  }
};
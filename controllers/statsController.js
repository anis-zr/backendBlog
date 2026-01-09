/* // controllers/statsController.js
const Income = require("../models/income");

exports.getTotals = async (req, res) => {
  // تجميع إجمالي quantite لكل wilaya
  const totals = await Income.aggregate([
    { $group: { _id: '$wilaya', total: { $sum: '$quantite' } } }
  ]);
  // تحويل للمسار { Tebessa: 123, ... }
  const result = {};
  totals.forEach(t => result[t._id] = t.total);
  res.json(result);
};

exports.getWilayaStats = async (req, res) => {
  const { state } = req.params;
  // تجميع حسب المنتج
  const stats = await Income.aggregate([
    { $match: { wilaya: state } },
    { $group: {
        _id: '$product',
        quantite: { $sum: '$quantite' },
        // افتراضياً يمكنك جلب propose من جدول آخر أو متغير ثابت
        propose: { $first: '$propose' }
    }},
    { $project: {
        product: '$_id',
        quantite: 1,
        propose: 1, // أو ثابت
        _id: 0
    }}
  ]);
  res.json(stats);
};

// controllers/statsController.js
const Income = require('../models/income')
const Budget = require('../models/budget')

// GET /stats/wilayas
exports.getWilayasStats = async (req, res) => {
  try {
    // نجمع عبر Income ↔ Budget لتحديد الولاية
    const stats = await Income.aggregate([
      // join Budget to get wilaya
      {
        $lookup: {
          from: 'budgets',
          localField: 'budgetId',
          foreignField: '_id',
          as: 'budget'
        }
      },
      { $unwind: '$budget' },
      // group by wilaya
      {
        $group: {
          _id: '$budget.wilaya',
          totalQuantity: { $sum: '$quantite' }
        }
      },
      {
        $project: {
          wilaya: '$_id',
          totalQuantity: 1,
          _id: 0
        }
      }
    ])
    // إذا أردنا قراءة هدف معين من config أو جدول منفصل:
    // stats.forEach(s => s.targetQuantity = getTargetFor(s.wilaya))
    res.json(stats)
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'فشل في جلب إحصائيات الولايات' })
  }
}



// GET /stats/wilaya/:wilaya
exports.getWilayaDetail = async (req, res) => {
  const { wilaya } = req.params
  try {
    const detail = await Income.aggregate([
      {
        $lookup: {
          from: 'budgets',
          localField: 'budgetId',
          foreignField: '_id',
          as: 'budget'
        }
      },
      { $unwind: '$budget' },
      { $match: { 'budget.wilaya': wilaya } },
      {
        $group: {
          _id: '$product',
          totalQuantity: { $sum: '$quantite' }
        }
      },
      {
        $project: {
          product: '$_id',
          totalQuantity: 1,
          _id: 0
        }
      }
    ])
    res.json(detail)
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'فشل في جلب تفاصيل الولاية' })
  }
}
// controllers/statsController.jsconst 
// 
/*
const Income = require('../models/income')
const Budget = require('../models/budget')
const Target = require("../models/target");

exports.getWilayaStats = async (req, res) => {
  try {
    const wilaya = req.params.wilayaName;

    const budgets = await Budget.find({ wilaya });
    const budgetIds = budgets.map((b) => b._id);

    const stats = await Income.aggregate([
      { $match: { budgetId: { $in: budgetIds } } },
      {
        $group: {
          _id: "$product",
          totalQuantite: { $sum: "$quantite" },
        },
      },
    ]);

    // جلب القيم المستهدفة من قاعدة البيانات
    const targets = await Target.find({ wilaya });

    const result = stats.map((item) => {
      const targetItem = targets.find((t) => t.product === item._id);
      return {
        product: item._id,
        actual: item.totalQuantite,
        target: targetItem ? targetItem.quantity : 0,
      };
    });

    res.json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "خطأ في جلب إحصائيات الولاية" });
  }
};*/





// controllers/statsController.js

const Budget = require("../models/budget");
const Income = require("../models/income");
const Target = require("../models/targ");
exports.getWilayasStats = async (req, res) => {
  try {
    const results = await Income.aggregate([
      {
        $lookup: {
          from: 'budgets', // ← اسم مجموعة Budget في MongoDB (لاحظ أنه غالباً يكون بصيغة الجمع)
          localField: 'budgetId',
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

    const results = await Income.aggregate([
      {
        $lookup: {
          from: 'budgets',
          localField: 'budgetId',
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
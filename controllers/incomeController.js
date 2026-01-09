/*const xlsx = require('xlsx')
const Income = require('../models/income')



exports.addIncome= async(req,res)=>{
    
    const {name,quantite,date ,unit, product} = req.body
    const newIncome=  Income({
        name,
        unit,product,
        quantite,
        date,
       
    })

 try{
  
    if(!name  || !quantite || !date || !unit || !product  ){
        return res.status(400).json({message:"All fields are required"})
    }
    await newIncome.save()
    res.status(200).json({message:'income added'})
 }catch(error){
    res.status(500).json({message:"Server Error"})
 }
}

exports.getAllIncome= async(req,res)=>{
    
 try{
const income = await Income.find().sort({createdAt:-1})
res.json(income)

 }catch(error){
    res.status(500).json({message:"Server Error"})
 }
}

exports.deleteIncome= async(req,res)=>{
    
  try{
    await Income.findByIdAndDelete(req.params.id)
    res.json({message:"Incomedeleted successfully"})
    
     }catch(error){
        res.status(500).json({message:"Server Error"})
     }
}
exports.updateIncome= async(req,res)=>{

        const { id } = req.params; // أو req.body إذا كنت تستخدم body
        const { source,wilaya, quantite, date } = req.body; // البيانات الجديدة
        const userId = req.user.id; // ID المستخدم من middleware الحماية
    
        try {
            // 1. البحث عن الدخل المطلوب تحديثه
            const incomeToUpdate = await IncomeModel.findOne({ _id: id, user: userId });
            
            if (!incomeToUpdate) {
                return res.status(404).json({ message: "لم يتم العثور على هذا الدخل" });
            }
    
            // 2. تحديث الحقول
            if (source) incomeToUpdate.source = source;
            if (quantite) incomeToUpdate.quantite = quantite;
            if (date) incomeToUpdate.date = date;
            if(wilaya)incomeToUpdate.wilaya = wilaya;
            // 3. حفظ التغييرات
            const updatedIncome = await incomeToUpdate.save();
    
            res.status(200).json({
                message: "تم تحديث الدخل بنجاح",
                data: updatedIncome
            });
        } catch (error) {
            res.status(500).json({ 
                message: "حدث خطأ أثناء محاولة التحديث",
                error: error.message 
            });
        }
}

exports.downloadIncomeExcel= async(req,res)=>{
 const userId = req.user.id
 try{
     const income= await Income.find({userId}).sort({date:-1})
    const data =income.map((item) =>({  
        source:item.source,
        
        quantite:item.source,
        date:item.source,
        wilaya:item.source,
    }));
    const wb = xlsx.utils.book_new()
    const ws= xlsx.utils.json_to_sheet(data)
     xlsx.utils.book_append_sheet(wb,ws,"Income")
     xlsx.writeFile(wb,'income_details.xlsx')
     res.download('income_details.xlsx')
      

 }catch(error){
    res.status(500).json({message:"server error"})
 }
}*/// controllers/incomeController.js
const Income = require("../models/income");
const Budget = require("../models/budget");

// 1) إنشاء سجل Income جديد
exports.createIncome = async (req, res) => {
  const { product, quantite, unit, date, budgetId } = req.body;
  try {
    // التحقق من وجود Budget بهذا المعرف
    const budget = await Budget.findById(budgetId);
    if (!budget) {
      return res.status(404).json({ message: "الميزانية المطلوبة غير موجودة" });
    }
    
    // إنشاء الـ Income الجديد
    const income = await Income.create({ product, quantite, unit, date, budgetId });
    return res.status(201).json(income);
  } catch (err) {
    console.error(err);
    // إذا كان الخطأ بسبب تكرار المنتج ضمن نفس الميزانية
    if (err.code === 11000) {
      return res.status(400).json({ message: "هذا المنتج موجود بالفعل ضمن هذه الميزانية" });
    }
    return res.status(500).json({ message: "خطأ في إنشاء الدخل (Income)" });
  }
};

// 2) جلب جميع Incomes المرتبطة بميزانية واحدة
exports.getIncomesByBudget = async (req, res) => {
  const { budgetId } = req.params;
  try {
    // التأكد من وجود Budget (اختياري)
    const budget = await Budget.findById(budgetId);
    if (!budget) {
      return res.status(404).json({ message: "الميزانية المطلوبة غير موجودة" });
    }

    // جلب Incomes وترتيبها تنازلياً حسب التاريخ
    const incomes = await Income.find({ budgetId }).sort({ date: -1 });
    return res.status(200).json(incomes);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "فشل في جلب بيانات الدخل (Income)" });
  }
};

// 3) تعديل Income حسب الـ _id
exports.updateIncome = async (req, res) => {
  const { id } = req.params; // معرّف الـ Income
  const { product, quantite, unit, date } = req.body;
  try {
    const income = await Income.findByIdAndUpdate(
      id,
      { product, quantite, unit, date },
      { new: true }
    );
    if (!income) {
      return res.status(404).json({ message: "سجل الدخل غير موجود" });
    }
    return res.status(200).json(income);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "فشل في تعديل الدخل (Income)" });
  }
};

// 4) حذف Income حسب الـ _id
exports.deleteIncome = async (req, res) => {
  const { id } = req.params;
  try {
    const income = await Income.findByIdAndDelete(id);
    if (!income) {
      return res.status(404).json({ message: "سجل الدخل غير موجود" });
    }
    return res.status(200).json({ message: "تم حذف الدخل بنجاح" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "فشل في حذف الدخل (Income)" });
  }
};
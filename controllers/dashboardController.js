const Income =  require("../models/income")
const Expense =  require("../models/bugett")
const {isValidObjectId, Types} = require("mongoose")


exports.getDashboardData = async (req,res)=>{

 try{
  const userId = req.user.id
  const userObjectId = new Types.ObjectId(String(userId))
  
  const totalkhanshla= await Income.aggregate([

     {$match : {userId: userObjectId}},
     {$group:{_id:null , total:{$sum : "$quantite"}}}
   
  ])
  const totalkhanshlaa= await Expense.aggregate([

    {$match : {userId: userObjectId}},
    {$group:{_id:null , total:{$sum : "$quantite"}}}
  
 ])
  const totaltebessa = await Income.aggregate([

    {$match : {userId: userObjectId}},
    {$group:{_id:null , total:{$sum : "$quantite"}}}
  
 ])
 const totaltebessaa = await Expense.aggregate([

    {$match : {userId: userObjectId}},
    {$group:{_id:null , total:{$sum : "$quantite"}}}
  
 ])
 const totalsouk_ahras = await Income.aggregate([

    {$match : {userId: userObjectId}},
    {$group:{_id:null , total:{$sum : "$quantite"}}}
  
 ])
 const totalsouk_ahrass = await Expense.aggregate([

    {$match : {userId: userObjectId}},
    {$group:{_id:null , total:{$sum : "$quantite"}}}
  
 ])
  console.log("totaltebessa",{totaltebessa,userId:isValidObjectId(userId)})


   const last60DaysIncomeTransations = await Income.find({
    userId,
     date:{$gte: new Date(Date.now()- 60 *24 *60 *60*1000)}
   }).sort({date:-1})
 
 const incomelast60Days = last60DaysIncomeTransations.reduce(
   (sum, transaction) => sum + transaction.quantite,0
 );
 const last30DaysIncomeTransations = await Expense.find({
    userId,
    date:{$gte: new Date(Date.now() - 30*24*60*60*1000)}

 }).sort ({date:-1})
 const  expensesLast30Days = last30DaysIncomeTransations.reduce(
    (sum,transaction) => sum +  transaction.quantite,0
 )
  
 const lastTransaction = [
    ...(await Income.find({userId}).sort({date:-1}).limit(5)).map(
        (txn)=> ({
            ...txn.toObject(),
            type:"income",
        })
    ),
...(await Expense.find({userId}).sort({date:-1}).limit(5)).map(
    (txn)=>({
        ...txn.toObject(),
        type:"expense",

    })
)

].sort((a,b)=>b.date - a.date)
 res.json({
    totaltebessa:totaltebessa[0]?.total || 0,
    
    totalkhanshla: totalkhanshla[0]?.total || 0,
    totalsouk_ahras: totalsouk_ahras[0]?.total || 0,
    last30DaysExpenses:{
        total:expensesLast30Days,
        transaction:last30DaysIncomeTransations,
    },
    last60DaysIncome:{
        total:incomelast60Days,
        transaction:last60DaysIncomeTransations


    },
    recentTransactions:lastTransaction

 })
 }catch(error){
    res.status(500).json({message:"Server Error", error})
    
    }}
/*
    // controllers/statsController.js
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
};*/
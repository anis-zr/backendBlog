require("dotenv").config()
const express = require("express")
const cors= require("cors")
const {connectDB }= require("./config/db")
const authRoutes = require("./routes/authRoutes")
const dashboardRoutes= require("./routes/dashboardRoutes")
const incomeRoutes= require("./routes/incomeRoutes")
const expenseRoutes= require("./routes/expenseRoutes")
const budgettRoutes= require("./routes/budgettRoutes")

const budgetRoutes= require("./routes/budgetRoutes")
const statsRoutes= require("./routes/statsRoutes")
const statssRoutes= require("./routes/statssRoutes")
const targetRoutes= require("./routes/targetRoutes")
const targettRoutes= require("./routes/targettRoutes")
const app = express();



app.use(cors({
    origin:" http://localhost:5173",
    methods: ["GET","POST","PUT","DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials:true,
}));
app.use(express.json());

connectDB();





app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/budgett", budgettRoutes);
app.use("/api/v1/income", incomeRoutes);
app.use("/api/v1/expense", expenseRoutes);

app.use("/api/v1/dashboard", dashboardRoutes);
app.use("/api/v1/budget",budgetRoutes);
app.use("/api/v1/target",targetRoutes);
app.use("/api/v1/targett",targettRoutes);
app.use("/api/v1/stats",statsRoutes);
app.use("/api/v1/statss",statssRoutes);

//app.use("/uploads",express.static(path.join(__dirname,"uploads")))

const PORT = process.env.PORT ||8000;
app.listen(PORT , ()=> console.log(`Server running on port ${PORT}`))
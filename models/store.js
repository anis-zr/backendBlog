

 const mongoose = require('mongoose');
 const bcrypt = require('bcryptjs');
const storeSchema = new mongoose.Schema
({
    
     email: { type: String, required: true, unique: true }, 
     password: { type: String, required: true }, 
     
   resetPasswordToken: String, resetPasswordExpire: Date, },
         { timestamps: true });
storeSchema.pre('save', async function (next) {
     if (!this.isModified('password')) 
    return next(); this.password = await bcrypt.hash(this.password, 10); next(); });
storeSchema.methods.matchPassword = async function (enteredPassword) { return await bcrypt.compare(enteredPassword, this.password); };
module.exports = mongoose.model('Store', storeSchema);
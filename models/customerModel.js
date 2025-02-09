const mongoose = require("mongoose");

const customerSchema = new mongoose.Schema({
    name: { type: String},
    phone: { type: String},
    purchaseHistory: [{
        billId: { 
            type: mongoose.Schema.Types.ObjectId, 
            ref: "Bill" }
    }],

    debt: { type: Number},
    
    RewardPoints: { type: Number},
    
}, { timestamps: true });

module.exports = mongoose.models.Customer || mongoose.model("Customer", customerSchema);

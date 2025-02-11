const billingModel = require("../models/billingModel");
const customerModel = require("../models/customerModel");
const productModel = require("../models/productModel");

exports.createBill = async (req,res) =>{
    try{
        let { name,phone, amount, paymentMode,items } = req.body;
        const shopkeeperId=req.user._id;

        const user = await customerModel.findOne({ phone });
     
        if (!user) {
        
        const newCustomer = new customerModel({ name, phone});
        await newCustomer.save();
          user=newCustomer;
        };
         
       
          if(user.RewardPoints==50)
            
            {amount-=user.RewardPoints;
            let c=0;
            await customerModel.findByIdAndUpdate(user._id, {RewardPoints:c}
            );
        }
        else{

              if(amount>=1000)
              {   let c=user.RewardPoints+10;
                  await customerModel.findByIdAndUpdate(user._id, {RewardPoints:c}
                );
              }
        }
    

       
            for (const item of items) {
                let product = await productModel.findById(item.productId);
                if (product) {
                    console.log("hey");
                    if (product.stock >= item.quantity) {
                        product.stock -= item.quantity;
                        await product.save();
                    } else {
                        return res.status(400).json({ success: false, message: `Insufficient stock for ${product.name}` });
                    }
                }
            }
        











        let newBill = new billingModel({ shopkeeperId, customerId:user._id, amount, paymentMode ,items});
        await newBill.save();
       
        await customerModel.findByIdAndUpdate(user._id, { 
            $push: { purchaseHistory: newBill._id } 
        });

        let updatedCustomer = await customerModel.findById(user._id).populate("purchaseHistory");

               
        res.status(201).json({ success: true, message: "Bill created successfully",customer: updatedCustomer });
       } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
}


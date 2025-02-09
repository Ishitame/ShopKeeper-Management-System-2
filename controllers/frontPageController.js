const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const shopkeeperModel = require("../models/shopkeeperModel");


exports.signup = async (req, res) => {
  
    const { name, email, password, phone, location,shopname } = req.body;

    
    const existing = await shopkeeperModel.findOne({ email });
    if (existing) return res.status(400).json({ message: "Email already registered" });
    
    const user = new shopkeeperModel({ name, email, password, phone, location,shopname  });
    await user.save();

    res.status(201).json({ success: true, message: "Shopkeeper registered successfully" });
  } 


  exports.login = async (req, res) => {
    
      const { email, password } = req.body;
  
      const user = await shopkeeperModel.findOne({ email });
      if (!user) return res.status(400).json({ message: "Invalid email or password" });
  
      const check = await bcrypt.compare(password, user.password);
      if (!check) return res.status(400).json({ message: "Invalid email or password" });
  
      const token = jwt.sign(
        { id: user._id, email: user.email }, 
        process.env.JWT_SECRET, 
        { expiresIn: "7d" }
      );
  
      
      res.cookie("token", token);
  
      res.status(200).json({ 
        success: true, 
        message: "Shopkeeper logged in successfully",
        token
        
      });
    
  };

  exports.getProfile = async (req, res) => {
    try {
      const user = await shopkeeperModel.findById(req.user._id).select("-password");
      if (!user) return res.status(404).json({ message: "User not found" });
  
      res.json(user);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };
  

  exports.logout = (req, res) => {
  res.cookie("token", "", {
    httpOnly: true,
    expires: new Date(0)
  });
  res.json({ success: true, message: "You have logged out" });
};
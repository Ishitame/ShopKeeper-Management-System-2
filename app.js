const express= require('express')
const dotenv = require("dotenv");
const cookieParser=require("cookie-parser")
dotenv.config();
const connectDB = require('./config/mongoConfig');
const authRoutes= require('./routes/frontPage');
const productRoutes = require('./routes/productPage');



connectDB();

const app = express();

app.use(express.json());

app.use(express.urlencoded({ extended: true }));
app.use(cookieParser()); 

app.use("/api/auth", authRoutes);
app.use("/api/product", productRoutes);


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
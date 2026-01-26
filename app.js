import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import multer from "multer";
import path from "path";
import fs from "fs";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import cookieParser from "cookie-parser";
import { fileURLToPath } from "url";
import { dirname } from "path"; 
import connectDB from "./db/DBConnection.js";
import authenticationRouter from './routers/authentication.router.js';
import usersRouter from './routers/user.router.js';
import productRouter from './routers/product.router.js';
import orderRouter from './routers/order.router.js';
import paymentRouter from './routers/payment.router.js';
import supportRouter from './routers/support.router.js'



// import { loadEmailAccounts } from './util/emailAccounts.js'


// import categoryRouter from './routers/category.router.js';

// Get the directory name for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables
dotenv.config({ path: path.join(__dirname, '.env') });
console.log("GOOGLE_CLIENT_ID:", process.env.GOOGLE_CLIENT_ID);
console.log("GOOGLE_REDIRECT_URI:", process.env.GOOGLE_REDIRECT_URI);


const app = express();
const port = process.env.PORT || 3000;
console.log('Mongo URI:', process.env.MONGO_URI);
console.log('JWT_SECRET:', process.env.JWT_SECRET ? 'Loaded ✓' : 'NOT FOUND ✗');

connectDB();
// dotenv.config();
// loadEmailAccounts(); // ✅ run once at startup
// Middleware
app.use(cors({
    origin: ["http://localhost:5173","http://localhost:5174","https://idoeladclient.onrender.com","https://idofinalprojectdhshboard.onrender.com"],
    credentials: true,
  }));
  
  console.log("GOOGLE_CLIENT_ID:", process.env.GOOGLE_CLIENT_ID);
console.log("GOOGLE_CLIENT_SECRET:", process.env.GOOGLE_CLIENT_SECRET ? "Loaded ✓" : "❌ MISSING");
console.log("GOOGLE_REDIRECT_URI:", process.env.GOOGLE_REDIRECT_URI);
 app.use(bodyParser.json());
 app.use(bodyParser.urlencoded({ extended: true }));
 app.use(cookieParser());
 
 app.use(express.json());
 app.use(express.urlencoded({ extended: true }));

// API Routes
app.use('/ido_shop_api/auth', authenticationRouter);
app.use('/ido_shop_api/users', usersRouter);
app.use('/ido_shop_api/products', productRouter);
app.use('/ido_shop_api/orders', orderRouter);
app.use('/ido_shop_api/payment', orderRouter);
app.use('/ido_shop_api/support', supportRouter);

// app.use('/ido_shop_api/categories', categoryRouter);


 app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
    console.log(`http://localhost:${port}`);
});

import usersModel from '../models/user.model.js';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import path from 'path';
import { google } from "googleapis";
import { OAuth2Client } from "google-auth-library"


import { emailValidationTemplate, resetPasswordTemplate } from '../templets/email.template.js';
import { token } from 'morgan';
import { config } from 'dotenv';
config()

const oauth2Client = new OAuth2Client(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    process.env.GOOGLE_REDIRECT_URI

);
console.log('google client id',process.env.GOOGLE_CLIENT_ID,)
export default {

  

createUser: async (req, res) => {
  try {
    const { user_email } = req.body;

    if (!user_email) {
      return res.status(400).json({ success: false, message: "Email is required" });
    }

    const existingUser = await usersModel.findOne({ user_email });
    if (existingUser) {
      return res.status(409).json({ success: false, message: "User already exists" });
    }

    const verificationToken = crypto.randomBytes(32).toString("hex");

    const user = await usersModel.create({
      ...req.body,
      user_email_verification_token: verificationToken,
      user_email_verification_token_expires_at: Date.now() + 1000 * 60 * 60,
      user_email_verified: false
    });

    const verificationUrl = `${req.protocol}://${req.get("host")}/ido_shop_api/auth/verify-email?token=${verificationToken}`;
    await emailValidationTemplate(user, verificationUrl);

    // ✅ ADD: create JWT
    const token = jwt.sign(
      { id: user._id, user_role: user.user_role },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    // ✅ SEND TOKEN IN JSON (for localStorage)
    return res.status(201).json({
      success: true,
      token,
      user: {
        _id: user._id,
        user_name: user.user_name,
        user_email: user.user_email,
        user_role: user.user_role
      }
    });

  } catch (error) {
    console.error(error);

    if (error.code === 11000) {
      return res.status(409).json({ success: false, message: "User already exists" });
    }

    return res.status(500).json({ success: false, message: "Server error" });
  }
},



    loginUser: async (req, res) => {
        try {
          const { user_email, user_password } = req.body;
      
          const user = await usersModel.findOne({ user_email });
          if (!user) {
            return res.status(404).json({ message: "User not found" });
          }
      
          if (!user.user_email_verified) {
            return res.status(403).json({ message: "Email not verified" });
          }
      
          const isPasswordCorrect = await user.comparePassword(user_password);
          if (!isPasswordCorrect) {
            return res.status(401).json({ message: "Invalid password" });
          }
      
          if (!process.env.JWT_SECRET) {
            return res.status(500).json({ message: "JWT_SECRET not configured" });
          }
      
          const token = jwt.sign(
            { id: user._id, user_role: user.user_role },
            process.env.JWT_SECRET,
            { expiresIn: "1h" }
          );
      
          res.cookie("token", token, {
            httpOnly: true,
            secure: true,
            sameSite: "strict",
            maxAge: 1000 * 60 * 60
          });
      
          console.log("user submitted ok!!!!");
      
          // 🚨 SEND RESPONSE ONCE AND EXIT
          return res.status(200).json({
            token,
            user: {
              _id: user._id,
              user_name: user.user_name,
              user_email: user.user_email,
              user_role: user.user_role
            }
          });
      
        } catch (error) {
          console.error(error);
      
          // ⛔ prevent double response
          if (res.headersSent) return;
      
          return res.status(500).json({ message: error.message });
        }
      },
      
      logoutUser: async (req, res) => {
        try {
          // Clear the cookie
          res.clearCookie("token", { httpOnly: true, secure: true });
      
          // ✅ Send response (frontend will remove localStorage token)
          return res.status(200).json({
            message: "User logged out successfully",
            success: true
          });
        } catch (error) {
          console.error(error);
          return res.status(500).json({ message: error.message, success: false });
        }
      },
      
    validateEmail: async (req, res) => {
        try {
            const { token } = req.query;
            const user = await usersModel.findOne({ user_email_verification_token: token });
            if (!user) {
                throw new Error('Invalid token');
            }
            if (user.user_email_verification_token_expires_at < Date.now()) {
                throw new Error('Token expired');
            }

            user.user_email_verified = true;
            user.user_email_verification_token = null;
            user.user_email_verification_token_expires_at = null;

            await user.save();
            res.status(200).sendFile(path.join(process.cwd(), 'public', 'index.html'));
        } catch (error) {
            console.log(error);
            res.status(500).json({ message: error.message });
        }
    },
    forgotPassword: async (req, res) => {
        try {
            const { user_email } = req.body;
            const user = await usersModel.findOne({ user_email });
            if (!user) {
                res.status(200).json({ message: 'Email not found' });
                return;
            }
            const verificationToken = crypto.randomBytes(32).toString("hex");
            user.reset_password_token = verificationToken;
            user.reset_password_token_expires_at = Date.now() + 1000 * 60 * 60 * 1; // 1 hours
            await user.save();
            const resetPasswordUrl = `${process.env.FRONT_URL}auth/reset-password?token=${verificationToken}&email=${user.user_email}`;

            await resetPasswordTemplate(user, resetPasswordUrl);

            res.status(200).json({ message: 'Reset password email sent' });
        }
        catch (error) {
            console.log(error);
            res.status(500).json({ message: error.message });
        }
    },
    resetPassword: async (req, res) => {
        try {
            const { token, email, new_password } = req.body;
            const user = await usersModel.findOne({
                user_email: email,
                reset_password_token: token
            });
            if (!user) {
                throw new Error('User not found');
            }
            if (user.reset_password_token_expires_at < Date.now()) {
                throw new Error('Token expired');
            }
            user.user_password = new_password;
            user.reset_password_token = null;
            user.reset_password_token_expires_at = null;
            await user.save();
            res.status(200).json({ message: 'Password reset successfully' });
        } catch (error) {
            console.log(error);
            res.status(500).json({ message: error.message });
        }
    },
    googleLogin: async (req, res) => {
        console.log("googleLogin hit");
        try {
          const { code } = req.body;
      
          const { tokens } = await oauth2Client.getToken({
            code,
            redirect_uri: process.env.GOOGLE_REDIRECT_URI,
          });
          console.log("token", tokens);
      
          const ticket = await oauth2Client.verifyIdToken({
            idToken: tokens.id_token,
            audience: process.env.GOOGLE_CLIENT_ID,
          });
      
          const payload = ticket.getPayload();
      
          let user = await usersModel.findOne({ user_email: payload.email });
      
          if (!user) {
            user = await usersModel.create({
              user_name: payload.name,
              user_email: payload.email,
              user_password: "GOOGLE_AUTH",
              user_email_verified: true,
              google_id: payload.sub,
              user_role: "user",
              user_phone: "",
              user_adress: "",
            });
          }
      
          // ✅ CREATE JWT for frontend
          const token = jwt.sign(
            { id: user._id, user_role: user.user_role },
            process.env.JWT_SECRET,
            { expiresIn: "1h" }
          );
      
          // ✅ SEND TOKEN + SAFE USER DATA
          return res.status(200).json({
            success: true,
            token,
            user: {
              _id: user._id,
              user_name: user.user_name,
              user_email: user.user_email,
              user_role: user.user_role,
            },
          });
      
        } catch (err) {
          console.error("❌ Google login error:", err.response?.data || err.message);
          return res.status(500).json({ success: false });
        }
      },
      
      
      
    authMe: async (req, res) => {
        console.log("🔥 AUTH ME CONTROLLER HIT");
        try {
            const token = req.cookies.token;
            console.log("TOKEN:", token);
            if (!token) return res.status(401).json({ message: "Not authenticated" })

            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            console.log("DECODED:", decoded);
            const user = await usersModel.findById(decoded.id).select("-user_password");
            console.log("USER FROM DB:", user);

            res.json({ user });
            console.log("JWT_SECRET:", process.env.JWT_SECRET);
           

        } catch (err) {
            res.status(401).json({ message: "Invalid token" });
        }
    },

    
}
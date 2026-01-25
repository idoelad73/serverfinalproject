import mongoose from 'mongoose';
import bcrypt from 'bcrypt';

const userSchema = new mongoose.Schema({
    user_name: { type: String, required: true },
    user_email: { type: String, required: true, unique: true },
    user_password: { type: String, required: false },
    user_email_verified: { type: Boolean, default: false },
    user_email_verification_token: { type: String, default: '' },
    user_email_verification_token_expires_at: { type: Date, default: null },
    reset_password_token: { type: String, default: '' },
    reset_password_token_expires_at: { type: Date, default: null },
    user_role: { type: String, enum: ['admin','manager','user'], default: 'user' },
    user_adress:{type: String, default: ''},
    user_phone:{type: String, default: ''},
    google_id: { type: String, required: false, unique: true, sparse: true }
}, { timestamps: true });

userSchema.pre('save', async function (next) {
    // Only hash the password if it's a new document or the password has been modified
    if (!this.isModified('user_password')) {
        return next();
    }
    this.user_password = await bcrypt.hash(this.user_password, 10);
    next();
});

userSchema.methods.comparePassword = async function (user_password) {
    return await bcrypt.compare(user_password, this.user_password);
};

export default mongoose.model('Users', userSchema);
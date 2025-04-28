import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    phone: { type: String, required: true },
    userImage: {type: String},
    userSignature: {type: String},
    hasRD: {type: Boolean, default: false},
    hasFD: {type: Boolean, default: false},
    hasLoan: {type: Boolean, default: false},
    role: { type: String, enum: ["user", "admin"], default: "user" },
}, { timestamps: true });

export default mongoose.model('Users', UserSchema);
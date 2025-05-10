import mongoose, {Schema} from 'mongoose'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'


const OrganizerSchema = new Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
    },
    fullName: {
        type: String,
        required: true,
        trim: true,
    },
    password: {
        type: String,
        required: true,
    },
    avatar: {
        type: String,
        required: true,
    },
    phone:{
        type: String,
        required: true,
    },
    bio: {
        type: String,
        required: true,
    },
    location: {
        type: String,
        required: true,
    },
    isVerified: {
        type: Boolean,
        default: false,
    },
    futsals: [
        { 
        type: Schema.Types.ObjectId,
        ref: 'Futsal'
        },
    ],
    refreshToken: {
        type: String,
    },
}, { timestamps: true });

OrganizerSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();
    this.password = await bcrypt.hash(this.password, 10);
    next();
});

OrganizerSchema.methods.isPasswordCorrect = async function (password) {
    return await bcrypt.compare(password, this.password);
};

OrganizerSchema.methods.generateAccessToken = function () {
    return jwt.sign({
        _id: this._id,
        email: this.email,
        username: this.username,
        fullName: this.fullName
    }, process.env.ACCESS_TOKEN_SECRET, {
        expiresIn: process.env.ACCESS_TOKEN_EXPIRY
    });
};

OrganizerSchema.methods.generateRefreshToken = function () {
    return jwt.sign({
        _id: this._id,
    }, process.env.REFRESH_TOKEN_SECRET, {
        expiresIn: process.env.REFRESH_TOKEN_EXPIRY
    });
};

OrganizerSchema.methods.getProfile = function () {
    return {
        username: this.username,
        email: this.email,
        fullName: this.fullName,
        bio: this.bio,
        location: this.location,
        avatar: this.avatar
    };
};
OrganizerSchema.methods.getFutsals = function () {
    return this.futsals;
};

OrganizerSchema.methods.isVerified = function () {
    return this.isVerified;
};



export const Organizer = mongoose.model('Organizer', OrganizerSchema);
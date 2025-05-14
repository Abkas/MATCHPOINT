import mongoose, {Schema} from 'mongoose'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'
import mongooseAggregatePaginate from 'mongoose-aggregate-paginate-v2'


const UserSchema = new Schema(
    {
        username:{
            type: String,
            required: true,
            unique: true,
            trim: true,
            lowercase: true,
            minLength: 3,
            maxLength: 20,
            index: true,
        },
          role: {
            type: String,
            enum: ['player', 'organizer'],
            required: true,
        },
        email:{
            type: String,
            required: true,
            unique: true,
            trim: true,
            lowercase: true,
        },
        fullName:{
            type: String,
            required: true,
            trim: true,
            index: true
        },
        password:{
            type: String,
            required: [true,'Password is required'],
            minLength: 6,
            maxLength: 20,
        },
        avatar:{
            type:String, //Cloudinary URL
            required: true,
            //default = 
        },
        refreshToken:{
            type: String,
        },
        matchHistory: [
        { 
            type: Schema.Types.ObjectId, 
            ref: 'Game' 
        }],
        phoneNumber: {
            type: String,
            required: true,
            unique: true,
            trim: true,
        },

},{timestamps: true})

UserSchema.pre('save', async function(next) {
    if (!this.isModified('password')) return next()
    this.password = await bcrypt.hash(this.password, 10)
    next()
})

UserSchema.methods.isPasswordCorrect = async function(password){
   return await bcrypt.compare(password, this.password)
}

UserSchema.methods.generateAccessToken = function(){
    return jwt.sign(
        {
            _id : this._id,
            email:this.email,
            username:this.username,
            fullName:this.fullName
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY
        }
    )
}

UserSchema.methods.generateRefreshToken = function(){
    return jwt.sign(
        {
            _id : this._id,
        },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn: process.env.REFRESH_TOKEN_EXPIRY
        }
    )
}



export const User = mongoose.model('User', UserSchema)
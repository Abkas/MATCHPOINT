import mongoose, {Schema} from 'mongoose'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'


const PlayerSchema = new Schema(
    {
        username:{
            typer: String,
            required: true,
            unique: true,
            trim: true,
            lowercase: true,
            minLength: 3,
            maxLength: 20,
            index: true,
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
        skillLevel:{
            type: String,
            enum: ['beginner', 'intermediate', 'advanced'],
            default: 'beginner',
        },
        location:{
            type: String,
            required: true,
            trim: true,
        },
        bio:{
            type: String,
            required: true,
            trim: true,
        },
        preferences:{
            type: String,
            enum: ['casual', 'competitive'],
            default: 'casual',
        },
        availability:{
            type: String,
            enum: ['weekdays', 'weekends', 'both'],
            default: 'both',
        },
        matchHistory: [
            { 
            type: Schema.Types.ObjectId,
            ref: 'Game' }
            ],
        friends: [
            { 
            type: Schema.Types.ObjectId,
            ref: 'Player' 
            }
        ],
        followedFutsals: [
            { 
            type: Schema.Types.ObjectId,
            ref: 'Futsal' 
            }
        ],
        refreshToken:{
            type: String,
        },

        phoneNumber: {
            type: String,
            required: true,
            unique: true,
            trim: true,
        },
        reviews: [
            {
                player: { 
                    type: Schema.Types.ObjectId, 
                    ref: 'Player' 
                },
                comment: String,
                rating: Number,
            }
        ]

},{timestamps: true})




PlayerSchema.pre('save', async function(next) {
    if (!this.isModified('password')) return next()
    this.password = await bcrypt.hash(this.password, 10)
    next()
})

PlayerSchema.methods.isPasswordCorrect = async function(password){
   return await bcrypt.compare(password, this.password)
}

PlayerSchema.methods.generateAccesstoken = function(){
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


PlayerSchema.methods.generateRefreshtoken = function(){
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



export const Player = mongoose.model('Player', PlayerSchema)
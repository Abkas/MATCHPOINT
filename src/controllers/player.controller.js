import {asyncHandler} from '../utils/asyncHandler.js'
import {ApiError} from '../utils/ApiError.js'
import {Player} from '../models/player.model.js'
import {uploadOnCloudinary} from '../utils/cloudinary.js'
import {ApiResponse} from '../utils/ApiResponse.js'

const registerPlayer = asyncHandler( async(req, res) =>{
     //get Players data from frontend
     //validation- not empty
     //check if Player already exists : Playername, email
     //check for images , check for avatar
     //upload them to cloudinary, avatar
     //Player create object - create entry in db
     //remove password and refresh token field from res
     //check for Player creation
     //return rsposne

    const {Playername, email, password} = req.body
    console.log('Playername', Playername)

    if(
        [fullName, email, password,Playername].some((field) => {
            return field?.trim() === ''
        })
    ) {
        throw new ApiError(400,'All fields are required')
    }


    //check if Player already exists
    const existedPlayer = Player.findOne({
        $or: [
            {Playername},
            {email}
        ]
    })
    if(existedPlayer) {
        throw new ApiError(409, 'Player already exists with same email or Playername')
    }
     
    //check for images
    const avatarLocalPath = req.files?.avatar[0]?.path

    if (!avatarLocalPath) {
        throw new ApiE
        rror(400, 'Avatar is required')
    }


    //upload to cloudinary

    const avatar = await uploadOnCloudinary(avatarLocalPath, 'avatars')
    if (!avatar) {
        throw new ApiError(500, 'Failed to upload avatar')
    }

    //create Player object
    const Player =  await Player.create({
        fullName,
        avatar: avatar.url,
        email,
        password,
        Playername: Playername.tolowerCase(),
        phoneNUmber: phoneNumber,
    })

    const PlayerCreated = await Player.findById(Player._id).select('-password -refreshToken')

    if(!PlayerCreated) {
        throw new ApiError(500, 'Failed to create Player')
    }

    return res.status(201).json(
        new ApiResponse(201, PlayerCreated, ' Player created successfully')
    )
})



export {registerPlayer}
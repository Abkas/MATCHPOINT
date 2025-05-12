import {asyncHandler} from '../utils/asyncHandler.js'
import {ApiError} from '../utils/ApiError.js'
import {Player} from '../models/player.model.js'
import {uploadOnCloudinary} from '../utils/cloudinary.js'
import {ApiResponse} from '../utils/ApiResponse.js'

const generateAccessTokenAndRefreshToken = async (PlayerId) =>{
    try{
        const player = await Player.findById(PlayerId)
        const accessToken = player.generateAccessToken()
        const refreshToken = player.generateRefreshToken()

        player.refreshToken = refreshToken
        await player.save({validateBeforeSave: false})

        return { accessToken, refreshToken }
    }catch(error){
        throw new ApiError(500, 'Failed to generate access token and refresh token')
    }
}


const registerPlayer = asyncHandler( async(req, res) =>{
     //get Players data from frontend
     //validation- not empty
     //check if Player already exists : username, email
     //check for images , check for avatar
     //upload them to cloudinary, avatar
     //Player create object - create entry in db
     //remove password and refresh token field from res
     //check for Player creation
     //return response

    const {username, email, password, fullName, phoneNumber, bio, location} = req.body
    console.log(reqbody)

    if(
        [fullName, email, password, username, phoneNumber, bio, location].some((field) => {
            return field?.trim() === ''
        })
    ) {
        throw new ApiError(400,'All fields are required')
    }


    //check if Player already exists
    const existedPlayer = await Player.findOne({
        $or: [
            {username},
            {email}
        ]
    })
    if(existedPlayer) {
        throw new ApiError(409, 'Player already exists with same email or username')
    }
     
    //check for images
    const avatarLocalPath = req.files && req.files.avatar && req.files.avatar[0] ? req.files.avatar[0].path : null;

    if (!avatarLocalPath) {
        throw new ApiError(400, 'Avatar is required');
    }


    //upload to cloudinary

    const avatar = await uploadOnCloudinary(avatarLocalPath, 'avatars')
    if (!avatar) {
        throw new ApiError(500, 'Failed to upload avatar')
    }

    //create Player object
    const newPlayer =  await Player.create({
        username,
        avatar: avatar.url,
        email,
        password,
        fullName: fullName.toLowerCase(),
        phoneNumber,
        bio,
        location
    })

    const PlayerCreated = await Player.findById(newPlayer._id).select('-password -refreshToken')

    if(!PlayerCreated) {
        throw new ApiError(500, 'Failed to create Player')
    }

    return res.status(201).json(
        new ApiResponse(201, PlayerCreated, 'Player created successfully')
    )
})

const loginPlayer = asyncHandler(async (req, res) => {
    //get login details from frontend
    //validate entry => email and password
    //check if players exists
    //valdiate password
    //generate access token and refresh token
    //send cookie
    //login player
    //return response


    const {email, password} = req.body

    if(!email || !password) {
        throw new ApiError(400, 'Email and password are required')
    }

    const existedPlayer = await Player.findOne({email})
     if(!existedPlayer){
        throw new ApiError(404, 'Player not found')
     }

    const isPasswordCorrect = await existedPlayer.isPasswordCorrect(password)
    if(!isPasswordCorrect){
        throw new ApiError(401, 'Invalid password')
    }

    const {accessToken, refreshToken} = await generateAccessTokenAndRefreshToken(existedPlayer._id)

    const LoggedInPlayer = await Player.findById(existedPlayer._id).select('-password -refreshToken')

    const options = {
        httpOnly: true,
        secure: true
    }

    return  res
    .status(200)
    .cookie('refreshToken', refreshToken, options)
    .cookie('accessToken', accessToken, options)
    .json(
        new ApiResponse(
            200,
            {
                player : LoggedInPlayer,
                accessToken,
                refreshToken
            },
            'User logged in successfully'
        )
    )


})

const logoutPlayer = asyncHandler(async (req, res) => {
    await Player.findByIdAndUpdate(
        req.player._id,
        {
            $set:{
                refreshToken: undefined
            }
        },
        {
            new: true
        }
    )

    const options = {
        httpOnly: true,
        secure: true
    }

    return res
    .status(200)
    .clearCookie('accessToken',options)
    .clearCookie('refreshToken',options)
    .json(
        new ApiResponse(200,{},"User logged out")
    )


})


export {
    registerPlayer,
    loginPlayer,
    logoutPlayer
}
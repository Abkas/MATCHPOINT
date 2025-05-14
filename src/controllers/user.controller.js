import {asyncHandler} from '../utils/asyncHandler.js'
import {ApiError} from '../utils/ApiError.js'
import {User} from '../models/user.model.js'
import {uploadOnCloudinary} from '../utils/cloudinary.js'
import {ApiResponse} from '../utils/ApiResponse.js'
import jwt from 'jsonwebtoken'
import {PlayerProfile} from '../models/playerprofile.model.js'
import {OrganizerProfile} from '../models/organizerprofile.model.js'
import {Followers} from '../models/followers.model.js'


const generateAccessTokenAndRefreshToken = async (UserId) =>{
    try{
        const user = await User.findById(UserId)
        const accessToken = user.generateAccessToken()
        const refreshToken = user.generateRefreshToken()

        user.refreshToken = refreshToken
        await user.save({validateBeforeSave: false})

        return { accessToken, refreshToken }
    }catch(error){
        throw new ApiError(500, 'Failed to generate access token and refresh token')
    }
}

const registerUser = asyncHandler( async(req, res) =>{
     //get Users data from frontend
     //validation- not empty
     //check if User already exists : username, email
     //check for images , check for avatar
     //upload them to cloudinary, avatar
     //User create object - create entry in db
     //remove password and refresh token field from res
     //check for User creation
     //return response

    const {username, email, password, fullName, phoneNumber,role} = req.body
    console.log(req.body)

    if(
        [fullName, email, password, username, phoneNumber,role].some((field) => {
            return field?.trim() === ''
        })
    ) {
        throw new ApiError(400,'All fields are required')
    }


    //check if User already exists
    const existedUser = await User.findOne({
        $or: [
            {username},
            {email}
        ]
    })
    if(existedUser) {
        throw new ApiError(409, 'User already exists with same email or username')
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

    //create User object
    const newUser =  await User.create({
        username,
        avatar: avatar.url,
        email,
        password,
        fullName: fullName.toLowerCase(),
        phoneNumber,
        role
    })

    let profile

    if (role === 'player') {
        profile = await PlayerProfile.create({ user: newUser._id});
        newUser.playerProfile = profile._id;
    }else if (role === 'organizer') {
        profile = await OrganizerProfile.create({ user: newUser._id });
        newUser.organizerProfile = profile._id;
    }
    
    const UserCreated = await User.findById(newUser._id).select('-password -refreshToken')

    if(!UserCreated) {
        throw new ApiError(500, 'Failed to create User')
    }

    return res.status(201).json(
        new ApiResponse(201, UserCreated, 'User created successfully')
    )
})

const loginUser = asyncHandler(async (req, res) => {
    //get login details from frontend
    //validate entry => email and password
    //check if Users exists
    //valdiate password
    //generate access token and refresh token
    //send cookie
    //login User
    //return response


    const {email, password} = req.body
    console.log(email)

    if(!email && !password) {
        throw new ApiError(400, 'Email and password are required')
    }

    const existedUser = await User.findOne({email})
     if(!existedUser){
        throw new ApiError(404, 'User not found')
     }

    const isPasswordCorrect = await existedUser.isPasswordCorrect(password)
    if(!isPasswordCorrect){
        throw new ApiError(401, 'Invalid password')
    }

    const {accessToken, refreshToken} = await generateAccessTokenAndRefreshToken(existedUser._id)

    const LoggedInUser = await User.findById(existedUser._id).select('-password -refreshToken')

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
                User : LoggedInUser,
                accessToken,
                refreshToken
            },
            'User logged in successfully'
        )
    )


})

const logoutUser = asyncHandler(async (req, res) => {
    await User.findByIdAndUpdate(
        req.user._id,
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

const refreshAccessToken = asyncHandler(async (req, res) => {
    const incomingRefreshToken = req.cookies.refreshToken || req.body.refreshToken

    if(!incomingRefreshToken) {
        throw new ApiError(401, 'Unauthorized request')
    }

  try {
    const decodedRefreshToken = jwt.verify(incomingRefreshToken, process.env.REFRESH_TOKEN_SECRET)

    const user = await User.findById(decodedRefreshToken?._id)
    if(!user) {
        throw new ApiError(401, 'Invalid Refresh Token')
    }

    if(incomingRefreshToken !== user.refreshToken){
        throw new ApiError(401, 'Refresh token is expired or used')
    }

    const options = {
        httpOnly: true,
        secure: true
    }
        
    const {newAccessToken, newRefreshToken} = await generateAccessTokenAndRefreshToken(user._id)

    return res
    .status(200)
    .cookie('accessToken', newAccessToken, options)
    .cookie('refreshToken', newRefreshToken, options)
    .json(
        new ApiResponse(
            200,
            {
                accessToken: newAccessToken,
                refreshToken: newRefreshToken
            },
            'Access Token refreshed sucessfully'
        )
    )

  }catch(error){
    throw new ApiError(401, error?.message  ||  'invalid refresh token')
  }
})

const changeCurrentPassword = asyncHandler(async(req, res) =>{
    const{oldPassword, newPassword, confirmPassword} = req.body  

    if(!(newPassword == confirmPassword)){
        throw new ApiError(400, 'New password and confirm password do not match')
    }

    const User = await User.findById(req.user?._id) 
    const isPasswordCorrect = await User.isPasswordCorrect(oldPassword)

    if(!isPasswordCorrect){
        throw new ApiError(400,'Invalid password')
    }

    User.password = newPassword

    await user.save({validateBeforeSave: false})

    return res
    .status(200)
    .json(new ApiResponse(200, {}, 'Password changed sucessfully'))
})

const getCurrentUser = asyncHandler(async(req,res) =>{
    return res
    .status(200)
    .json(new ApiResponse(200, req.user,'current User fetched sucessfully'))
})

const updateAccountDetails = asyncHandler(async(req, res) =>{

    const updateFields = {}

    const allowedFields = [
        'email', 'fullName', 'username', 'bio', 'preferences',
        'phoneNumber', 'availability', 'location', 'skillLevel'
    ]

    allowedFields.forEach(field => {
        if (req.body[field] !== undefined) {
            updateFields[field] = req.body[field];
        }
    })

    const updatedUser = await User.findByIdAndUpdate(
        req.user?._id,
        { $set: updateFields },
        { new: true }
    ).select('-password');
   
    return res
        .status(200)
        .json(new ApiResponse(200, updatedUser, 'Account details updated successfully'))

    // const{email, fullName, username , bio, preferences ,phoneNumber, availability, location, skillLevel} = req.body

    // const User = User.findByIdAndUpdate(
    //     req.user?._id,
    //     {
    //         $set:{
    //             email,
    //             fullName,
    //             username,
    //             bio,
    //             preferences,
    //             phoneNumber,
    //             availability,
    //             location,
    //             skillLevel
    //         }
    //     },
    //     {new:true}
    // ).select('-password')

    // return res
    // .status(200)
    // .json(new ApiResponse(200, user, 'Account details updated sucessfully'))
})

const updateUserAvatar = asyncHandler(async(req,res) =>{
    const avatarLocalPath = req.file?.path

    if(!avatarLocalPath) {
        throw new ApiError(400, 'Avatar file is missing')
    }

    const avatar = await uploadOnCloudinary(avatarLocalPath)
    if(!avatar){
        throw ApiError(400, 'Error while uploading on avatar')
    }
    await User.findByIdAndUpdate(
        req.user?._id,
        {
            set:{
                avatar: avatar.url
            }
        },
        {new:true}
    ).select('-password')

    return res
        .status(200)
        .json(new ApiResponse(200, updatedUser, 'Avatar updated successfully'))

})

const getUserProfile = asyncHandler(async(req,res) =>{
    const {username } =req.params

    if(!username?.trim()){
        throw new ApiError(400, 'Username is missing')
    }

    const follow = await User.aggregate([
    {
        $match:{
            username: username?.toLowerCase()
        }
    },{
        $lookup :{
            from: 'followers',
            localField: '_id',
            foreignField: 'profile',
            as: 'profileFollowers'
        }
    },{
        $lookup:{
            from: 'followers',
            localField: '_id',
            foreignField: 'follower',
            as: 'profileFollowing'
        }
    },{
        $addFields:{
            followersCount :{
                $size: "$profileFollowers"
            },
            followingCount:{
                $size: '$profileFollowing'
            },
            isFollowing: {
                $condition: {
                    if: {$in:[req.user?._id, '$profileFollowers.follower']},
                    then: true,
                    else: false
                }
            }
        }
    },{
        $project:{
            fullName: 1,
            username : 1,
            followersCount:1,
            followingCount:1,
            isFollowing:1,
            avatar:1,
            email:1,
            role:1
        }
    }
    ])
    if(!follow?.length) {
        throw new ApiError(404, 'Follow does not exist')
    }
    return res
    .status(200)
    .json(
        new ApiResponse(200,channel[0], 'Userfollow fetched sucessfully')
    )

    console.log(follow)
})

const getGameHistory = asyncHandler(async(req,res)=>{
    const user = await User.aggregate([
        {
            $match: {
                _id: new mongoose.Types.ObjectId(req.user_id)
            }
        },{
            $lookup :{
                from: 'games',
                localField: 'matchHistory',
                foreignField: '_id',
                as: 'matchHistory',
                pipeline:[
                    {
                        $lookup:{
                            from:'playerprofiles',
                            localField: 'players',
                            foreignField: '_id',
                            as:' players',
                            pipeline:[
                                {
                                    $project:{
                                        futsal:1,
                                        result:1,
                                        players:{
                                            _id:1,
                                        },                         
                                    }
                                }
                            ]
                        }
                    },
                ]
            }

        }

    ])
    return res
    .status(200)
    .json(new ApiResponse(200, user[0].matchHistory, 'Match history fetched sucessfully'))
})


export {
    registerUser,
    loginUser,
    logoutUser,
    refreshAccessToken,
    changeCurrentPassword,
    getCurrentUser,
    updateAccountDetails,
    updateUserAvatar,
    getUserProfile,
    getGameHistory
}
import {asyncHandler} from '../utils/asyncHandler.js'
import {ApiError} from '../utils/ApiError.js'
import {User} from '../models/user.model.js'
import {uploadOnCloudinary} from '../utils/cloudinary.js'
import {ApiResponse} from '../utils/ApiResponse.js'
import jwt from 'jsonwebtoken'
import {PlayerProfile} from '../models/playerprofile.model.js'
import {OrganizerProfile} from '../models/organizerprofile.model.js'
import {Followers} from '../models/followers.model.js'
import mongoose from 'mongoose'


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

const signUpUser = asyncHandler(async (req, res) => {
    const { email, password, role, username } = req.body

    if ([password, email, username].some((field) => !field?.trim())) {
        throw new ApiError(400, 'All fields are required')
    }

    const existedUser = await User.findOne({ email })
    if (existedUser) {
        throw new ApiError(409, 'User already exists with same email')
    }

    const newUser = await User.create({ email, password, role, username })

    let profile;
    if (role === 'player') {
        profile = await PlayerProfile.create({ user: newUser._id })
        newUser.playerProfile = profile._id
    } else if (role === 'organizer') {
        profile = await OrganizerProfile.create({ user: newUser._id })
        newUser.organizerProfile = profile._id
    }

    await newUser.save();

    const userCreated = await User.findById(newUser._id).select('-password -refreshToken')

    if (!userCreated) {
        throw new ApiError(500, 'Failed to create User')
    }

    return res
    .status(201)
    .json(new ApiResponse(201, userCreated, 'User created successfully'))
})

const registerUser = asyncHandler(async (req, res) => {
    const allowedFields = [
        'fullName', 'username', 'bio', 'preferences',
        'phoneNumber', 'availability', 'location', 'skillLevel'
    ]

    const updateFields = {}
    allowedFields.forEach(field => {
        if (req.body[field] !== undefined) {
            updateFields[field] = req.body[field]
        }
    })

    if (req.files && req.files.avatar && req.files.avatar[0]) {
        const avatarLocalPath = req.files.avatar[0].path;
        const avatar = await uploadOnCloudinary(avatarLocalPath, 'avatars')
        if (!avatar || !avatar.url) {
            throw new ApiError(500, 'Failed to upload avatar')
        }
        updateFields.avatar = avatar.url
    }

    if (updateFields.username) {
        const existedUser = await User.findOne({
            username: updateFields.username,
            _id: { $ne: req.user._id }
        });
        if (existedUser) {
            throw new ApiError(409, 'User already exists with same username')
        }
    }

    const updatedUser = await User.findByIdAndUpdate(
        req.user._id,
        { $set: updateFields },
        { new: true }
    ).select('-password -refreshToken')

    if (!updatedUser) {
        throw new ApiError(500, 'User update failed')
    }

    return res
        .status(200)
        .json(new ApiResponse(200, updatedUser, 'User profile updated successfully'))
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
            $unset:{
                refreshToken: 1
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

    const user = await User.findById(req.user?._id) 
    if (!user) {
        throw new ApiError(404, 'User not found')
    }
    const isPasswordCorrect = await user.isPasswordCorrect(oldPassword)

    if(!isPasswordCorrect){
        throw new ApiError(400,'Invalid password')
    }

    user.password = newPassword

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
            $set:{
                avatar: avatar.url
            }
        },
        {new:true}
    ).select('-password')

    return res
        .status(200)
        .json(new ApiResponse(200, {}, 'Avatar updated successfully'))

})

const getUserProfileFollow = asyncHandler(async(req,res) =>{
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
                $cond: {
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
        new ApiResponse(200,follow[0], 'Userfollow fetched sucessfully')
    )

    console.log(follow)
})

const getGameHistory = asyncHandler(async(req,res)=>{
    const user = await User.aggregate([
        {
            $match: {
                _id: new mongoose.Types.ObjectId(req.user._id)
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
                            as:'players',
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
                    {
                        $addFields:{
                            players:{
                                $first:'$players'
                            }
                        }
                    }
                ]
            }
        }

    ])

    if (!user || user.length === 0) {
        throw new ApiError(404, 'User not found or has no match history');
    }

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
    getUserProfileFollow,
    getGameHistory,
    signUpUser
}
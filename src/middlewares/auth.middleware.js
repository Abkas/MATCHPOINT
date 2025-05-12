import { asyncHandler } from '../utils/asyncHandler.js'
import { ApiError } from '../utils/ApiError.js'
import jwt from 'jsonwebtoken'
import { Player } from '../models/Player.js'


export const verifyJWT = asyncHandler(async (req, res, next) => {
    try{
        const token = req.cookies?.accessToken || req.header('Authorization')?.replace('Bearer ', '')

    if(!token){
        throw  new ApiError(401, 'Unauthorized request')
    }

    const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)

    const player = await Player.findById(decodedToken?._id).select('-password -refreshToken')

    if(!player){
        throw new ApiError(401, 'Unauthorized request')
    }

    req.player = player
    next()

    }catch(error){
        throw new ApiError(401, 'Invalid access token')
    }
})
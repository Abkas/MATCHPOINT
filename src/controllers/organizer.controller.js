import { asyncHandler } from '../utils/asyncHandler.js'
import { ApiError } from '../utils/ApiError.js'
import { Futsal } from '../models/futsal.model.js'
import { ApiResponse } from '../utils/ApiResponse.js'
import { Tournament } from '../models/tournament.model.js'
import mongoose from 'mongoose'

 const createFutsal = asyncHandler(async (req, res) => {
    
    console.log(req.body)
    const { name, location, description } = req.body

    if (!name || !location) {
        throw new ApiError(400, 'Name and location are required');
    }

    const newFutsal = await Futsal.create({
        name,
        location,
        description,
        organizer: req.user._id,
    });

    return res
        .status(201)
        .json(new ApiResponse(201, newFutsal, 'Futsal created successfully'));
})

 const getFutsalsByOrganizer = asyncHandler(async (req, res) => {
    const futsals = await Futsal.find({ organizer: req.user._id })

    return res
        .status(200)
        .json(new ApiResponse(200, futsals, 'Futsals fetched successfully'))
})

 const updateFutsal = asyncHandler(async (req, res) => {
    const { id } = req.params
    const updates = req.body

    const updatedFutsal = await Futsal.findByIdAndUpdate(
        id,
        { $set: updates },
        { new: true }
    );

    if (!updatedFutsal) {
        throw new ApiError(404, 'Futsal not found')
    }

    return res
        .status(200)
        .json(new ApiResponse(200, updatedFutsal, 'Futsal updated successfully'))
})

 const deleteFutsal = asyncHandler(async (req, res) => {
    const { id } = req.params

    const deletedFutsal = await Futsal.findByIdAndDelete(id)

    if (!deletedFutsal) {
        throw new ApiError(404, 'Futsal not found')
    }

    return res
        .status(200)
        .json(new ApiResponse(200, {}, 'Futsal deleted successfully'))
})

 const createTournament = asyncHandler(async (req, res) => {
    const { name, startDate, endDate, prizes, rules, format, registrationFee,
        venue } = req.body

    if (!name || !startDate || !endDate) {
        throw new ApiError(400, 'Name, start date, and end date are required')
    }

    const newTournament = await Tournament.create({
        name,
        organizer: req.user._id,
        startDate,
        endDate,
        prizes,
        rules,
        format,
        registrationFee,
        venue,
    });

    return res
        .status(201)
        .json(new ApiResponse(201, newTournament, 'Tournament created successfully'))
})

export {
    createFutsal,
    getFutsalsByOrganizer,
    updateFutsal,
    deleteFutsal,
    createTournament,
}
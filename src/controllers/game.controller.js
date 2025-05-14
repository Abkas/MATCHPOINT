import { asyncHandler } from '../utils/asyncHandler.js'
import { ApiError } from '../utils/ApiError.js'
import { Game } from '../models/game.model.js'
import { Slot } from '../models/slot.model.js'
import { ApiResponse } from '../utils/ApiResponse.js'

const getGameById = asyncHandler(async (req, res) => {
    const { gameId } = req.params

    const game = await Game.findById(gameId)
        .populate('futsal')   
        .populate('slot') 
        .populate('players')
        .populate('feedbacks.player')

    if (!game) {
        throw new ApiError(404, 'Game not found')
    }

    return res
    .status(200)
    .json(new ApiResponse(200, game, 'Game retrieved successfully'));
})


const createGame = asyncHandler(async(req,res) =>{

    const{organizer} = user._id
    const{futsal, slot, players, result} =req.body

    if (!futsal || !slot) {
        throw new ApiError(400, 'Futsal and slot are required')
    }

    const newGame = new Game({ futsal, slot, players, result })
    await newGame.save()

    return res
    .status(201)
    .json(new ApiResponse(201, newGame, 'Game created successfully'))
})

const getGamesById = asyncHandler(async(req,res) =>{
    const{id} = req.params

    const game = await Game.findIdBy(id).populate('players')

    if (!game) {
        throw new ApiError(404, 'Game not found')
    }

    return res
    .status(200)
    .json(new ApiResponse(200, game, 'Game details fetched successfully'))
})

const deleteGame = asyncHandler(async (req, res) => {
    const {id} = req.params

    const deletedGame = await Game.findByIdAndDelete(id)

    if (!deletedGame) {
        throw new ApiError(404, 'Game not found');
    }

    return res
    .status(200)
    .json(new ApiResponse(200, {}, 'Game deleted successfully'))
})

const updateGame = asyncHandler(async (req, res) => {
    const {id} = req.params
    const updates = req.body

    const updatedGame = await Game.findByIdAndUpdate(
        id,
        {$set:updates},
        {new: true})

    if (!updatedGame) {
        throw new ApiError(404, 'Game not found')
    }

    return res
    .status(200)
    .json(new ApiResponse(200, updatedGame, 'Game updated successfully'))
})

const updateGameResult = asyncHandler(async (req, res) => {
    const {result} = req.body
    const {gameId} = req.params
    const game = await Game.findById(gameId)

    if (!game) {
        throw new ApiError(404, 'Game not found')
    }
    game.result = result
    await game.save()

    return res
    .status(200)
    .json(new ApiResponse(200, game, 'Game result updated successfully'))
})

const addFeedback = asyncHandler(async (req, res) => {
    const { comment, rating } = req.body
    const {gameId} = req.params
    const{playerId} = req.user

    const game = await Game.findById(gameId)

    if (!game) {
        throw new ApiError(404, 'Game not found')
    }

    game.addFeedback(playerId, comment, rating)

    return res
    .status(200)
    .json(new ApiResponse(200, game, 'Feedback added successfully'))
})

export {
    createGame,
    deleteGame,
    updateGame,
    getGamesById,
    updateGameResult,
    addFeedback,
}
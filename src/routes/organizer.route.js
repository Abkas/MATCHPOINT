import { Router } from 'express';
import {
    createFutsal,
    getFutsalsByOrganizer,
    updateFutsal,
    deleteFutsal,
    createTournament,
} from '../controllers/organizer.controller.js';
import { verifyJWT } from '../middlewares/auth.middleware.js';

const router = Router();

router
.route('/create-futsal')
.post(verifyJWT, createFutsal)

router
.route('/organizer-futsals')
.get(verifyJWT, getFutsalsByOrganizer)

router
.route('/update-futsal/:id')
.patch(verifyJWT, updateFutsal)

router
.route('/delete-futsal/:id')
.delete(verifyJWT, deleteFutsal)

router
.route('/create-tournaments')
.post(verifyJWT, createTournament)

export default router
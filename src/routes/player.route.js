import {Router} from 'express'
import {registerPlayer, loginPlayer, logoutPlayer} from '../controllers/player.controller.js'
import {upload} from '../middlewares/multer.middleware.js'
import {verifyJWT} from '../middlewares/auth.middleware.js'


const router = Router()

router.route('/register').post(
    upload.fields([
        {
            name: 'avatar',
            maxCount: 1
        }
    ]),
    registerPlayer
)

router.route('/login').post(
    loginPlayer
)

//secured routes
router.route('/logout').post(verifyJWT, logoutPlayer)

export default router   
import {Router} from 'express'
import {registerPlayer} from '../controllers/player.controller.js'
import {upload} from '../middlewares/multer.middleware.js'

const router = Router()

router.route('/register').post(
    upload.fields([
        {
            name: 'avatar',
            maxCount: 1
        }
    ]),
    registerUser
)

export default router   
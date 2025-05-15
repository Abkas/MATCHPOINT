import {Router} from 'express'
import {
    registerUser, 
    loginUser, 
    signUpUser,
    logoutUser, 
    refreshAccessToken,
    getGameHistory, 
    changeCurrentPassword,
    getCurrentUser,
    getUserProfileFollow,
    updateAccountDetails,
    updateUserAvatar
} from '../controllers/user.controller.js'
import {upload} from '../middlewares/multer.middleware.js'
import {verifyJWT} from '../middlewares/auth.middleware.js'


const router = Router()

router
.route('/login')
.post(
    loginUser
)

router
.route('/sign-up')
.post(
    signUpUser
)

//secured routes
router
.route('/logout')
.post(verifyJWT, logoutUser)

router
.route('/refresh-token')
.post(refreshAccessToken)

router
.route('/change-password')
.post(verifyJWT, changeCurrentPassword)

router
.route('/current-user')
.get(verifyJWT, getCurrentUser)

router
.route('/update-account')
.patch(verifyJWT,updateAccountDetails )

router
.route('/avatar')
.patch(verifyJWT, upload.single('avatar'),updateUserAvatar)

router
.route('/c/:username')
.get(verifyJWT, getUserProfileFollow)

router
.route('/history')
.get(verifyJWT, getGameHistory)

router
.route('/register').
post(verifyJWT,
    upload.fields([
        {
            name: 'avatar',
            maxCount: 1
        }
    ]),
    registerUser
)


export default router   

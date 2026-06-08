const express = require('express')

const userController = require('../Controllers/userController')
const bookController = require('../Controllers/bookController')
const jobController=require('../Controllers/jobController')
const pdfmulterConfig=require('../Middlewares/pdfMulterMiddleware')

const jwtmiddle =  require('../Middlewares/jwtMiddleware')
const multerConfig=require('../Middlewares/multerMiddleware')
const adminJwtMiddle=require('../Middlewares/adminJwtMiddleware')
const applicationcontroller=require('../Controllers/applicationController')

const router = express.Router()

// USER
//user
router.post('/signup',userController.signup)
router.post('/signin',userController.signin)
router.post('/google-login',userController.googleSignin)
router.get('/get-profile',jwtmiddle,userController.getProfile)
router.put('/profile-update',jwtmiddle,multerConfig.single('profile'),userController.profileUpdate)
//books
router.post('/add-book',jwtmiddle,multerConfig.array('uploadImg',3),bookController.addBook)
router.get('/all-books',jwtmiddle,bookController.allBookList)
router.get('/getBookById/:bid',jwtmiddle,bookController.getBookById)
router.get('/latest-books',bookController.latestBooksList)
router.get('/user-books',jwtmiddle,bookController.getUserBooks)
router.delete('/get-book/:bid/delete',bookController.deleteBookById)
router.get('/bought-books',jwtmiddle,bookController.getBoughtBooks)
router.get('/list-jobpost',jwtmiddle,jobController.listJobPosts)
router.post('/apply-jobpost',jwtmiddle,pdfmulterConfig.single('resume'),applicationcontroller.addApplication)
router.post('/purchase-book',jwtmiddle,bookController.purchaseBookStripe)


// ADMIN
router.get('/admin/get-books',adminJwtMiddle,bookController.getAdminAllBooks)
router.get('/admin/get-users',adminJwtMiddle,userController.getAdminAllUsers)
router.patch('/admin/approve-book/:bid',adminJwtMiddle,bookController.approveBook)
router.post('/admin/add-jobpost',adminJwtMiddle,jobController.addJobPost)
router.get('/admin/list-jobpost',adminJwtMiddle,jobController.listJobPosts)
router.delete('/admin/delete-jobpost/:jid',adminJwtMiddle,jobController.deleteJobPost)
router.get('/admin/get-application',adminJwtMiddle,applicationcontroller.listApplications)
router.put('/admin/update-profile',adminJwtMiddle,multerConfig.single('profile'),userController.adminProfileUpdate)


module.exports = router
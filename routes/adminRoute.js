const express =require('express');
const authMiddleware = require("../middleware/authMiddleware");
const { getAllUsersController, getAllDoctorsController, changeAccountStatusController } = require('../controllers/adminContoller');
const router = express.Router();

// GET METHOD || users
router.get('/getAllUsers',authMiddleware,getAllUsersController)

router.get('/getAllDoctors',authMiddleware,getAllDoctorsController);
//post accouns status
router.post('/changeAccountStatus' ,authMiddleware,changeAccountStatusController);



module.exports = router;
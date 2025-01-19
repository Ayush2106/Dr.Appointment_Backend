const express = require("express")
const authMiddleware =require('../middleware/authMiddleware');
const { getDoctorInfoController, updateProfileController, getDoctorByIdController, doctorAppointmentsController, updateStatusController } = require("../controllers/doctorController");
const router =express.Router();

//post single doctor info
router.post('/getDoctorInfo',authMiddleware,getDoctorInfoController)

//POST UPDATE DOCTOR PROFFILE 
router.post('/updateProfile',authMiddleware,updateProfileController)

//get single doctor
router.post('/getDoctorById',authMiddleware,getDoctorByIdController);

//GET Appointments
router.get( "/doctor-appointments", authMiddleware, doctorAppointmentsController);
  
//status approve or reject
router.post('/update-status',authMiddleware,updateStatusController)

module.exports = router
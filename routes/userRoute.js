const express = require("express");
const { loginController, registerController, authController, applyDoctorController, getAllNotificatonController, deleteAllNotificatonController, getAllDoctorController, bookAppointmentController, bookingAvailabilityController, userAppointmentsController } = require("../controllers/userController");
const authMiddleware = require("../middleware/authMiddleware");
const router=express.Router();

router.post("/login",loginController)
router.post("/register",registerController)

// AUTH||POST
router.post("/getUserData",authMiddleware,authController)

// Apply Doctor Post
router.post("/apply-doctor",authMiddleware,applyDoctorController)

// Notification  Doctor Post
router.post("/get-all-notification",authMiddleware,getAllNotificatonController);

//  delete all Notification  Doctor Post
router.post("/delete-all-notification",authMiddleware,deleteAllNotificatonController);

//get all doctor
router.get('/getAllDoctor',authMiddleware,getAllDoctorController)

//book appointment
router.post('/book-appointment',authMiddleware,bookAppointmentController)

//booking availability 
router.post('/booking-availability',authMiddleware,bookingAvailabilityController)

// appointment list
router.get('/user-appointments',authMiddleware,userAppointmentsController)

module.exports=router;
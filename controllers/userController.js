const userModel = require("../models/userModel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const doctorModel =require("../models/doctorModel")
const appointmentModel =require('../models/appoitmentModel')
const moment = require('moment')
//register callback
const registerController = async (req, res) => {
  try {
    const exisitingUser = await userModel.findOne({ email: req.body.email });
    if (exisitingUser) {
      return res
        .status(200)
        .send({ message: "User Already Exist", success: false });
    }
    const password = req.body.password;
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    req.body.password = hashedPassword;
    const newUser = new userModel(req.body);
    await newUser.save();
    res.status(201).send({ message: "Register Sucessfully", success: true });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: `Register Controller ${error.message}`,
    });
  }
};

// login callback
const loginController = async (req, res) => {
  try {
    const user = await userModel.findOne({ email: req.body.email});
    if (!user) {
      return res
        .status(200)
        .send({ message: "user not found", success: false });
    }
    const isMatch = await bcrypt.compare(req.body.password, user.password);
    if (!isMatch) {
      return res
        .status(401)
        .send({ message: "Invalid EMail or Password", success: false });
    }
    const token = jwt.sign({ id: user._id }, process.env.JSONWEBTOKEN, {
      expiresIn: "1d",
    }); 
    res.status(200).send({ message: "Login Success", success: true, token });
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: `Error in Login CTRL ${error.message}` });
  }
};
 

const authController = async(req,res)=>{
    try{
const user = await userModel.findById({_id:req.body.userId})
user.password=undefined;
if(!user){
    return res.status(200).send({
        message:'User Not Found',
        success:false
    })
}else{
    res.status(200).send({
        success:true,
        data:user
    })
}
    }catch(error){
console.log(error)
res.status(500).send({
    message:"auth error",
    success:false,
    error,
})
    }
}
// apply doctor controller 
const applyDoctorController = async (req, res) => {
  try {
    const newDoctor = await doctorModel({ ...req.body, status: "pending" });
    await newDoctor.save();
    const adminUser = await userModel.findOne({ isAdmin: true });

    // Construct the notification message with the doctor's name
    const message = `${newDoctor.firstName} ${newDoctor.lastName} Has Applied For A Doctor Account`;

    const notification = adminUser.notification || [];
    notification.push({
      type: "apply-doctor-request",
      message: message,
      data: {
        doctorId: newDoctor._id,
        name: newDoctor.firstName + " " + newDoctor.lastName,
        onClickPath: "/admin/doctors",
      },
    });

    await userModel.findByIdAndUpdate(adminUser._id, { notification });
    res.status(201).send({
      success: true,
      message: "Doctor Account Applied Successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      error,
      message: "Error While Applying For Doctor",
    });
  }
}

const getAllNotificatonController = async(req,res)=>{
try{
  const user= await userModel.findOne({_id:req.body.userId})
  const seennotification = user.seennotification
  const notification = user.notification
  seennotification.push(...notification)
  user.notification=[];
  user.seennotification=notification;
  const updatedUser = await user.save();
  res.status(200).send({
    success:true,
    message:"all notification marked as read",
    data:updatedUser
  })
}catch(error){
  console.log(error);
  res.status(500).send({
    message:'Error in Notification',
    success:false,
    error
  })
}
}
// delete all notification contoller 
const deleteAllNotificatonController =async(req,res)=>{
  try {
    const user = await userModel.findOne({ _id: req.body.userId });
    user.notification = [];
    user.seennotification = [];
    const updatedUser = await user.save();
    updatedUser.password = undefined;
    res.status(200).send({
      success: true,
      message: "Notifications Deleted successfully",
      data: updatedUser,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "unable to delete all notifications",
      error,
    });
  }
}

//get all doctro controller 
const getAllDoctorController =async(req,res)=>{
  try{
 const doctors = await doctorModel.find({status:'approved'})
 res.status(200).send({
  success:true,
  message:'Doctors list fetced successfuly',
  data:doctors
 })
  }catch(error){
    console.log(error);
    res.status(500).send({
      success:false,
      message:'Error in getitg all doctors',
      error
    })
  }
}
//book appointment controller 
const bookAppointmentController =async(req,res)=>{
  try {
    req.body.date = moment(req.body.date,'DD-MM-YYYY').toISOString()
    req.body.time = moment(req.body.time,'HH:mm').toISOString()
    req.body.status = "pending";
    const newAppointment = new appointmentModel(req.body);
    await newAppointment.save();
    const user = await userModel.findOne({ _id: req.body.doctorInfo.userId });
    user.notification.push({
      type: "New-appointment-request",
      message: `A new Appointment Request from ${req.body.userInfo.name}`,
      onCLickPath: "/user/appointments",
    });
    await user.save();
    res.status(200).send({
      success: true,
      message: "Appointment Booked  succesfully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      error,
      message: "Error While Booking Appointment",
    });
  }
}

const bookingAvailabilityController = async(req,res)=>{
  try {
    const date = moment(req.body.date, "DD-MM-YY").toISOString();
    const fromTime = moment(req.body.time, "HH:mm")
      .subtract(1, "hours")
      .toISOString();
    const toTime = moment(req.body.time, "HH:mm").add(1, "hours").toISOString();
    const doctorId = req.body.doctorId;
    const appointments = await appointmentModel.find({
      doctorId,
      date,
      time: {
        $gte: fromTime,
        $lte: toTime,
      },
    });
    if (appointments.length > 0) {
      return res.status(200).send({
        message: "Appointment is  not Availibale at this time",
        success: true,
      });
    } else {
      return res.status(200).send({
        success: true,
        message: "Appointment is  available",
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      error,
      message: "Error In Booking Appointment",
    });
  }
}

// user appointments controller 
const userAppointmentsController =async(req,res)=>{
  try {
    const appointments = await appointmentModel.find({
      userId: req.body.userId,
    });
    res.status(200).send({
      success: true,
      message: "Users Appointments Fetch Successfully",
      data: appointments,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      error,
      message: "Error In User Appointments",
    });
  }
}
module.exports = { loginController, registerController,authController,applyDoctorController,getAllNotificatonController,deleteAllNotificatonController,getAllDoctorController,bookAppointmentController,bookingAvailabilityController,userAppointmentsController};
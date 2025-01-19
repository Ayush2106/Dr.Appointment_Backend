const express = require ("express");
const colors = require('colors')
const morgan = require('morgan')
const dotenv = require('dotenv');
const connectDB = require("./config/db");
const cors = require("cors"); // Import the cors middleware


dotenv.config();


//rest obj
const app =express();

app.use(cors());
// db
connectDB();
//middlewares
app.use(express.json())
app.use(morgan('dev'))

//routes
app.use("/api/v1/user",require('./routes/userRoute'));
app.use("/api/v1/admin",require('./routes/adminRoute'))
app.use('/api/v1/doctor',require('./routes/doctorRoute'));

//
const port  = process.env.PORT || 8080
app.listen(port,()=>{
    console.log(`Server running at ${process.env.PORT} port in ${process.env.MODE} mode `.america.bgCyan.white)
})
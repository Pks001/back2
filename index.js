import express from "express";
import cors from "cors";
import transactionsRoute from "./routes/transactionRoutes.js"
import mongoose from "mongoose";
import dotenv from 'dotenv'
import transaction from "./models/createCollection.js"

const app = express()

app.use(express.json())
app.use(cors())
dotenv.config();

const port  = 4000

const connect = async () => {
    try{
        await mongoose.connect(process.env.MONGO)
        console.log("Db connected succcessfully!")
    }
    catch(err){
        console.log(err.message)
    }
}

app.use("/", transactionsRoute)
app.listen(port, ()=>{
    connect()
    console.log(`Server runs at localhost:4000`)
})
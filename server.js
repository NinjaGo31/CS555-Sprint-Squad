import express from 'express';
import { app } from './app.js';
import dotenv from 'dotenv'
import mongoose from 'mongoose';
// config
dotenv.config({path:'./config.env'})

// DB config
const DB = process.env.DATABASE_LOCAL
mongoose.connect(DB).then((conn)=>{
    console.log("Database is successfully connected")
})

const port = 3000

app.listen(port,()=>{
    console.log(`Server started and is lietening on port ${port}`)
})



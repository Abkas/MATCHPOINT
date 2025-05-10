// require('dotenv').config({path: './.env'})

import mongoose from 'mongoose'
import {DB_NAME} from './constants.js'
import express from 'express'
import connectDB from './db/index.js'

import dotenv from 'dotenv';
dotenv.config({ path: './.env' });






connectDB()




// const app = express()
// (async () =>{
//     try{
//         await mongoose.connect(`${process.env.MONGO_URI}/${DB_NAME}`)
//         app.on('error',(error)=>{
//             console.log('app not able to connect to db')
//             throw error
//         })

//         app.listen(process.env.PORT,()=>{
//             console.log(`Server is running on port ${process.env.PORT}`)
//         })

//     }catch(error){
//         conole.error('ERROR:',error)
//         throw error
//     }
// })
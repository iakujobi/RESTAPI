// Import libraries
require('dotenv').config() // allows us to use the .env library
const express = require('express')
const app = express()
const mongoose = require('mongoose')

// Connect to database
mongoose.connect(process.env.DATABASE_URL, { useNewUrlParser: true })
const db = mongoose.connection
db.on('error', (error) => console.error(error)) // allows us to see if we have an error while connecting to the database
db.once('open', () => console.log('Connected to Database!'))

// Setup server to accept JSON
app.use(express.json())

// Setup routes
const subscribersRouter = require('./routes/subscribers')
// Tell app to use the route
app.use('/subscribers', subscribersRouter) // localhost:3000/subscribers

// Setup server listening
app.listen(3000, () => console.log('Server Started!'))
// Import libraries
const express = require('express')
const router = express.Router() // Router portion of express
const Subscriber = require('../models/subscriber') // pull the subscriber.js model created in the models folder

// Note: Async Await - makes JavaScript Promises easier to work with

// Create the different Routes
// Get all subscribers - use Async Await
router.get('/', async (req, res) => {
    // res.send('Hello World!') // For testing: sends a simple text to the server 

    try {
        // Get all the different subscribers for our model. Use await because .find() is a asynchronous method
        const subscribers = await Subscriber.find()
        // If successful:
        res.json(subscribers)
    } catch (err) {
        // Catch error and send to user as JSON because this is a JSON API
        // Also set the status [use .status()] so that user knows that it was a failure
        // Status code 500 - error on your server. Means that the actual server (in our case, our database) had some kind of error 
        res.status(500).json({ message: err.message })
    }
})

// Get one subscriber
// Add the middleware set in the route (getSubscriber)
router.get('/:id', getSubscriber, (req, res) => {
    // res.send(req.params.id) // Testing: used to get the id of the GET route
    // res.send(res.subscriber.name) // Testing: used to get the name of the subscriber and send it back. Also used to check if the middleware works

    // Get a subscriber
    // res.subscriber - send a JSON version of the subscriber
    res.json(res.subscriber) 
})

// Create one subscriber
// Also an Asynchronous function - going to try and save the model which is an asynchronous operation
router.post('/', async (req, res) => {
    // new Subscriber takes a Javascript object. This creates the new subscriber
    const subscriber = new Subscriber({
        name: req.body.name, // body is whatever the user sends to us (which is JSON). Also, get the name property of the body
        subscribedToChannel: req.body.subscribedToChannel 
    })

    // Save the new subscriber. This is where the asynchronous part comes in
    try{
        // Try to save the subscriber
        const newSubscriber = await subscriber.save() // .save() persists the new subscriber to the database and if successful, adds it to this newSubscriber variable
        // If successful, send this to our user using JSON. Also, set a status [use .status()] code of 201 
        // status code 201: successfully created an object. By default, if we don't set a status, it sends a status of 200 which means everything was successfully but 201 is a more specific way to say that you created something
        // When using a POST Route, always make sure to send 201 when you're successful instead of 200
        res.status(201).json(newSubscriber)
    } catch(err){
        // Catch the error. Send .status code of 400 - send this if the user doesn't pass in the name or a subscribe channel. If the user gives bad data, it will fail
        // Status code 400: something is wrong with the user's input and not something wrong with the server
        // Wrap the message in an object {}
        res.status(400).json({ message: err.message })
    }
})

// Update one subscriber - use patch instead of update because we want only update based on what the user passes and no other information about the subscriber
// Use PUT, it will update all the information to describe it all at once instead of just the information that gets passed
// Add the middleware set in the route (getSubscriber)
router.patch('/:id', getSubscriber, async (req, res) => {
    // Update only for things that actually are sent to us
    // If the user actually passed a name to us, ...
    if (req.body.name != null) {
        res.subscriber.name = req.body.name
    }
    // Do the exact thing for the subscribedToChannel
    if (req.body.subscribedToChannel != null) {
        res.subscriber.subscribedToChannel = req.body.subscribedToChannel
    }

    try {
        // Update our subscriber: gives us the updated version of our subscriber if they successfully saved
        const updatedSubscriber = await res.subscriber.save()
        res.json(updatedSubscriber)
    } catch (err) {
        res.status(400).json({ message: err.message })
    }
})

// Delete one subscriber
// Add the middleware set in the route (getSubscriber)
router.delete('/:id', getSubscriber, async (req, res) => {
    try {
        // Tries to remove the subscriber from the database
        await res.subscriber.remove()
        // If we successfully removed the subscriber, ...
        res.json({ message: 'Deleted Subscriber' })
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
})

// The rest of the routes take an ID (Update, Delete and Get Routes)
// They are all going to have the exact same code at the beginning in order to get the subscriber
// Instead of writing out the code in every single one of our routes, we can use a MIDDLEWARE
// Create a function which is the Middleware
// next function: if we call this, move on to the next secton of our code which is going to be the callback [ (req, res) => {} ]
// This is asynchronous because we are going ro access the database inside of the code
async function getSubscriber(req, res, next) {
    // Create subscriber and default it to undefined
    let subscriber 
    try {
        // Try and get a user based on the ID that was passed [ Subscriber.findById(req.params.id) ] inside of the URL
        subscriber = await Subscriber.findById(req.params.id)
        // Check if the subscriber exists
        // If the subscriber doesn't exist
        if (subscriber == null) {
            // 404 status code: you could not find something
            // .json(): sends a message back to the user
            // we set return because if there is no subscriber, we want to immediately leave this function and no longer go any further
            return res.status(404).json({ message: 'Cannot find subscriber' })
        }
    } catch (err) {
        return res.status(500).json({ message: err.message })
    }

    // set response.subscriber to subscriber
    // variable we are creating on the response object
    res.subscriber = subscriber // this allows us to call res.subscriber in other functions and it was set here
    // Call next() function
    next() // means we have successfully completed the getSubscriber function and next will allows us to move on to the next piece of middleware or the actual request itself
}

module.exports = router // just export the router
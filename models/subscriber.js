// Import libraries
const mongoose = require('mongoose')

// Create Schema
const subscriberSchema = new mongoose.Schema ({
    // Define different properties for the schema
    name: {
        type: String,
        required: true
    },
    subscribedToChannel: {
        type: String,
        required: true
    },
    subscribeDate: {
        type: Date,
        required: true,
        default: Date.now // if we don't pass the subscribed date, it's just going to default it to the current date
    }
})

// Export Schema
// Model function takes 2 parameters: name of the model in our database, next is the Schema that corresponds to that model
// Why we need the model function: When we export this and import it in a different file, this model allows us to interact directly with the database using the schema
module.exports = mongoose.model('Subscriber', subscriberSchema)
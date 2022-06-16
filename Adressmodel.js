const mongoose = require("mongoose");

const Adressschema = mongoose.Schema({
    city: {
        type: String,
        required: true
    },
    pickup: {
        type: String,
        required: true
    },
    destination: {
        type: String,
        required: true
    },
    phone: {
        type: Number,
        required: true
    }
})

const Address = mongoose.model("Address", Adressschema)
module.exports = Address
const mongoose = require("mongoose");

const Driverschema = mongoose.Schema({

    name: {
        type: String,
        required: true
    },

    phone: {
        type: Number,
        required: true
    },
    city: {
        type: String,
        required: true
    },
    vehicle: {
        type: String,
        required: true
    }



    // images: [{
    //     public_id: {
    //         type: String,
    //         required: true,
    //     },
    //     url: {
    //         type: String,
    //         required: true,
    //     }
    // }],
    // pancard: {
    //     public_id: {
    //         type: String,
    //         required: true,
    //     },
    //     url: {
    //         type: String,
    //         required: true,
    //     },
    // },
    // adharcard: {
    //     public_id: {
    //         type: String,
    //         required: true,
    //     },
    //     url: {
    //         type: String,
    //         required: true,
    //     }
    // },
    // rcbook: {
    //     public_id: {
    //         type: String,
    //         required: true,
    //     },
    //     url: {
    //         type: String,
    //         required: true,
    //     },


})
const Driver = mongoose.model("Driver", Driverschema)
module.exports = Driver
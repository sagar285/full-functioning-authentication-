const mongoose = require('mongoose');
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
mongoose.connect("mongodb://localhost:27017/Eazy-way").then(() => {
    console.log("connection succesfull");
}).catch((e) => {
    console.log("no connection");
});
//  this model only for signup
const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    phone: {
        type: Number,
        required: true,
        unique: true
    },

    password: {
        type: String,
        required: true
    },
    cpassword: {
        type: String,
        required: true
    },
    tokens: [{
        token: {

            type: String,
            required: true
        }
    }],

})

// hash the pashword 
userSchema.pre('save', async function(next) {
    if (this.isModified("password")) {
        this.password = await bcrypt.hash(this.password, 12);
        this.cpassword = await bcrypt.hash(this.cpassword, 12);
    }
    next();
})

//we are jenerating token or cookies 

userSchema.methods.generateAuthToken = async function() {
    try {

        let tokensagar = jwt.sign({ id: this._id }, "talaahrjilabbjhindmadhyapradeshindoresagarguptajilabhindmadyapradeshbhinfdcgddrgfdssssss");
        this.tokens = this.tokens.concat({ token: tokensagar });
        await this.save();
        return tokensagar;


    } catch (error) {
        console.log(error);

    }
}


const User = mongoose.model('USER', userSchema);

module.exports = User;
const express = require("express");
const User = require("./Usermodel");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const cloudinary = require("cloudinary");
const nodemailer = require("nodemailer");
const stripe = require('stripe')('sk_test_51KwfbeSGwXFGrDg9aumwtbi129phcXXigBtGXrF89ukqud6HqCJ2VHagZHdjginqnakfglq7QAyNLx9WYB0fgUWr000Tka6PHp');
const uuid = require("uuid");

const Driver = require("./Drivermodel");
require("./Usermodel");

const Address = require("./Adressmodel");

router.get("/", (req, res) => {
    res.send(`Hello world from the server rotuer js`);
});

router.post("/address", (req, res) => {
    console.log(req.body);
    const { city, pickup, destination, phone } = req.body;
    if (!city || !pickup || !destination || !phone) {
        return res.status(422).json({ error: "plz filled all field" });
    }
    const address = new Address({ city, pickup, destination, phone });
    console.log(address);
    address
        .save()
        .then(() => {
            res.status(201).json({ message: "driver detail reached succesfully" });
        })
        .catch((err) => {
            res.status(500).json({ error: "failed to register" });
            console.log(err);
        });
});

router.post("/driver", (req, res) => {
    console.log(req.body);

    const { name, phone, city, vehicle } = req.body;
    if (!name || !phone || !city || !vehicle) {
        return res.status(422).json({ error: "plz filled all field " });
    }
    const driver = new Driver({ name, phone, city, vehicle });
    console.log(driver);
    driver
        .save()
        .then(() => {
            res.status(201).json({ message: "driver detail reached succesfully" });
        })
        .catch((err) => {
            res.status(500).json({ error: "failed to register" });
            console.log(err);
        });
});

router.post("/api/upload", async(req, res) => {
    try {
        cloudinary.config({
            cloud_name: "sharmaji123",
            api_key: "914965563966755",
            api_secret: "JR-0ptI-ET1nzhntrejHtZBtrfw",
        });

        const myCloud = await cloudinary.v2.uploader.upload(req.body.data, {
            folder: "dev_setups",
            width: 150,
        });

        console.log(myCloud);
        res.json({ msg: "yaya" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ err: "Something went wrong" });
    }
});

router.post("/payment", (req, res) => {
        const { product, token } = req.body;
        console.log("product", product);
        console.log("price", product.price);
        const idomponetncyKey = uuid();
        return stripe.customers.create({
            email: token.email,
            source: token.id,
        }).then(customer => {
            stripe.charges.create({
                amount: product.price * 100,
                currency: "usd",
                customer: customer.id,
                receipt_email: token.email,
                description: product.name,
                shipping: {
                    name: token.card.name,
                    address: {
                        country: token.card.address_country,
                    }
                }

            }, { idomponetncyKey });
        }).then(result => res.status(200).json(result)).catch(err => console.log(err));
    })
    // Get All Product
    //   exports.getAllProducts = catchAsyncErrors(async (req, res, next) => {
    //     const resultPerPage = 8;
    //     const productsCount = await Product.countDocuments();

//     const apiFeature = new ApiFeatures(Product.find(), req.query)
//       .search()
//       .filter();

//     let products = await apiFeature.query;

//     let filteredProductsCount = products.length;

//     apiFeature.pagination(resultPerPage);

//     products = await apiFeature.query;

//     res.status(200).json({
//       success: true,
//       products,
//       productsCount,
//       resultPerPage,
//       filteredProductsCount,
//     });
//   });

// Get All Product (Admin)
//   exports.getAdminProducts = catchAsyncErrors(async (req, res, next) => {
//     const products = await Product.find();

//     res.status(200).json({
//       success: true,
//       products,

// })
router.post("/register", (req, res) => {
    console.log("register request");
    console.log(req.body);
    const { name, email, phone, password, cpassword } = req.body;

    var transport = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 587,
        secure: false,
        auth: {
            user: "wayseasy291@gmail.com",
            pass: "wayseasy3411",
        },
    });

    // let mailoptions = {
    //     from: ,
    //     to: "anandguptasir@gmail.com",
    //     pass: "sharmaGUPTA@541",
    // }

    transport.sendMail({
        from: "wayseasy291@gmail.com",
        to: email,
        subject: "testemail",
        text: "you register  in easyways  get most amazing deals here ",

    }, (err) => {
        if (err) throw err;
        res.send("mail has been sent");
    });
    if (!name || !email || !phone || !password || !cpassword) {
        return res.status(422).json({ error: "plz filled the field properly" });
    }
    const Password = req.body.password;
    const Cpassword = req.body.cpassword;
    if (Password !== Cpassword) {
        return res
            .status(404)
            .json({ message: "password and confirm password must be same" });
    }
    User.findOne({ email: email })
        .then((userExist) => {
            if (userExist) {
                return res.status(422).json({ error: "This email already registered" });
            }
            const user = new User({ name, email, phone, password, cpassword });
            user
                .save()
                .then(() => {
                    res.status(201).json({ message: "user registered succesfully " });
                })
                .catch((err) => {
                    res.status(500).json({ error: "failed to register" });
                });
        })
        .catch((err) => {
            console.log(err);
        });

    // console.log(req.body);
    // res.json({ message: req.body });
    // // res.send("mera register page");
});
router.post("/login", async(req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ error: "plz filled all your field" });
        }
        const userlogin = await User.findOne({ email: email });
        console.log(userlogin);

        const ismatch = await bcrypt.compare(password, userlogin.password);
        console.log(ismatch);

        const token = await userlogin.generateAuthToken();
        console.log(token);
        res.cookie("jwtoken", token, {
            expires: new Date(Date.now() + 25 * 60 * 60 * 24),
            httpOnly: true,
        });

        if (!ismatch) {
            res.status(400).json({ error: "user error" });
        } else {
            res.json({ message: "user login succesfully" });
        }
    } catch (error) {
        console.log(error);
    }
});

module.exports = router;
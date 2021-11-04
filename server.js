////////////////////////////////
// DEPENDENCIES
////////////////////////////////
// get .env variables
require("dotenv").config();

// pull PORT from .env, give default value of 3000
const { PORT = 3000, MONGODB_URL } = process.env;

// import express
const express = require("express");

// create application object
const app = express();

// import mongoost
const mongoose = require("mongoose");

// import middleware
const cors = require("cors") // cors headers
const morgan = require("morgan") // logging

////////////////////////////////
// Database Connection
////////////////////////////////
// Establish Connection
mongoose.connect(MONGODB_URL, {
    useUnifiedTopology: true,
    useNewUrlParser: true,
});

// Connection Events
mongoose.connection
.on("open", () => console.log("Connected to Mongo"))
.on("close", () => console.log("Disonnected to Mongo"))
.on("error", (error) => console.log(error))

////////////////////////////////
// Models
////////////////////////////////
const CheeseScheme = new mongoose.Schema({
    name: String,
    countryOfOrigin: String,
    image: String
})

const Cheese = mongoose.model("Cheese", CheeseScheme)

////////////////////////////////
// Middleware
////////////////////////////////
app.use(cors()); // prevent cors errors
app.use(morgan("dev")); // logging
app.use(express.json()); // parse json bodies

////////////////////////////////
// Routes and Routers
////////////////////////////////
// test route
app.get("/", (req, res) => {
    res.send("hello world")
})

// Index Route - get request to /cheese
// Get us all the cheese
app.get("/cheese", async(req, res) => {
    try {
        // send all the cheese
        res.json(await Cheese.find({}))
    } catch (error) {
        // send error
        res.status(400).json({error})
    }
})

// Create Route - post request to /cheese
// create a cheese from JSON body
app.post("/cheese", async(req, res) => {
    try {
        // create a new cheese
        res.json(await Cheese.create(req.body))
    } catch (error) {
        // send error
        res.status(400).json({error})
    }
})

// Update Route - put request to /cheese/:id
// update a cheese
app.put("/cheese/:id", async(req, res) => {
    try {
        res.json(
            await Cheese.findByIdAndUpdate(req.params.id, req.body, {new: true})
        )
    } catch (error) {
        res.status(400).json({error})
    }
})

// Destory Route - delete request to /cheese/:id
// destory or remove a cheese
app.delete("/cheese/:id", async(req, res) => {
    try {
        res.json(await Cheese.findByIdAndRemove(req.params.id))
    } catch (error) {
        res.status(400).json({error})
    }
})

////////////////////////////////
// LISTENER
////////////////////////////////
app.listen(PORT, () => console.log(`listening on PORT ${PORT}`));
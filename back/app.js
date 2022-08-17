require('dotenv').config()
const { application } = require("express");
const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
// const stuffRoutes = require("./routes/stuff");
const userRoutes = require("./routes/user");
const app = express();

const { DB_USER, DB_NAME, DB_SERVER, DB_PASSWORD } = process.env

mongoose
    .connect(
        `mongodb+srv://${DB_USER}:${DB_PASSWORD}@${DB_SERVER}/?${DB_NAME}=true&w=majority`,
        {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        }
    )
    .then(() => console.log("Connexion à MongoDB Atlas réussie !"))
    .catch(() => console.log("Connexion à MongoDB échouée !"));

app.use(express.json());

app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader(
        "Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Content, Accept, Content-Type, Authorization"
    );
    res.setHeader(
        "Access-Control-Allow-Methods",
        "GET, POST, PUT, DELETE, PATCH, OPTIONS"
    );
    next();
});

app.use("/images", express.static(path.join(__dirname, "images")));

// app.use("/api/stuff", stuffRoutes);

app.use("/api/auth", userRoutes);

module.exports = app;
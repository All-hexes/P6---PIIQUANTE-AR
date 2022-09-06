const express = require('express');
const mongoose = require('mongoose');
const userRoutes = require('./routes/user');
const sauceRoutes = require('./routes/sauce');
const path = require('path');
const cors = require('cors');
const helmet = require('helmet');
require('dotenv').config({ path: '.env' });
const { DB_USER, DB_NAME, DB_SERVER, DB_PASSWORD } = process.env;

const app = express();

app.use(helmet({
  crossOriginResourcePolicy: { policy: "same-site" }
}));

app.use(express.json());

mongoose
  .connect(
    `mongodb+srv://${DB_USER}:${DB_PASSWORD}@${DB_SERVER}/?retryWrites=true&w=majority`,
    //`mongodb+srv://newuser:3dzaxzFTjdKJ5vg@cluster0.fijosz2.mongodb.net/?retryWrites=true&w=majority`,
    {
      useNewUrlParser: true,
      useUnifiedTopology: true
    }
  )
  .then(() => console.log("MongoDB connecté !"))
  .catch(() => console.log(("Connexion à MongoDB échouée. ")));

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

app.use(cors());

app.use('/api/auth', userRoutes);

app.use('/api/sauces', sauceRoutes);

app.use('/images', express.static(path.join(__dirname, 'images')));

app.get("*", (req, res) => {
  res.status(404).send({ message: "Not found !" })
});

module.exports = app;
const Sauce = require("../models/sauce");

const { json } = require("express");
const fs = require("fs-extra");

exports.createSauce = (req, res, next) => {
    const sauceObject = JSON.parse(req.body.sauce);
    delete sauceObject._id;
    delete sauceObject._userId;

    const sauce = new Sauce({
        ...sauceObject,
        userId: req.auth.userId,
        imageUrl: `${req.protocol}://${req.get("host")}/images/${req.file.filename
            }`,
    });

    sauce
        .save()
        .then(() => {
            res.status(201).json({ message: "Sauce enregistré !" });
        })
        .catch((error) => res.status(400).json({ error }));
};

exports.modifySauce = (req, res, next) => {
    const thingObject = req.file
        ? {
            ...JSON.parse(req.body.thing),
            imageUrl: `${req.protocol}://${req.get("host")}/images/${req.file.filename
                }`,
        }
        : { ...req.body };

    delete sauceObject._userId;

    Thing.findOne({ _id: req.params.id })
        .then((thing) => {
            if (thing.userId != req.auth.userId) {
                res.status(401).json({ message: "Non-autorisé" });
            } else {
                Thing.updateOne(
                    { _id: req.params.id },
                    { ...thingObject, _id: req.params.id }
                )
                    .then(() => res.status(200).json({ message: "Sauce modifié !" }))
                    .catch((error) => res.status(401).json({ error }));
            }
        })
        .catch((error) => res.status(400).json({ error }));
};

exports.deleteSauce = (req, res, next) => {
    Thing.findOne({ _id: req.params.id })
        .then((thing) => {
            if (thing.userId != req.auth.userId) {
                res.status(401).json({ message: "Not authorized" });
            } else {
                const filename = thing.imageUrl.split("/images/")[1];
                fs.unlink(`images/${filename}`, () => {
                    Thing.deleteOne({ _id: req.params.id })
                        .then(() => {
                            res.status(200).json({ message: "Sauce supprimé !" });
                        })
                        .catch((error) => res.status(401).json({ error }));
                });
            }
        })
        .catch((error) => {
            res.status(500).json({ error });
        });
};

exports.getOneSauce = (req, res, next) => {
    Thing.findOne({ _id: req.params.id })
        .then((thing) => res.status(200).json(thing))
        .catch((error) => res.status(401).json({ error }));
};

exports.getAllSauces = (req, res, next) => {
    Thing.find()
        .then((things) => res.status(200).json(things))
        .catch((error) => res.status(400).json({ error }));
};

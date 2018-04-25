const bcrypt = require('bcrypt');
const _ = require('lodash');                                                            //for picking the required data only from object
const { User, validate } = require('../models/user')
const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();

router.post('/', async (req, res) => {
    const { error } = validate(req.body);                                               //validating the body
    if (error) return res.status(400).send(error.details[0].message);

    let user = await User.findOne({ email: req.body.email });
    if (user) return res.status(400).send(' User already registered');

    user = new User(_.pick(req.body, ['name', 'email', 'password']))                     //picking the needed property from the req.body object

    const salt = await bcrypt.genSalt(10);                                                       // generating salt for encryption of password
    user.password = await bcrypt.hash(user.password, salt);                                       //hasing password with bcrypt

    await user.save();

    res.send(_.pick(user, ['_id', 'name', 'email']));                                             //picking the needed property from the user object
})

module.exports = router;
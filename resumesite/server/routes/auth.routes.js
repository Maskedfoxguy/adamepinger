const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require('jsonwebtoken'); 
const Admin = require('../models/Admin.model');

const isAuthenticated = require('../middleware/jwt.middleware');

const router = express.Router(); 
const saltRounds = 10; 

//POST --> auth/login 

router.post('/login' , (req, res, next) => {
    const { email, password } = req.body; 

    if (email === '' || password === '') {
        res.status(400).json({ message: 'Provide email and password.'});
        return;
    }

    Admin.findOne({email})
    .then((foundAdmin) => {

        if (!foundAdmin) {
            res.status(401).json({ message: 'Admin not found.'})
            return;
        }
    })
})
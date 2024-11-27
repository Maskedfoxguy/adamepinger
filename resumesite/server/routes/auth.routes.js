const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require('jsonwebtoken'); 
const Admin = require('../models/Admin.model');

const { isAuthenticated } = require('../middleware/jwt.middleware');

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
            res.status(401).json({ message: 'Admin not found.'});
            return;
        }

        const passwordCorrect = bcrypt.compareSync(password, foundAdmin.password);

        if (passwordCorrect) {

            const { _id, email, firstName, lastName, role } = foundAdmin;
            const payload = { _id, email, firstName, lastName, role };
            req.admin = payload;

            const authToken = jwt.sign(
                payload,
                process.env.TOKEN_SECRET,
                { algorithm: 'HS256', expiresIn: "6h" }  
            );

            res.status(200).json({ authToken: authToken});
        }
        else { 
            res.status(401).json({ message: 'Unable to authenticate the user'});
        }

    })
    .catch((err) => next(err));
});


router.get("/verify", isAuthenticated, (req,res, next) => {
    console.log(`req.payload`, req.payload);
  
    res.status(200).json(req.payload);
});



module.exports = router;
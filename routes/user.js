const express = require('express');
const router = express.Router();
const dbmodule = require('../db')
const models = dbmodule.models
const bcryptjs = require('bcryptjs');
const auth = require('basic-auth');
const { Courses, Users } = models



//User authentication middleware
const authenticateUser = async (req, res, next) => {
    let message;
    // Parse the user's credentials from the Authorization header.
    const credentials = auth(req);
    if (credentials) {
        //Find user with matching email address
        const user = await Users.findOne({
            raw: true,
            where: {
                emailAddress: credentials.name,
            },
        });
        //If user matches email
        if (user) {
            // Use the bcryptjs npm package to compare the user's password
            // (from the Authorization header) to the user's password
            // that was retrieved from the data store.
            const authenticated = bcryptjs.compareSync(credentials.pass, user.password);
            //If password matches
            if (authenticated) {
                console.log(`Authentication successful for user: ${user.firstName} ${user.lastName}`);
                if (req.originalUrl.includes('courses')) {
                    //If route has a courses endpoint, set request userId to matched user id
                    req.body.userId = user.id;
                } else if (req.originalUrl.includes('users')) {
                    //If route has a users endpoint, set request id to matched user id
                    req.body.id = user.id;
                }
            } else {
                //Otherwise the Authentication failed
                message = `Authentication failed for user: ${user.firstName} ${user.lastName}`;
            }
        } else {
            // No email matching the Authorization header
            message = `User not found for email address: ${credentials.name}`;
        }
    } else {
        //No user credentials/authorization header available
        message = 'Authorization header not found';
    }
    // Deny Access if there is anything stored in message
    if (message) {
        console.warn(message);
        const err = new Error('Access Denied');
        err.status = 401;
        next(err);
    } else {
        //User authenticated
        next();
    }
};

// router.post('/', (req, res) => {
//     //If there is a password
//     if (req.body.password) {
//         //Hash the password and then attempt to create a new user
//         req.body.password = bcryptjs.hashSync(req.body.password);
//         //Model validations for User Model
//         User.create(req.body);
//         res.location('/');
//         res.status(201).end();
//     } else {
//         //Respond with status 401
//         res.status(401).end();
//     }
// })

router.get('/users', authenticateUser, async (req, res) => {
    try {
         const user = await Users.findByPk(req.body.id, {
            attributes: {
                exclude: ['password', 'createAt', 'updateAt'],
            }
        })
        //await is not to move or do nothing until it gets the Users.findbyPK
        res.json(user).status(200).end();
    }catch (err) {
        return next(err)
    }
})

router.post('/users', async (req, res, next) => {
    try {
        const user = req.body;
        if (user.password && user.firstName && user.lastName && user.emailAddress) {
            user.password = bcryptjs.hashSync(user.password);
            await User.create(user);
            res.location('/');
            res.status(201).end();
            
        } else {
            res.status(400).end;
        }

    } catch (err) {
        if (err.name === "sequelizeValidationError") {
            console.log('Validation error')
            res.status(400).end();
        } else {
            console.log('Error 500')
            next(err);
        }
    }
});

module.exports = router;
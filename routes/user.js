const express = require('express');
const router = express.Router();
const dbmodule = require('../db')
const models = dbmodule.models
const bcryptjs = require('bcryptjs');
const auth = require('basic-auth');
const {
    Courses,
    Users
} = models
const bodyParser = require('body-parser');
router.use(bodyParser.json());
router.use(bodyParser.urlencoded({
    extended: false
}));



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

//GET/api/users 200
//Returns the currently authenticated user
router.get('/users', authenticateUser, async (req, res) => {
    try {
        const user = await Users.findByPk(req.body.id, {
            attributes: {
                exclude: ['password', 'createAt', 'updateAt'],
            }
        })
        res.json(user).status(200).end();
    } catch (err) {
        return next(err)
    }
})

//POST/api/users 201
//Creates a user, sets the Location header to "/", and returns no content
router.post('/users', async (req, res) => {
    try {
        //get the user from the request body
        const user = req.body;
        if (user.password && user.firstName && user.lastName && user.emailAddress) {
            req.body.password = bcryptjs.hashSync(req.body.password);
            //validation creating new user
            await Users.create(user);
            //sets location header to "/"
            res.location('/');
            //if sucessful return a 201 status
            res.status(201).end();

        } else {
            //if not successful return a 400 error
            res.status(400).json({
                message: 'information missing'
            }).end();
        }
    } catch (err) {
        if (err.name === 'SequelizeValidationError') {
            console.log('Validation error')

        } else {
            console.log('Error 500')

        }
    }
});

module.exports = router;
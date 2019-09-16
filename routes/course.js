const express = require('express');
const router = express.Router();
const dbmodule = require('../db')
const models = dbmodule.models
const bcryptjs = require('bcryptjs');
const auth = require('basic-auth');
const { Courses, Users } = models

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

//GET/api/courses200
 router.get('/', async(req, res) => {
     const courses = await Course.findAll{(
             attributes: {
                 exclude: ['createAt', 'updateAt'],
             },
                include: [{
                    model: User,
                    as: 'user',
                    attributes: ['id', 'firstName', 'lastName', 'emailAddress'],
         }]
        })
         res.json(courses)
       })
       
router.get('/:id', async(req,res, next) => {
    const course = await Course.findOne({
        where: {
            id: req.params.id
        },
        attributes: ['id', 'title', 'description', 'estimatedTime', 'materialsNeeded', 'userId'],
        include: [{
            model: User,
            as: 'user',
            attributes: ['id', 'firstName', 'lastName', 'emailAddress']
        }]
    })
    res.json(course);
})
     
router.post('/', async (req, res, next) => {
    try{
        if(req.body.title && req.body.description) {
        const createCourse = await Course.create(req.body);
        res.location(`api/courses/${createCourse.id}`);
        res.status(201).end();
        }else{
            res.status(400).json({
                message: 'Error 400 - Bad request - Missing information.',
            });
        }
    }catch (err) {
        console.log("Error 401 - Unauthorized Request");
        next(err);
    }
})
     
router.put('/course/:id', async (req, res) => {
    const course = await Course.findbyPK(req.params.id)
    if(course.id === req.body.id) {
        await course.update(req.body);
        res.status(204).end();
    } else {
        res.status(401).json({message: "You are not authorized to make changes."});
    }
})
     
router.delete('/courses/:id', authenticatedUser, async (req, res, next) => {
    const course = await Course.findbyPK (req.params.id)
    if(course) {
        await course.destroy();
        res.status(204).end();
    } else {
        res.status(401).json({message: "You are not authorized to delete this course."});
    }
})
        

module.exports = router;

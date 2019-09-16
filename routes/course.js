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
//Returns a list of courses (including the user that owns each course)
 router.get('/courses', async(req, res) => {
     const courses = await Courses.findAll({
        attributes: {
            exclude: ['createAt', 'updateAt'],
        },
        include: [{
        model: Users,
        as: 'user',
        attributes: ['id', 'firstName', 'lastName', 'emailAddress'],
         }]
        })
         res.json(courses)
       })

//GET/api/courses/:id 200
//Returns a course (including the user that owns the course) for the provided course ID      
router.get('/courses/:id', async(req,res, next) => {
    const course = await Courses.findOne({
        where: {
            id: req.params.id
        },
        attributes: ['id', 'title', 'description', 'estimatedTime', 'materialsNeeded', 'userId'],
        include: [{
            model: Users,
            as: 'user',
            attributes: ['id', 'firstName', 'lastName', 'emailAddress']
        }]
    })
    res.json(course);
})

//POST/api/courses 201
//Creates a course, sets the Location header to the URI for the course, and returns no content
router.post('/courses', authenticateUser, async (req, res, next) => {
    try{
        if(req.body.title && req.body.description) {
        const createCourse = await Courses.create(req.body);
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

//PUT/api/courses/:id 204
//Updates a course and returns no content
router.put('/courses/:id', authenticateUser, async (req, res) => {
    try {
        const course = await Courses.findByPk(req.params.id)
        if (course.id === req.body.id) {
            if (req.body.title && req.body.description) {
                req.body.estimatedTime === req.body.estimatedTime &&
                    req.body.materialsNeeded === req.body.materialsNeeded
                await course.update(req.body);
                res.status(204).end();
        } else {
                res.status(400).json({ message: 'Missing Information' });
        }
    } else {
        res.status(403).json({ message: "You are not authorized to make changes." });
    }
} catch (error) {
    if (error.name === 'SequelizeValidationError') {
        res.status(404).json({ error: error.message })
        
    } else {
        return next(error)
        
    }
    }
});

//DELETE/api/courses/:id 204
//Deletes a course and returns no content     
router.delete('/courses/:id', authenticateUser, async (req, res, next) => {
    try {
        const course = await Courses.findByPk(req.params.id)
        if (course) {
            await course.destroy();
            
        } else {
            res.status(404).end();
        }
        res.status(204).end();
    } catch (error) {
        return next(error)
    }
})
        

module.exports = router;

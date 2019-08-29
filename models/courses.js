'use strict'
const Sequelize = require('sequelize');
const db = require('../config/database');

const Courses = db.define('courses', {
    id: {
        type: Sequelize.INTEGER,
        validate: {
            notEmpty: {
                msg: "Title is required"
            }
        }
    },
    userId: {
        type: Sequelize.STRING,
        validate: {
            notEmpty: {
                msg: "Author is required"
            }
        }
    },
    title: {
        type: Sequelize.STRING
    },
    description: {
        type: Sequelize.TEXT
    },
    estimatedTime: {
        type: Sequelize.STRING
    },
    materialsNeeded: {
        type: Sequelize.STRING
    }
})

module.exports = Courses;
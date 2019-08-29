'use strict'
const Sequelize = require('sequelize');
const db = require('../config/database');

const Users = db.define('users', {
    id: {
        type: Sequelize.INTEGER,
        validate: {
            notEmpty: {
                msg: "Title is required"
            }
        }
    },
    firstName: {
        type: Sequelize.STRING,
        validate: {
            notEmpty: {
                msg: "Name is required"
            }
        }
    },
    lastName: {
        type: Sequelize.STRING
    },
    emailAddress: {
        type: Sequelize.INTEGER,
        validate: {
            isEmail: {
                msg: "Please enter email"
            }
        }
    },
    password: {
        type: Sequelize.STRING
    }
})

module.exports = Users;
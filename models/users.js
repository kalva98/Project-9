'use strict'
const Sequelize = require('sequelize');

module.exports = (sequelize) => {
    const Users = sequelize.define('Users', {
        id: {
            type: Sequelize.INTEGER,
            validate: {
                notEmpty: {
                    msg: "Title is required",
                },
                primaryKey: true,
                autoIncrement: true,
            },
        },
        firstName: {
            type: Sequelize.STRING,
            validate: {
                notEmpty: {
                    msg: "Name is required",
                },
            },
        },
        lastName: {
            type: Sequelize.STRING,
            validate: {
                notEmpty: {
                    msg: "Name is required",
                },
            },
        },
        emailAddress: {
            type: Sequelize.STRING,
            validate: {
                isEmail: {
                    msg: "Please enter a vaid email",
                },
            },
        },
        password: {
            type: Sequelize.STRING,
        },
    }, { sequelize });

    Users.associate = (models) => {
        //creating a one to many relationship
        Users.hasMany(models.Courses, {
            as: 'user',
            foreignKey: {
                fieldName: 'userId',
                allowNull: false,
            },
        });
    };

    return Users;
};
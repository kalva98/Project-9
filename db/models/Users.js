'use strict'
const Sequelize = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    const Users = sequelize.define('Users', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        
        },
        firstName: {
            type: DataTypes.STRING,
            validate: {
                notEmpty: {
                    msg: "Name is required",
                },
            },
        },
        lastName: {
            type: DataTypes.STRING,
            validate: {
                notEmpty: {
                    msg: "Name is required",
                },
            },
        },
        emailAddress: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                isEmail: {
                    msg: "Please enter a vaid email",
                },
                notNull: {
                    msg: 'Email address is required'
                }
            },
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                notNull: {
                    msg: 'Password is required'
                }
            }
        },
    }, {});

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
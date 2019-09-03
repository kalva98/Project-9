'use strict'
const Sequelize = require('sequelize');

module.exports = (sequelize) => {
    const Courses = sequelize.define('Courses', {
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
        userId: {
            type: Sequelize.INTEGER,
            validate: {
                notEmpty: {
                    msg: "Author is required",
                },
            },
        },
        title: {
            type: Sequelize.STRING,
        },
        description: {
            type: Sequelize.TEXT,
        },
        estimatedTime: {
            type: Sequelize.STRING,
            allowNull: true,
        },
        materialsNeeded: {
            type: Sequelize.STRING,
            allowNull: true,
        },
    }, { sequelize });

    Course.associate = (models) => {
        Course.belongsTo(models.User, {
            as: 'user',
            foreignKey: {
                fieldName: 'userId',
                allowNull: false,
            },
        });
    };

    return Courses;
};
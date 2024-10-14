// models/materia.js
const { DataTypes } = require('sequelize');

const sequelize = require('../db'); 

const Materia = sequelize.define('Materia', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    nombre: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    cantidadAlumnos: {
        type: DataTypes.INTEGER,
        allowNull: false,
    }
}, {
    tableName: 'materias', 
    timestamps: false,
});

module.exports = Materia;

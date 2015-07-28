/**
 * Created by Manolo on 23/07/2015.
 */

// Definición del modelo de Quiz

module.exports = function (sequelize, DataTypes){
    return sequelize.define("Quiz",{pregunta: DataTypes.STRING, respuesta: DataTypes.STRING});
}
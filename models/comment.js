/**
 * Created by Manolo on 23/07/2015.
 */

// Definición del modelo de Comment

module.exports = function (sequelize, DataTypes){
    return sequelize.define(
        "Comment",
        {texto: {type: DataTypes.STRING,
                 validate: {notEmpty : {msg: '--> Falta Comentario'}}
        }
        }
    );
};
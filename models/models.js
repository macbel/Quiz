/**
 * Created by Manolo on 23/07/2015.
 */

var path = require('path');
//Cargar modelo ORM
var Sequelize = require ('sequelize');
//Usar BBDD SQLite
var sequelize = new Sequelize(null, null, null, {dialect: "sqlite", storage: "quiz.sqlite"});
//Importar la definición de la tabla Quiz de quiz.js
var Quiz = sequelize.import(path.join(__dirname,'quiz'));
exports.Quiz = Quiz; //Exportar la definición de la tabla Quiz para ser usada en otros puntos de la aplicación

//inicializar la BD
sequelize.sync().then(function(){
    Quiz.count().then(function(count){
        if (count === 0){
            Quiz.create({pregunta: 'Capital de Italia',
                         respuesta: 'Roma'
            }).then(function(){console.log('Base de datos inicializada con éxito')});
        }
    });
});

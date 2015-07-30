/**
 * Created by Manolo on 23/07/2015.
 */

var path = require('path');
//POSTGRES DATABASE_URL= postgres://user:passwd@host:port/database
//SQLITE DATABASE_URL= sqlite://:@:/
var url = process.env.DATABASE_URL.match(/(.*)\:\/\/(.*?)\:(.*)@(.*)\:(.*)\/(.*)/);
var DB_name = (url[6]||null);
var user = (url[2]||null);
var pwd = (url[3]||null);
var protocol = (url[1]||null);
var dialect = (url[1]||null);
var port = (url[5]||null);
var host = (url[4]||null);
var storage = process.env.DATABASE_STORAGE;


//Cargar modelo ORM
var Sequelize = require ('sequelize');
//Usar BBDD SQLite o Postgres
var sequelize = new Sequelize(DB_name, user, pwd,
    {dialect: protocol,
        protocol: protocol,
        port: port,
        host: host,
        storage: storage, //solo SQLite (.env)
        omitNull: true    //solo Postgres
    }
);


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

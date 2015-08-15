/**
 * Created by Manolo on 17/07/2015.
 */
var models = require('../models/models.js');


exports.show = function (req,res){
    var numQuizes;
    var numComments;
    var quizesConComments;

    //Número de preguntas totales
    models.Quiz.findAll().then(function (quizes) {
            if (quizes)
                numQuizes = quizes.length;
            else
                numQuizes = 0;

        //Número de comentarios totales
        models.Comment.findAll().then(function (comments) {
                if (comments)
                    numComments = comments.length;
                else
                    numComments = 0;

                //Media de comentarios por pregunta
                var mediaComments = (numComments / numQuizes).toFixed(2);

                //preguntas con comentarios
                models.Comment.findAll({where: ["QuizId is not null"]}).then(function (comments) {
                        if (comments) {
                            var idQuiz = 0;
                            var contador = 0;
                            for (index in comments) {
                                if (idQuiz != comments[index].QuizId){
                                    contador = contador + 1;
                                    idQuiz = comments[index].QuizId;
                                }
                            }
                            quizesConComments = contador;
                        }else{
                            quizesConComments = 0;
                        }

                        //preguntas sin comentarios
                        var quizesSinComments = numQuizes - quizesConComments;

                        res.render('quizes/stats',{stats: {numPreguntas : numQuizes,
                            numComentarios: numComments,
                            mediaComentarios: mediaComments,
                            preguntasSin: quizesSinComments,
                            preguntasCon: quizesConComments
                        }, errors: []});

                    }
                ).catch(function (error) {
                        next(error);
                    });
            }
        ).catch(function (error) {
                next(error);
            });
        }
    ).catch(function (error) {
            next(error);
        });



};


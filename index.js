// permet d'accéder aux variables d'environnement du .env dans notre application
require('dotenv').config();

const express = require('express');
const app = express();

/* ancienne façon de lever la sÉcuritÉ CORS
app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    next();
});*/

// on importe le module cors
const cors = require('cors');
// et on l'applique dans un middleware pour autoriser tous les domaines à se connecter à notre API
app.use(cors('*'));

// on importe multer pour rendre le format multipart/form-data actif dans notre application
const multer = require('multer');
const bodyParser = multer();
app.use(bodyParser.none());

// on importe sanitizer pour pouvoir échapper le code html de l'utilisateur en cas de requetes POST et PATCH
const sanitizer = require('sanitizer');
app.use((req, res, next) => {
    // on peut changer les valeurs des proprietes de req.body seulement si req.body existe...
    if(req.body) {
       // on parcours l'objet req.body (entrées utilisateur)
        for(const prop in req.body) {
            // on réaffecte à chaque propriété de req.body une valeur safe (convertit avec sanitizer). Le code HTML deviendra du texte sans danger.
            req.body[prop] = sanitizer.escape(req.body[prop]);
        }
    }
    next();
})

// on importe le body-parser pour pouvoir accéder correctement au req.body lors des routes POST
app.use(express.urlencoded({extended:true}));

// PAS DE app.set('view engine', 'ejs'); CAR UNE API NE RETOURNE PAS DE VUE ! ELLE RETOURNE DE LA DATA ! ON VA UTILISER RES.JSON ET NON RES.RENDER !

app.use(express.static('./public'));
const router = require('./app/router');
app.use(router);

app.listen(process.env.PORT || 3000, () => {
    console.log("L'api écoute...");
});
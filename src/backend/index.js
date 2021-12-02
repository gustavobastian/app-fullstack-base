//=======[ Settings, Imports & Data ]==========================================

var PORT    = 3000;

var express = require('express');
var app     = express();
var utils   = require('./mysql-connector');

// to parse application/json
app.use(express.json()); 
// to serve static files
app.use(express.static('/home/node/app/static/'));

//=======[ Main module code ]==================================================

app.get('/devices/', function(req, res, next) {
   /* devices = [
        { 
            'id': 1, 
            'name': 'Lampara 1', 
            'description': 'Luz living', 
            'state': 0, 
            'type': 1, 
        },
        { 
            'id': 2, 
            'name': 'Ventilador 1', 
            'description': 'Ventilador Habitacion', 
            'state': 1, 
            'type': 2, 
        },
    ]
    res.send(JSON.stringify(devices)).status(200);*/
    let devices=require('./datos.json');
    res.send(devices).status(200);
});

//
//
app.get('/devices/:id', function(req, res) {
    idAb=req.params.id;    
    let datos=require('./datos.json');
    let datosfiltrados=datos.filter(item => item.id==req.params.id);
    res.send(datosfiltrados).status(200);
});

//Post method for erasing devices 

app.post('/devices/:id', function(req, res, next) {
    console.log("estoy aqui");
    console.log(req.params.id);
    res.send("Item deleted").status(200);
});

//
app.listen(PORT, function(req, res) {
    
    console.log("NodeJS API running correctly");
});

//=======[ End of file ]=======================================================

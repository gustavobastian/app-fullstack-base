//=======[ Settings, Imports & Data ]==========================================

var PORT    = 3000;

var express = require('express');
const connection = require('./mysql-connector');
var app     = express();
var utils   = require('./mysql-connector');

// to parse application/json
app.use(express.json()); 
// to serve static files
app.use(express.static('/home/node/app/static/'));

//=======[ Main module code ]==================================================

app.get('/devices/', function(req, res, next) {
   //response with Device hardcode here
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

    //response with Devices from a device file
    /*let devices=require('./datos.json');
    res.send(devices).status(200);*/

    //response with Devices from the database
    connection.query('SELECT *  FROM Devices ', function(error,result, fields){
        console.log(result);    
        res.send(result).status(200);
        return;    
    })

});

//
//
app.get('/devices/:id', function(req, res) {
    idAb=req.params.id;    
    //uncomment next tree lines if you want to use the file storage
    /*
    let datos=require('./datos.json');
    let datosfiltrados=datos.filter(item => item.id==req.params.id);
    res.send(datosfiltrados).status(200);*/

    //uncomment next query if you want to use the database
    connection.query('SELECT *  FROM Devices WHERE id ='+idAb, function(error,result, fields){
        //console.log(result);    
        res.send(result).status(200);
        return;    
    })
    
    
});

//Post method for deleting devices 

app.post('/devices/:id', function(req, res, next) {
    console.log("estoy aqui");
    console.log(req.params.id);
    res.send("Item deleted").status(200);

    //check database
    connection.query('SELECT *  FROM Devices WHERE id ='+req.params.id, function(error,result, fields){
        console.log(result);        
    })

});

//
app.listen(PORT, function(req, res) {
    
    console.log("NodeJS API running correctly");
});

//=======[ End of file ]=======================================================

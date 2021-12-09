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
// to parse received data
var bodyParser = require('body-parser');
const { request } = require('express');


//=======[ Main module code ]==================================================
/**
 * Function that sends to the client the list of all the devices in the database in response to a GET request.
 *  
 * @param req: object submit by client
 * @param res: response object from server.
 */
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
    /*
    let devices=require('./datos.json');
    res.send(devices).status(200);
    */
   
    
    //Devices from the database
    
    connection.query('SELECT *  FROM Devices ', function(error,result, fields){
     //   console.log(result);    
        res.send(result).status(200);
        return;    
    })
});

//////////////removed because of security issues
/**
 * Function that sends one specific device to the client in response to a request
 * @param req: request object from client
 * @param res: Response object from Server
 * @param :id the id of the device
 */
/*
app.get('/devices/:id', function(req, res) {
    idAb=req.params.id;    
    //uncomment next tree lines if you want to use the file storage
    /*
    let datos=require('./datos.json');
    let datosfiltrados=datos.filter(item => item.id==req.params.id);
    res.send(datosfiltrados).status(200);*/

    //uncomment next query if you want to use the database
  /*  connection.query('SELECT *  FROM Devices WHERE id ='+idAb, function(error,result, fields){
        //console.log(result);    
        res.send(result).status(200);
        return;    
    })
});
*/

/**
 * Function that remove one specific device from the database in response to a delete request
 * 
 * @param req : request object contains id of device to be deleted
 * @param res : response object
 */
app.delete('/devices/', function(req, res, next) {
    let received=JSON.stringify(req.body[0]);
    
    //check database
    connection.query('Delete FROM Devices WHERE id ='+received, function(error,result, fields){
   //     console.log(result);        
    })
    res.send("Item deleted").status(200);
});

/**
 * Function that insert a new device to the database. Always set state to off.
 * @param req: request object. Contains information of the device.
 * @param res: response object. 
 */
app.post('/devices/', function(req, res, next) {
        
    let received=req.body;
    //sentences for debug
    /*console.log("name: "+received.name);
    console.log("type: "+received.type);
    console.log("description: "+received.description);*/

    //converting received data into string for use them in the sql sentence
    deviceName=JSON.stringify(received.name);
    deviceType=JSON.stringify(received.type);
    deviceDescription=JSON.stringify(received.description);
    deviceID=JSON.stringify(received.id);
    let sql = ``;
    console.log("device ask:"+deviceID);
    //preparing sql sentence for insertion, by default all devices are set with state false at insertion
    if(deviceID==0){
        sql += `INSERT INTO Devices (name, type, description,state) VALUES (${deviceName},${deviceType},${deviceDescription}, '0')`;
    }
    else{
        sql += `UPDATE Devices SET name=${deviceName},type=${deviceType}, Description=${deviceDescription} WHERE id=${deviceID}`;
    }
    
    //inserting device to database
    connection.query(sql, function(error,result){
        if (error) throw error;
        console.log("Number of records inserted: " + result.affectedRows);
    })       
    //send response to frontend
    res.send("Item add").status(200);
    res.end();
});



//Put method for change device state
/**
 * Function that update the state of a  device in the database. 
 * @params :id - device id
 * 
 */
app.put('/devices/', function(req, res, next) {
    
    requestLocal=JSON.parse(req.body[0]);
    
    let result=0;
    let sql = `UPDATE Devices SET state=${requestLocal.status} WHERE id=${requestLocal.id}`;
        
        //inserting device to database
     connection.query(sql, function(error,result){
            if (error) throw error;
            console.log("device updated: " + result.affectedRows);
        

    });
     
    //send response to frontend
    res.send("Item status Updated").status(200);
    res.end();
});
//
app.listen(PORT, function(req, res) {
    
    console.log("NodeJS API running correctly");
});

//=======[ End of file ]=======================================================

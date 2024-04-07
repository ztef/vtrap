/*
 * Copyright (c) Visual Interaction Systems. All rights reserved.
 * Licensed under the MIT License.
 * 
 * Product :  Visual Tracker Application Platform
 * Modulo  :  Router de Servicios de Backend
 * 
 */

var express = require('express');
const swaggerUi = require('swagger-ui-express');
const specs = require('./swagger');
const fs = require('fs'); 
require('dotenv').config();
var moment = require('moment');

// SQL SERVER
const sql = require('mssql');

const sheets = require('google-spreadsheet');
var router = express.Router();


function isAuthenticated(req, res, next) {
  if (!req.session.isAuthenticated) {
      return res.redirect('/auth/signin'); // redirect to sign-in route
  }

  next();
};

//router.use(isAuthenticated);


const { googleCreds } = require('../GoogleAuthConfig');

/*
try {
  // Read the JSON file
  const rawData = fs.readFileSync('./key.json');
  var creds = JSON.parse(rawData);
  
  // Use the `creds` object
  //console.log(creds);
} catch (error) {
  console.error('Error reading JSON file:', error);
}
*/


//const dbPassword = process.env.DB_PASSWORD;

const dbPassword = "Secr3t0sTEST.1";
console.log(dbPassword);

const sqlconfig = {
  user: 'cuadromando',
  password: dbPassword,
  port:1433,
  server: 'palaciosqlserver.ctfozmrzumd0.us-east-1.rds.amazonaws.com',    
  database: 'InndotEnrollDBP',
  requestTimeout: 1800000,
  options: {
      encrypt: false,
      useUTC: true
  },
  pool: {
      max: 10,
      min: 0,
      idleTimeoutMillis: 60000
  }
};



//console.log(googleCreds);

async function getFromSheet(data){

    console.log("Leyendo google sheet", data.sheet);
    
    
    //var SPREADSHEET_ID = '1jcCmQGVd8e0iWGSKs9koz2wNKjgDQAdV4KRbL90eCyI';
    
    var SPREADSHEET_ID = data.sheet;
    var sheetnumber = data.sheetnumber;


    //console.log("Hoja : ",SPREADSHEET_ID);
    //console.log("Creds :", googleCreds);
    //console.log("Creds old :", creds);
    
    const doc = new sheets.GoogleSpreadsheet(SPREADSHEET_ID);
    await doc.useServiceAccountAuth(googleCreds);
    
    
    await doc.loadInfo();
    const sheet = doc.sheetsByIndex[sheetnumber];
  
    var out = {};
  
  
          var rows =  await sheet.getRows();
          var headers = rows[0]._sheet.headerValues;
    
          headers.forEach((h,i,a)=>{
            console.log(h.toString());
          });
  
          rows.forEach((value,i,a)=>{
             
            var r = {};
             headers.forEach((h,j,a)=>{  
              r[headers[j]] = value[headers[j]];
              console.log(value[headers[j]]);
            });
  
            out[i] = r;
  
          })
  
          return out;
    }
  


    async function getMSSQLDataSTREAM(params, outs) {
      const q = params.query;
  
      console.log(q);
  
      try {
          await sql.connect(sqlconfig);
  
          // STREAM
          const request = new sql.Request();
          request.stream = true; // You can set streaming differently for each request
          request.query(q); // or request.execute(procedure)
  
          // Set headers for Server-Sent Events (SSE)
          outs.setHeader('Content-Type', 'text/event-stream');
          outs.setHeader('Cache-Control', 'no-cache');
          outs.setHeader('Connection', 'keep-alive');
  
          // Send initial event to indicate start of data
          //outs.write('data: [\n\n');
  
          request.on('row', row => {
              // Send each row as a separate event
              outs.write('data: ' + JSON.stringify({ msg: 'row', data: row }) + '\n\n');
          });
  
          request.on('done', result => {
              // Send event to indicate end of data
              //outs.write(']\n\n');
              outs.end(); // Close the connection
          });
      } catch (err) {
          // Send error response to the client
          outs.status(500).send('Internal Server Error');
          console.error('Error:', err);
      }
  }
  


    async function getMSSQLData(params, outs){

      
     
      const q = params.query;

      console.log(q);


      try {
      await sql.connect(sqlconfig)
    
      const result = await sql.query(q);
    
      return(result);
    
    
          //console.log(result)
          //return(result)
      } catch (err) {
        return err
      }
    }







/**
 * @swagger
 * /getFromSheet:
 *   get:
 *     summary: Obtiene data de una hoja de calculo en GoogleSheets.
 *     description: Obtiene datos al pasar como parametro el ID de la hoja de calculo.
 *     parameters:
 *       - in: query
 *         name: fechaInicio
 *         description: The start date for the query.
 *         required: true
 *         schema:
 *           type: string
 *       
 *     responses:
 *       200:
 *         description: Successful response
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   col1:
 *                     type: string
 *                   col2:
 *                     type: string
 *       400:
 *         description: Bad request
 */



    router.get('/getFromSheet',async (req, res) => {
  
      console.log("Recibiendo Info : ");
      //console.log(req.query.name);
    
         
             var out = await getFromSheet(req.query);
             res.write(JSON.stringify(out));
             res.end('');
    
    
    
    });


    router.get('/getMSSQLData',(req, res) => {

      let inicio = moment();
      console.log("Recibiendo query : ");
      console.log(req.query);
    
      res.setHeader('Content-Type', 'application/json');
    
      getMSSQLData(req.query,res).then((datos)=>{
    
                
                res.setHeader('Content-Type', 'application/json');
    
                let medio = moment()

                console.log(datos);
    
                if(datos.recordset === undefined){
                  res.end(JSON.stringify({'error de tiempo':'timeout'}))
                } else {
                  res.end(JSON.stringify(datos.recordset))
                }
    
    
                let fin = moment()
                console.log("Respondiendo query en : ", fin.diff(inicio));
                
    
        });
    
    
    });


    router.get('/getMSSQLDataSTREAM',(req, res) => {

      let inicio = moment();
      console.log("Recibiendo query : ");
      console.log(req.query);
    
      res.setHeader('Content-Type', 'application/json');
    
      getMSSQLDataSTREAM(req.query,res).then((datos)=>{
    
    
                let fin = moment()
                console.log("Respondiendo query en : ", fin.diff(inicio));
                
    
        });
    
    
    });





    


    router.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));

module.exports = router;

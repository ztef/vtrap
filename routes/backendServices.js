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

try {
  // Read the JSON file
  const rawData = fs.readFileSync('./key.json');
  var creds = JSON.parse(rawData);
  
  // Use the `creds` object
  //console.log(creds);
} catch (error) {
  console.error('Error reading JSON file:', error);
}








console.log(googleCreds);

async function getFromSheet(data){

    console.log("Leyendo google sheet");
    
    
    //var SPREADSHEET_ID = '1jcCmQGVd8e0iWGSKs9koz2wNKjgDQAdV4KRbL90eCyI';
    
    var SPREADSHEET_ID = data.sheet;


    console.log("Hoja : ",SPREADSHEET_ID);
    console.log("Creds :", googleCreds);
    console.log("Creds old :", creds);
    
    const doc = new sheets.GoogleSpreadsheet(SPREADSHEET_ID);
    await doc.useServiceAccountAuth(creds);
    
    
    await doc.loadInfo();
    const sheet = doc.sheetsByIndex[0];
  
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


    router.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));

module.exports = router;

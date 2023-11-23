/*
 * Copyright (c) Visual Interaction Systems. All rights reserved.
 * Licensed under the MIT License.
 * 
 * Product :  Visual Tracker Application Platform
 * Modulo  :  Router de Servicios de Backend
 * 
 */

var express = require('express');
const sheets = require('google-spreadsheet');
var router = express.Router();


const fs = require('fs');

try {
  // Read the JSON file
  const rawData = fs.readFileSync('./key.json');
  var creds = JSON.parse(rawData);
  
  // Use the `creds` object
  //console.log(creds);
} catch (error) {
  console.error('Error reading JSON file:', error);
}

async function getFromSheet(data){

    console.log("Leyendo google sheet");
    
    
    //var SPREADSHEET_ID = '1jcCmQGVd8e0iWGSKs9koz2wNKjgDQAdV4KRbL90eCyI';
    
    var SPREADSHEET_ID = data.sheet;
  
    
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
  
    router.get('/getFromSheet',async (req, res) => {
  
      console.log("Recibiendo Info : ");
      //console.log(req.query.name);
    
         
             var out = await getFromSheet(req.query);
             res.write(JSON.stringify(out));
             res.end('');
    
    
    
    });




module.exports = router;

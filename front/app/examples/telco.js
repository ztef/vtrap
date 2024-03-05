import { vi_MapFactory,vi_WindowFormater, vi_ObjectModel, vi_RemoteListenerFactory,  vi_ObjectDetailView, vi_ObjectGridView, vi_Controller, vi_DataSource} from '../viOne/all.js';
 
const windowFormater = new vi_WindowFormater();

    

// CREA UN CONTROLADOR
   const controller = new vi_Controller();
 
// CREA UN MODELO DE OBJETOS 
   const objectModel = new vi_ObjectModel(controller);

// CREA UNA FABRICA PARA LISTENERS REMOTOS   
   const remoteListenerFactory = new vi_RemoteListenerFactory();

// CREA UN DATASOURCE PARA ROUTERS

const config = {
   "SPREADSHEET_ID": "1iVyL2h1HJgvfM_MzrUshHtJOjqrvy4OTujKchNjiKSM",
   "collections" : [{
     "collection":"routers",
     "collectionName" : "RUTEADORES",
     "geoField": {_lat:"_lat", _long:"_long"}
   }]
  }
  
const routersDataSource = new vi_DataSource('GoogleSheet', config);
windowFormater.formatWindow("#routers","Routers",500,350);

const routersGridView = new vi_ObjectGridView('routers','routers',controller);


windowFormater.formatWindow("#info","Router Seleccionado :",500,350);

     
 

// Crea un Factory de Mapas
const mapFactory = new vi_MapFactory();

// Crea un mapa 
const mapConfig = {
   markerWidth: 50000.0,
   markerHeight : 35600,
};

const map = mapFactory.createMap("Cesium", controller,['routers'], mapConfig);

var altura=65400;

var radio=500;	




// Formatea el contendor de mapa como ventana
 windowFormater.formatWindow("#mapContainer","Network",500,350);

// Formatea el contendor de mapa como ventana
windowFormater.formatWindow("#segments","Segments",500,350);

windowFormater.formatWindow("#ifr","Vista por Tiempo",650,450);

//<iframe id="ifr" src="/front/app/semana/index.html" width="600" height="400" frameborder="0" ></iframe>

const iframeHtml = '<iframe src="/front/app/semana/index.html" width="1200" height="800" frameborder="0"></iframe>';
windowFormater.insertHtmlContent('ifr', iframeHtml);



var routersRemoteListener;
// Carga el mapa en su contenedor



const configAlert = {
   "credentials":{
       "apiKey": "AIzaSyAtFQf2c8ohsCHXHJnYQB0pig82Lb-3F-Q",
       "authDomain": "vixroader.firebaseapp.com",
       "projectId": "vixroader",
       "storageBucket": "vixroader.appspot.com",
       "messagingSenderId": "445371639222",
       "appId": "1:445371639222:web:b8607e42343fd0edca4d17",
       "measurementId": "G-QE6S1YSDT4"
     },
     "collections" : [{
         "collection":"locations",
         "collectionName":"Locations",
         "loadType":"suscription"
     }
     ]
   }

  const alertDataSource = new vi_DataSource('Firebase', configAlert);



  const configSegments = {
   "credentials":{
       "apiKey": "AIzaSyAtFQf2c8ohsCHXHJnYQB0pig82Lb-3F-Q",
       "authDomain": "vixroader.firebaseapp.com",
       "projectId": "vixroader",
       "storageBucket": "vixroader.appspot.com",
       "messagingSenderId": "445371639222",
       "appId": "1:445371639222:web:b8607e42343fd0edca4d17",
       "measurementId": "G-QE6S1YSDT4"
     },
     "collections" : [{
         "collection":"trips",
         "collectionName":"trips",
         "loadType":"suscription"
     }
     ]
   }

  objectModel.setFilter('trips','status','==', 'active');
  const segmentsDataSource = new vi_DataSource('Firebase', configSegments);


  const segmentsGridView = new vi_ObjectGridView('trips','segments',controller,
  ()=>{
     return "<th>ID</th><th>Origen</th><th>Destino</th><th>Status</th>";
  },
  (id,collection,data)=>{
     return `<td>${data.id}</td><td>${data.fields.origin}</td>
     <td>${data.fields.destination}</td><td>${data.fields.alert}</td>`;
  });



  const detailView = new vi_ObjectDetailView('routers','info',controller,
  ()=>{
     return "<th>ID</th><th>Placas</th><th>Desc</th><th>Lat</th><th>Long</th>";
  },
  (id,collection,data)=>{
     return `<tr><td>ID</td><td>${data.id}</td></tr>
     <tr><td>Equipo</td><td>${data.fields.marca}</td></tr>
     <tr><td>LAT</td><td>${data.position._lat}</td></tr>
     <tr><td>LNG</td><td>${data.position._long}</td></tr>`;
  });




map.loadMap('mapContainer').then(()=>{
   
   map.addObjectGeometry('routers', [
   
   
      {
         offset: {x:0, y:0, z:3500},
         cylinder : {
           length : altura,
            topRadius :  radio,
            bottomRadius : radio,
            material : map.MapLib.Color.fromCssColorString("#0000FF"),
            clampToGround: true,
         
      }},
      
      
   ]);


   routersRemoteListener = remoteListenerFactory.createRemoteListener(routersDataSource,objectModel);
   const alertRemoteListener = remoteListenerFactory.createRemoteListener(alertDataSource,objectModel);
   const segmentsRemoteListener = remoteListenerFactory.createRemoteListener(segmentsDataSource,objectModel);

   
   map.onObjectUpdated((updatedObject, objectEntities)=>{

      var tripState = updatedObject.data.fields.status;
      var color = '#0000FF';
      if(tripState == 'ok'){
         color = '#00FF00';
      }
      if(tripState == 'low'){
         color = '#FFFF00';
      }
      if(tripState == 'medium'){
         color = '#FF0000';
      }
      if(tripState == 'critical'){
         color = '#FF00FF';
      }


      objectEntities[0].cylinder.material.color.setValue(map.MapLib.Color.fromCssColorString(color).withAlpha(1));
   });
   


});



controller.addObserver('locations',"objectUpdated",BLOC_ALERT);

function BLOC_ALERT(domain, event, data){

   var object;
   var router;
  
  switch (event) {
    
   case 'objectUpdated':

       object = objectModel.readObject(domain, data.id);   
       router = objectModel.readObject('routers',  object.data.fields.name);

      if(router){


            router.data.fields.status = object.data.fields.alert;

            objectModel.updateOrAddObject(object.data.fields.name, 'routers', router.data);

            console.log(router.data.fields.id);
            console.log(router.data.fields.status);
      }

      

     break;

  
   default:
     throw new Error(`Unsupported event: ${event}`);
   }

  
}


controller.addObserver('trips',"objectAdded",BLOC_RUTAS);
controller.addObserver('trips',"objectUpdated",BLOC_RUTAS);
controller.addObserver('trips',"objectSelected",BLOC_RUTAS);


function BLOC_RUTAS(domain, event, data){

   var object;
  
  switch (event) {
    
   case 'objectAdded':

       object = objectModel.readObject(domain, data.id);          
       map.loadPolylineString(data.id, object.data.fields.route);
       

     break;

   case 'objectUpdated':

     object = objectModel.readObject(domain, data.id);   

     var color = '#0000FF';
     var tripState = object.data.fields.alert;

     if(tripState == 'ok'){
        color = '#00FF00';
     }
     if(tripState == 'low'){
        color = '#FFFF00';
     }
     if(tripState == 'medium'){
        color = '#FF0000';
     }
     if(tripState == 'critical'){
        color = '#FF00FF';
     }
    
      
      map.setPolyline(data.id, color);

      break;



      case 'objectSelected':

      object = objectModel.readObject(domain, data.id);   
 
      //map.clearPolylines();
     
       
       map.flyToPolyline(data.id);
     

   break;



  
   default:
     throw new Error(`Unsupported event: ${event}`);
   }

  
}



controller.addObserver('routers',"objectPicked",BLOC_ROUTERS);

function BLOC_ROUTERS(domain, event, data){

   
   var router;
  
  switch (event) {
    
   case 'objectPicked':

       router = objectModel.readObject(domain, data.id);   
      

      if(router){


            //alert(router.data.fields.equipo);
      }

      

     break;

  
   default:
     throw new Error(`Unsupported event: ${event}`);
   }

  
}


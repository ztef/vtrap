import { vi_MapFactory,vi_WindowFormater, vi_ObjectModel, vi_RemoteListenerFactory, vi_ObjectGridView, vi_Controller, vi_DataSource} from '../viOne/all.js';
 
const windowFormater = new vi_WindowFormater();

    

// CREA UN CONTROLADOR
   const controller = new vi_Controller();
 
// CREA UN MODELO DE OBJETOS 
   const objectModel = new vi_ObjectModel(controller);

// CREA UNA FABRICA PARA LISTENERS REMOTOS   
   const remoteListenerFactory = new vi_RemoteListenerFactory();

// CREA UN DATASOURCE PARA MOVILES (FIREBASE)   
   const config = {
    "credentials":{
        "apiKey": "AIzaSyAtFQf2c8ohsCHXHJnYQB0pig82Lb-3F-Q",
        "authDomain": "vixroader.firebaseapp.com",
        "projectId": "vixroader",
        "storageBucket": "vixroader.appspot.com",
        "messagingSenderId": "445371639222",
        "appId": "1:445371639222:web:b8607e42343fd0edca4d17",
        "measurementId": "G-QE6S1YSDT4"
      },
      "collection":"trips",
      "collectionName":"Mobiles en Ruta"
    }

   const movilesDataSource = new vi_DataSource('Firebase', config);


 // Formatea div de objetos para que sea una ventana :
 windowFormater.formatWindow("#objects_menu","Moviles en Transito",500,350);
 windowFormater.positionDiv("objects_menu",10,50);

  

 const gridView = new vi_ObjectGridView('objects_menu',controller,
 ()=>{
    return "<th>Unidad</th><th>Destino</th><th>Estado</th>";
 },
 (id,collection,data)=>{
    return `<td>${data.fields.unit}</td><td>${data.fields.destination}</td><td>${data.fields.tripState}</td>`;
 });
     
 

// Crea un Factory de Mapas
const mapFactory = new vi_MapFactory();

// Crea un mapa 
const map = mapFactory.createMap("Cesium", controller);

var altura=1400;

var radio=100;	




// Formatea el contendor de mapa como ventana
 windowFormater.formatWindow("#mapContainer","Mapa",500,350);

var movilesRemoteListener;
// Carga el mapa en su contenedor
map.loadMap('mapContainer').then(()=>{
   
   map.addObjectGeometry('trips', [
   
   
      {
         offset: {x:0, y:0, z:1500},
         cylinder : {
         length : altura,
         topRadius :  radio,
         bottomRadius : radio,
         material : map.MapLib.Color.fromCssColorString("#FFFFFF")
         
      }},
      
      
      ]);
       movilesRemoteListener = remoteListenerFactory.createRemoteListener(movilesDataSource,objectModel);
});

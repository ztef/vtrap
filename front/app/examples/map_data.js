// Importa un Controlador y un Factory de Mapas
// Agrega un WindowFormater
import { vi_ObjectModel, vi_RemoteListenerFactory, vi_DataSource ,vi_WindowFormater, vi_MapFactory, vi_Controller, vi_ObjectGridView} from '../viOne/all.js';

// Crea un Controlador
const controller = new vi_Controller();

// CREA UN MODELO DE OBJETOS 
   const objectModel = new vi_ObjectModel(controller);

// CREA UNA FABRICA PARA LISTENERS REMOTOS   
   const remoteListenerFactory = new vi_RemoteListenerFactory();

// CREA UN DATASOURCE PARA SUCURSALES   
   const config = {
    "SPREADSHEET_ID": "1-RBLm2NkUqA4BqQdIiwLJKa8F6QB5O-wIY_iL1cyj44",
    "collection":"sucursales",
    "collectionName" : "SUCURSALES"
   }
   const sucursalesDataSource = new vi_DataSource('GoogleSheet', config);

// Crea un Formateador de Ventanas
const windowFormater = new vi_WindowFormater();

// Formatea div de objetos para que sea una ventana :
 windowFormater.formatWindow("#objects_menu","Sucursales",500,350);
 windowFormater.positionDiv("objects_menu",10,50);

 const gridView = new vi_ObjectGridView('objects_menu',controller);
     
 
 


// Crea un Factory de Mapas
const mapFactory = new vi_MapFactory();

// Crea un mapa 
const map = mapFactory.createMap("Cesium", controller);



// Formatea el contendor de mapa como ventana
 windowFormater.formatWindow("#mapContainer","Mapa",500,350);

var cedisRemoteListener;
// Carga el mapa en su contenedor
map.loadMap('mapContainer').then(()=>{
    //   mobilesRemoteListener = remoteListenerFactory.createRemoteListener(tripDataSource,objectModel);
       cedisRemoteListener = remoteListenerFactory.createRemoteListener(sucursalesDataSource,objectModel);
     });





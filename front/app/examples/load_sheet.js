import { vi_WindowFormater, vi_ObjectModel, vi_RemoteListenerFactory, vi_ObjectGridView, vi_Controller, vi_DataSource} from '../viOne/all.js';
 
const windowFormater = new vi_WindowFormater();

    

// CREA UN CONTROLADOR
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


 // Formatea div de objetos para que sea una ventana :
 windowFormater.formatWindow("#objects_menu","Sucursales",500,350);
 windowFormater.positionDiv("objects_menu",10,50);

 const gridView = new vi_ObjectGridView('objects_menu',controller);
     
 cedisRemoteListener = remoteListenerFactory.createRemoteListener(sucursalesDataSource,objectModel);









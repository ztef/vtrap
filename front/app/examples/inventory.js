import { vi_WindowFormater, vi_ObjectModel, vi_RemoteListenerFactory, vi_ObjectGridView, vi_Controller, vi_DataSource} from '../viOne/all.js';
 
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
        "apiKey": "AIzaSyA_vZkjrsR7tz9TFfw4_PEwfpDe0Pz0zZA",
        "authDomain": "sundekinventory.firebaseapp.com",
        "projectId": "sundekinventory",
        "storageBucket": "sundekinventory.appspot.com",
        "messagingSenderId": "505209625267",
        "appId": "1:505209625267:web:9193f409272639bc91eec6",
        "measurementId": "G-V4MG6QSJZH"
      },
      "collection":"families",
      "collectionName":"Families"
    }

   const dbDataSource = new vi_DataSource('Firebase', config);


 // Formatea div de objetos para que sea una ventana :
 windowFormater.formatWindow("#objects_menu","Families of Products",500,350);
 windowFormater.positionDiv("objects_menu",10,50);

  

 const gridView = new vi_ObjectGridView('families','objects_menu',controller,
 ()=>{
    return "<th>ID</th><th>Family</th>";
 },
 (id,collection,data)=>{
    return `<td>${data.fields.id}</td><td>${data.fields.family}</td>`;
 });
     
 const dbRemoteListener = remoteListenerFactory.createRemoteListener(dbDataSource,objectModel);



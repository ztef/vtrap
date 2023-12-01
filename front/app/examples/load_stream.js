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
     
 const movilesRemoteListener = remoteListenerFactory.createRemoteListener(movilesDataSource,objectModel);



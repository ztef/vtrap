import { vi_MapFactory, vi_WindowFormater, vi_ObjectModel, vi_RemoteListenerFactory, vi_ObjectDetailView, vi_ObjectGridView, vi_Controller, vi_DataSource} from '../viOne/all.js';
 
const windowFormater = new vi_WindowFormater();

    

// CREA UN CONTROLADOR
   const controller = new vi_Controller();
 
// CREA UN MODELO DE OBJETOS 
   const objectModel = new vi_ObjectModel(controller);

// CREA UNA FABRICA PARA LISTENERS REMOTOS   
   const remoteListenerFactory = new vi_RemoteListenerFactory();



 const config = {
    "credentials":{
      "awsSettings":{
		    "Auth": {
		      "identityPoolId": 'us-east-1:b52d3392-dd5a-4aa4-b4a5-203d3df23ef3',
		      "region": 'us-east-1',
		      "userPoolId": 'us-east-1_2FfwVWHSA',
		      "userPoolWebClientId": '37p9ficqb17ou7r8kdm7utgf2a'
		    }},
      "mqttSettings":{
		    "AWS_REGION": 'us-east-1',
		    "AWS_WEBSOCKET": 'wss://a1q6zds606s7ll-ats.iot.us-east-1.amazonaws.com/mqtt',
		    "CHANNEL": `routes/vehicles/d0c1a9b3-81fb-4b45-b42b-dc170408a227`,
		    "IAM_PASSWORD": 'uhGZJg6uo2U!',
		    "IAM_USERNAME": 'adonai@bsdenterprise.com',
	      }

      },
      "collection":"moviles",
      "collectionName":"Mobiles en Ruta",
      "library" : RTLib
    }

   

    const konectivanDataSource = new vi_DataSource('aws-mqtt', config );
    

// DataSource de clientes

const config_clientes = {
   "SPREADSHEET_ID": "1VrupNQhTn1Du6dQIcepa7UtqddTfyHsK9-bqZ5AQpPo",
   "collection":"clientes",
   "collectionName" : "CLIENTES"
  }
  
  const clientesDataSource = new vi_DataSource('GoogleSheet', config_clientes);


// Formatea div de objetos para que sea una ventana :
windowFormater.formatWindow("#clientes","Clientes",500,350);
windowFormater.positionDiv("clientes",10,50);

const gridViewClientes = new vi_ObjectGridView('clientes','clientes',controller);
    
const clietesRemoteListener = remoteListenerFactory.createRemoteListener(clientesDataSource,objectModel);




 // Formatea div de objetos para que sea una ventana :
 windowFormater.formatWindow("#ventana","Moviles en Transito",500,350);
 windowFormater.positionDiv("ventana",10,50);


// Ventana de informacion al seleccionar un elemento
 windowFormater.formatWindow("#info","Movil Seleccionado :",500,350);

  

 const gridView = new vi_ObjectGridView('moviles','ventana',controller,
 ()=>{
    return "<th>ID</th><th>Placas</th><th>Desc</th><th>Lat</th><th>Long</th>";
 },
 (id,collection,data)=>{
    return `<td>${data.id}</td><td>${data.fields.plate}</td>
    <td>${data.fields.device.description}</td>
    <td>${data.position._lat}</td><td>${data.position._long}</td>`;
 });
     



const detailView = new vi_ObjectDetailView('moviles','info',controller,
()=>{
   return "<th>ID</th><th>Placas</th><th>Desc</th><th>Lat</th><th>Long</th>";
},
(id,collection,data)=>{
   return `<tr><td>ID</td><td>${data.id}</td></tr>
   <tr><td>PLACA</td><td>${data.fields.plate}</td></tr>
   <tr><td>DESC</td><td>${data.fields.device.description}</td></tr>
   <tr><td>LAT</td><td>${data.position._lat}</td></tr>
   <tr><td>LNG</td><td>${data.position._long}</td></tr>`;
});




// Crea un Factory de Mapas
const mapFactory = new vi_MapFactory();

// Crea un mapa 
const map = mapFactory.createMap("Cesium", controller,['moviles']);




// Formatea el contendor de mapa como ventana
 windowFormater.formatWindow("#mapContainer","Mapa",500,350);

var konectivanRemoteListener;


map.loadMap('mapContainer').then(()=>{


   var altura=400;

	var radio=100;	

   map.addObjectGeometry('moviles', [
      
      
   {
      offset: {x:0, y:0, z:2200},
      cylinder : {
      length : altura,
      topRadius :  radio,
      bottomRadius : radio,
      material : map.MapLib.Color.fromCssColorString("#FFFFFF").withAlpha(.2)
      
   }},


   {
      offset: {x:0, y:0, z:2100},
      cylinder : {
         length : altura*.5,
         topRadius :  radio*.8,
         bottomRadius : radio*.8,
         material : map.MapLib.Color.fromCssColorString("#FFEA00").withAlpha(1)
         
      }
   },

   {
      offset: {x:0, y:0, z:500},
      cylinder : {
      length : 3000,
      topRadius :  20,
      bottomRadius : 20,
      material : Cesium.Color.fromCssColorString("#ffffff").withAlpha(.2)								
   }
  }

]);


   konectivanRemoteListener = remoteListenerFactory.createRemoteListener(konectivanDataSource,objectModel); 
});



// AREA REACTIVA (Reaccion a eventos)

controller.addObserver('moviles',"objectSelected",BLOC);
controller.addObserver('moviles',"objectPicked",BLOC);

function BLOC(domain, event, data){

   var object;
  
  switch (event) {
   // Al seleccionar un objeto :  
   case 'objectSelected':


       object = objectModel.readObject(domain, data.id);
    
       
         
     break;

   case 'objectPicked':


      object = objectModel.readObject(domain, data.id);
 
    
      
  break;





   default:
     throw new Error(`Unsupported event: ${event}`);
   }

  
}




 
 


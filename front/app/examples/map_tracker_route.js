import { vi_MapFactory, vi_WindowFormater, vi_ObjectModel, vi_RemoteListenerFactory, vi_ObjectGridView, vi_Controller, vi_DataSource} from '../viOne/all.js';
 
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
    




 // Formatea div de objetos para que sea una ventana :
 windowFormater.formatWindow("#ventana","Moviles en Transito",500,350);
 windowFormater.positionDiv("ventana",10,50);

  

 const gridView = new vi_ObjectGridView('ventana',controller,
 ()=>{
    return "<th>ID</th><th>Placas</th><th>Desc</th><th>Lat</th><th>Long</th>";
 },
 (id,collection,data)=>{
    return `<td>${data.id}</td><td>${data.fields.plate}</td>
    <td>${data.fields.device.description}</td>
    <td>${data.position._lat}</td><td>${data.position._long}</td>`;
 });
     

// Crea un Factory de Mapas
const mapFactory = new vi_MapFactory();

// Crea un mapa 
const map = mapFactory.createMap("Cesium", controller);




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

controller.addObserver("objectSelected",BLOC);
controller.addObserver("objectPicked",BLOC);

function BLOC(event, data){

   var object;
  
  switch (event) {
   // Al seleccionar un objeto :  
   case 'objectSelected':


       object = objectModel.readObject(data.name);
    
        alert(object.data.fields.nombre);
         
     break;

   case 'objectPicked':


      object = objectModel.readObject(data[0].name);
 
     alert(object.data.fields.nombre);
      
  break;





   default:
     throw new Error(`Unsupported event: ${event}`);
   }

  
}




 
 


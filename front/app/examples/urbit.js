import { vi_mqtt_listener } from '../viOne/remote/vi_mqtt_listener.js';
import { vi_MapFactory, vi_3DSceneRenderer, vi_WindowFormater, vi_ObjectModel, vi_RemoteListenerFactory, vi_ObjectGridView, vi_Controller, vi_DataSource} from '../viOne/all.js';
import { vi_force_directed_tree } from '../viOne/view/vi_force_directed_tree.js';

import { vi_HiperCircle} from '../viOne/view/vi_hipercircle.js';

import { vi_geometry_factory } from '../viOne/view/vi_geometry_factory.js';
import { vi_hipergeometry_factory } from '../viOne/view/vi_hipergeometry_factory.js';
import { vi_slot_controller } from '../viOne/view/vi_slot_cotroller.js';


//CREA UN CONTROLADOR
   const controller = new vi_Controller();
 
// CREA UN MODELO DE OBJETOS 
   const objectModel = new vi_ObjectModel(controller);


const broker = "wss://e5246e3f23d9429b847455d56bdd93e6.s1.eu.hivemq.cloud:8884/mqtt";
var options = {
   
    username: 'ztef@hotmail.es',
    password: 'whbR7Q9_AyYCM.U'
}

const topic = '#';

const mqttClient = new vi_mqtt_listener(broker, options, topic, objectModel);
mqttClient.init();



const windowFormater = new vi_WindowFormater();

windowFormater.formatWindow("#d3","URBIT-HUB GATEWAYS-SENSORS-MAP",600,550);
windowFormater.positionDiv("d3",70,60);  

/*
const data = {
    "name":"URBIT_HUB", "id":"root","icon":"/front/app/assets/urbit.png" ,"children":[

        {"name":"ACTIVO", value:32445,
        children:[
          {"name":"ENROLAMIENTO_TERMINADO", value:32445}
          
        ]
      },
  
      {"name":"SOLICITUDES", value:32000,
          children:[
      
              {"name":"ACTIVO", value:32445,
                  children:[
                    {"name":"ENROLAMIENTO_TERMINADO", value:32445}
                    
                  ]
              },
            {"name":"CANCELADO",value:1131,children:[
  
              {"name":"CAPTURA_FACIAL", value:62},
              {"name":"CAPTURA_HUELLA", value:54},
              {"name":"ENROLAMIENTO_TERMINADO", value:206},
              {"name":"IDENTIFICACION", value:809},
  
              
            ]},
            {"name":"EN_PROCESO", value:459, children:[
  
              {"name":"CAPTURA_FACIAL", value:42},
              {"name":"CAPTURA_HUELLA", value:93},
              {"name":"IDENTIFICACION", value:324},
  
            ]}
          ]
      }
    ]
  
   }
*/

// VENTANAS RAW

windowFormater.formatWindow("#gateways","GATEWAYS-RAW",600,550);
windowFormater.formatWindow("#sensors","SENSORS RAW",600,550);
windowFormater.formatWindow("#graphics","3D MODEL",500,350);



const grid_gateways = new vi_ObjectGridView('gateways','gateways',controller,()=>{
    return "<th>IMEI</th><th>Origin</th><th>GPS</th><th>BATT is Charging</th><th>Percentage</th>";
 },
 (id,collection,data)=>{
    return `<td>${data.fields.IMEI}</td><td>${data.fields.origin}</td><td>${data.fields.StatFlg.GPS}</td><td>${data.fields.BattSt.isCharging}</td><td>${data.fields.BattSt.percentage}</td>`;
 });





const grid_sensors = new vi_ObjectGridView('sensors','sensors',controller);
     



const data = {
    "name":"URBIT_HUB","id":"root", "icon":"/front/app/assets/urbit.png" 
}

  
console.log('PRE OBSERVANDO');

const divId = 'd3'; // ID of the div where you want the SVG to be appended
const forceDirectedTree = new vi_force_directed_tree(data, divId, controller);



console.log('OBSERVANDO');

controller.addObserver('gateways',"objectAdded",BLOC_MSG);

function BLOC_MSG(domain, event, data){

   var object;
   
   switch (event) {
     
    case 'objectAdded':
 
        object = objectModel.readObject(domain, data.id);  

        console.log('NUEVO GATEWAY', object);

        forceDirectedTree.addNode("root", {
            "name":"GATEWAY:"+data.id,"id":data.id, "type":"gateways","icon":"/front/app/assets/antena.png" 
        });        
         
        
 
      break;
 
    case 'objectUpdated':
 
      object = objectModel.readObject(domain, data.id);   
 
      console.log('ACTUALIZANDO GATEWAY', object);
       
       
 
       break;
 
 
 
     case 'objectSelected':
 
       
 
    break;
 
 
 
   
    default:
      throw new Error(`Unsupported event: ${event}`);
    }
 
   
 }



controller.addObserver('sensors',"objectAdded",BLOC_SENSORS);

function BLOC_SENSORS(domain, event, data){

   var object;
   
   switch (event) {
     
    case 'objectAdded':
 
        object = objectModel.readObject(domain, data.id);  

        console.log('NUEVO SENSOR', object);

        forceDirectedTree.addNode(object.data.fields.IMEI, {
            "name":"SENSOR:"+data.id,"id":data.id, "type":"sensors", "icon":"/front/app/assets/sensor.png" 
        });        
         
        
 
      break;
 
    case 'objectUpdated':
 
      object = objectModel.readObject(domain, data.id);   
 
      console.log('ACTUALIZANDO GATEWAY', object);
       
       
 
       break;
 
 
 
     case 'objectSelected':
 
       
 
    break;
 
 
 
   
    default:
      throw new Error(`Unsupported event: ${event}`);
    }
 
   
 }



 // MAPS

var altura=5400;

var radio=50;	


 windowFormater.formatWindow("#mapContainer","Location",500,350);

 // Crea un Factory de Mapas
const mapFactory = new vi_MapFactory();

// Crea un mapa 
const map = mapFactory.createMap("Cesium", controller,['gateways']);

map.loadMap('mapContainer').then(()=>{
   
    map.addObjectGeometry('gateways', [
    
    
       {
          offset: {x:0, y:0, z:1500},
          cylinder : {
          length : altura,
          topRadius :  radio,
          bottomRadius : radio,
          material : map.MapLib.Color.fromCssColorString("#FF0000")
          
       }},
       
       
    ]);
 
 
 
 });



 // 3D GRAPHICS

 const renderer = new vi_3DSceneRenderer('graphics',controller,['gateways']);

 const geometry_factory = new vi_geometry_factory();
 let hgf= new vi_hipergeometry_factory(geometry_factory);
 
 //renderer.focus(0,0,0,100);
 
 
 const centro = { x: 0, y: 0, z: 0 };
 const amplitude = 25;
 const levelsArray = [5];



 const hiperCircle = new vi_HiperCircle(amplitude, 0, centro);
  
 
 hiperCircle.setLevels(levelsArray);
 hiperCircle.defineLevels(['gateways']);
 
 hiperCircle.setRenderEngine(renderer, geometry_factory);

 hiperCircle.setGraphics({
   center:{amplitude:10, color:0x00ff00, transparent:true, opacity:0.5 },
   labels :{ size:{size:0.7, height:0.1}, color:0x000000, align:false},
   markers:{shape:'Circle',size:{size:.01,definition:10}},
  });
 
 hiperCircle.draw(0);


 const sc = new vi_slot_controller(hiperCircle, renderer);
 sc.setDirection('out');  


 controller.addObserver('gateways',"objectAdded",(domain, _event, data)=>{

    switch (_event) {     
       case 'objectAdded':
   
            let object = objectModel.readObject(domain, data.id);
            let index = objectModel.indexOfObject(domain, data.id);
            let point = hiperCircle.drawLabel(''+index,  ''+object.data.fields.IMEI, -10 );


            // HIPERGEOMETRY

            let _color = 0x00ff00;
            let battery = object.data.fields.BattSt.percentage / 10;

            if (battery < 9  ){
                 _color = 0xff0000;
            }

            let  geomcfg = {
                "base": { "shape": "Circle", "radius": 0.25, "color":0xf4A020 },
                "label": { "value": object.data.fields.IMEI, "x": 0, "y": 0, "z":0, size:0.1 },
                "columns": [
                   { "units": { "shape": "Cylinder", x:0,y:0, z:0, "radiusTop": 0.01, "radiusBottom": 0.01, "height": battery, "color": _color } }
                  
                ]
             };

            if(object.data.fields.StatFlg.GPS == 1){
                geomcfg.icons = {'icon':'gps'}
            }
          
            let hg = hgf.createGeometriesFromConfig(geomcfg,point);
            hg.id = 'gateways.'+object.data.fields.IMEI;

            renderer.addGeometry(hg);

             
         break;
   
       default:
         throw new Error(`Unsupported event: ${_event}`);
       }
 
  });

  controller.addObserver('sensors',"objectAdded",(domain, _event, data)=>{

    switch (_event) {     
       case 'objectAdded':
   
            let object = objectModel.readObject(domain, data.id);
            let index = objectModel.indexOfObject('gateways', object.data.fields.IMEI);


            // HIPERGEOMETRY

            let h = 3;
            let c = 0x0000ff; 
            
            let  geomcfg = {
                "base": { "shape": "Circle", "radius": 0.25, "color":0xf4A020 },
                "label": { "value": data.id, "x": 0, "y": 0, "z":0, size:0.1 },
                "columns": [
                   { "units": { "shape": "Cylinder", x:0,y:0, z:0, "radiusTop": 0.01, "radiusBottom": 0.01, "height": h, "color": c } }
                  
                ]
             };

          
             let hg = hgf.createGeometriesFromConfig(geomcfg,{x:0,y:0,z:0});
            
             sc.addObject2Slot(''+index, 'sensors.'+data.id, data.id,hg);


             
         break;
   
       default:
         throw new Error(`Unsupported event: ${_event}`);
       }
 
  });
 
 
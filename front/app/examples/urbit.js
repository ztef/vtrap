import { vi_mqtt_listener } from '../viOne/remote/vi_mqtt_listener.js';
import { vi_3DSceneRenderer, vi_WindowFormater, vi_ObjectModel, vi_RemoteListenerFactory, vi_ObjectGridView, vi_Controller, vi_DataSource} from '../viOne/all.js';
import { vi_force_directed_tree } from '../viOne/view/vi_force_directed_tree.js';


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


const data = {
    "name":"URBIT_HUB","id":"root", "icon":"/front/app/assets/urbit.png" 
}

  
console.log('PRE OBSERVANDO');

const divId = 'd3'; // ID of the div where you want the SVG to be appended
const forceDirectedTree = new vi_force_directed_tree(data, divId);



console.log('OBSERVANDO');

controller.addObserver('gateways',"objectAdded",BLOC_MSG);

function BLOC_MSG(domain, event, data){

   var object;
   
   switch (event) {
     
    case 'objectAdded':
 
        object = objectModel.readObject(domain, data.id);  

        console.log('NUEVO GATEWAY', object);

        forceDirectedTree.addNode("root", {
            "name":"GATEWAY:"+data.id,"id":data.id, "icon":"/front/app/assets/antena.png" 
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
            "name":"SENSOR:"+data.id,"id":data.id, "icon":"/front/app/assets/sensor.png" 
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
 
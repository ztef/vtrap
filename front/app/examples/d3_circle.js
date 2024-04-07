import { vi_3DSceneRenderer, vi_WindowFormater, vi_ObjectModel, vi_RemoteListenerFactory, vi_ObjectGridView, vi_Controller, vi_DataSource} from '../viOne/all.js';
import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm";
import { vi_toolbox } from '../viOne/view/vi_toolbox.js';
import { vi_HiperLine } from '../viOne/view/vi_hiperline.js';
import { vi_geometry_factory } from '../viOne/view/vi_geometry_factory.js';
import { vi_circlepack } from '../viOne/view/vi_circlepack.js';
 

const windowFormater = new vi_WindowFormater();

 

windowFormater.formatWindow("#d3","D3",600,550);
windowFormater.positionDiv("d3",70,60);  



//D3 


var cp = new vi_circlepack("d3");

const data = {
  "name":"ESTATUS","children":[
    

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

cp.draw(data);





// Example table data
const tableData = [
    ["ACTIVO", "ENROLAMIENTO_TERMINADO", 32445],
    ["ACTIVO", "TODOS", 32445],
    ["CANCELADO", "CAPTURA_FACIAL", 62],
    ["CANCELADO", "CAPTURA_HUELLA", 54],
    ["CANCELADO", "ENROLAMIENTO_TERMINADO", 206],
    ["CANCELADO", "IDENTIFICACION", 809],
    ["CANCELADO","TODOS", 1131],
    ["EN_PROCESO", "CAPTURA_FACIAL", 42],
    ["EN_PROCESO", "CAPTURA_HUELLA", 93],
    ["EN_PROCESO", "IDENTIFICACION", 324],
    ["EN_PROCESO", "TODOS", 459],
    ["TODOS", "TODOS", 34035]
];

// Convert the table data to JSON-like structure
const jsonData = convertTableToJSON(tableData);
console.log(JSON.stringify(jsonData, null, 2)); // Display the JSON data

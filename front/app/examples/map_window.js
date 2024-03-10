// Importa un Controlador y un Factory de Mapas
// Agrega un WindowFormater
import { vi_WindowFormater, vi_MapFactory, vi_Controller} from '../viOne/all.js';
import { vi_toolbox } from '../viOne/view/vi_toolbox.js';

// Crea un Controlador
const controller = new vi_Controller();

// Crea un Factory de Mapas
const mapFactory = new vi_MapFactory();

// Crea un mapa 

const map = mapFactory.createMap("Cesium", controller,[]);

// Crea un Formateador de Ventanas
const windowFormater = new vi_WindowFormater();

// Formatea el contendor de mapa como ventana
 windowFormater.formatWindow("#mapContainer","Mapa",500,350);


 var toolBoxConfig = {
    "options":[
      {"option1" : {"icon":"/front/app/assets/metro.png","tooltip":"Marcar Universidades"}},
      {"option2" : {"icon":"/front/app/assets/damp.png","tooltip":"Cambiar Damping"}},  
      {"option3" : {"icon":"/front/app/assets/sky.png","tooltip":"Modo Oscuro"}},       
    ]
}

 const toolbox = new vi_toolbox(toolBoxConfig,(opcion)=>{

    if(opcion == 'option1'){
    }

    if(opcion == 'option2'){
      
    }

    if(opcion == 'option3'){

    }

});
// Carga el mapa en su contenedor
map.loadMap('mapContainer').then(()=>{

   
   
   
   map.setupToolBox(toolbox);

});



var down = document.getElementById('down');

// Add a click event listener to the button
down.addEventListener('click', function() {
    // Display an alert when the button is clicked
    map.lookDown();
    var elements = document.getElementsByClassName('cesium-viewer-toolbar');

    // Loop through each element and hide it
    for (var i = 0; i < elements.length; i++) {
        elements[i].style.display = 'none';
    }
});

var front = document.getElementById('front');

// Add a click event listener to the button
front.addEventListener('click', function() {
    // Display an alert when the button is clicked
    map.lookFront();
});

var right = document.getElementById('right');

// Add a click event listener to the button
right.addEventListener('click', function() {
    // Display an alert when the button is clicked
    map.lookRight();
});

var up = document.getElementById('up');

// Add a click event listener to the button
up.addEventListener('click', function() {
    // Display an alert when the button is clicked
    map.lookUp();
});






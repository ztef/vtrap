// Importa un Controlador y un Factory de Mapas
// Agrega un WindowFormater
import { vi_WindowFormater, vi_MapFactory, vi_Controller} from '../viOne/all.js';

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

// Carga el mapa en su contenedor
map.loadMap('mapContainer');



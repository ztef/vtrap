// Importa un Controlador y un Factory de Mapas
import { vi_MapFactory, vi_Controller} from '../viOne/all.js';

// Crea un Controlador
const controller = new vi_Controller();

// Crea un Factory de Mapas
const mapFactory = new vi_MapFactory();

// Crea un mapa 
const map = mapFactory.createMap("Cesium", controller);

// Carga el mapa en su contenedor
map.loadMap('mapContainer');



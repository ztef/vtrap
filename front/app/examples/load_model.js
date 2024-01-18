import { vi_3DSceneRenderer, vi_WindowFormater, vi_ObjectModel, vi_RemoteListenerFactory, vi_ObjectGridView, vi_Controller, vi_DataSource} from '../viOne/all.js';
 
const windowFormater = new vi_WindowFormater();

windowFormater.formatWindow("#almacen","Detalles",500,350);
windowFormater.positionDiv("almacen",70,60);  

const almacen3D = new vi_3DSceneRenderer('almacen',null,[]);
//almacen3D.loadGLTFModelc('./assets/lacomerx.glb');
almacen3D.loadGLTFModelc('./assets/lacomerx.glb');






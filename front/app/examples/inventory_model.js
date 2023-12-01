import { vi_3DSceneRenderer, vi_WindowFormater, vi_ObjectModel, vi_RemoteListenerFactory, vi_ObjectGridView, vi_Controller, vi_DataSource} from '../viOne/all.js';
 
const windowFormater = new vi_WindowFormater();

windowFormater.formatWindow("#almacenes","Detalles",500,350);
windowFormater.positionDiv("almacenes",70,60);  

const almacenes3D = new vi_3DSceneRenderer('almacenes');
almacenes3D.loadOBJModel('./assets/sundek_inventory.obj','./assets/sundek_inventory.mtl',1);

 



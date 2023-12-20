import { vi_geometry_factory, vi_3DSceneRenderer, vi_WindowFormater, vi_ObjectModel, vi_RemoteListenerFactory, vi_ObjectGridView, vi_Controller, vi_DataSource} from '../viOne/all.js';
 
const windowFormater = new vi_WindowFormater();

windowFormater.formatWindow("#ventana","Detalles",500,350);
 
const renderer = new vi_3DSceneRenderer('ventana');


var gf = new vi_geometry_factory();
var g1 = gf.createGeometry('Sphere',[10,10,10]);



var m1 = gf.createObject(g1,{x:0,y:0,z:0}, { color: 0x00ff00 });
var o1 = gf.createVisualObject(m1,"ID1")

var m2 = gf.createObject(g1,{x:100,y:100,z:100}, { color: 0xff0000 });
var o2 = gf.createVisualObject(m2,"ID2")


renderer.addGeometry(o1);
renderer.addGeometry(o2);

renderer.createWireframedPlane(100, 10);


renderer.focus(0,0,0,100);





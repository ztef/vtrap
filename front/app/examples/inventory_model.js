import { vi_3DSceneRenderer, vi_WindowFormater, vi_ObjectModel, vi_RemoteListenerFactory, vi_ObjectGridView, vi_Controller, vi_DataSource} from '../viOne/all.js';
import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm";

const windowFormater = new vi_WindowFormater();

windowFormater.formatWindow("#almacenes","Detalles",500,350);
windowFormater.positionDiv("almacenes",70,60);  

windowFormater.formatWindow("#d3","D3",500,350);
windowFormater.positionDiv("d3",70,60);  


const almacenes3D = new vi_3DSceneRenderer('almacenes',null,[]);
almacenes3D.loadOBJModel('./assets/simulator.obj','./assets/simulator.mtl',1);

 
// Create D3.js data
const data = [10, 20, 30, 40, 50];

// Create bars using D3.js and add to Three.js scene
const svg = d3.select("#d3")
    .append("svg")
    .attr("width", 800)
    .attr("height", 800);

    svg.style("background-color", "lightgreen");



const bars = svg.selectAll("rect")
    .data(data)
    .enter()
    .append("rect")
    .attr("x", (d, i) => i * 100)
    .attr("y", d => 600 - d * 5)
    .attr("width", 50)
    .attr("height", d => d * 5)
    .style("fill", "steelblue");

    
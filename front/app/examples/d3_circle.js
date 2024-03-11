import { vi_3DSceneRenderer, vi_WindowFormater, vi_ObjectModel, vi_RemoteListenerFactory, vi_ObjectGridView, vi_Controller, vi_DataSource} from '../viOne/all.js';
import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm";
import { vi_toolbox } from '../viOne/view/vi_toolbox.js';
import { vi_HiperLine } from '../viOne/view/vi_hiperline.js';
import { vi_geometry_factory } from '../viOne/view/vi_geometry_factory.js';

const windowFormater = new vi_WindowFormater();

 

windowFormater.formatWindow("#d3","D3",400,350);
windowFormater.positionDiv("d3",70,60);  



//D3


var div = document.getElementById("d3");

    
    
const data = {
  "name":"flare","children":[
    {"name":"DALLAS WH",
        children:[
          {"name":"OXIDES", value:100},
          {"name":"POLYCOAT", value:100}
        ]
    },
    {"name":"HOUSTON WH",value:100,children:[
      {"name":"OXIDES", value:100},
      {"name":"POLYCOAT", children:[
        {"name":"Polycoat 1", value:100},
        {"name":"Polycoat 2", value:100}
      ]}
    ]},
    {"name":"tres", value:100}]
 }

function  _onMouseOver(name){
  console.log("CALLBACK",name);
}

function  _onClick(name){
  console.log("CALLBACK",name);
}

// Configuration variables
const marginTop = 50;
const marginRight = 10;
const marginBottom = 10;
const marginLeft = 60;

const svgStyle = "max-width: 100%; height: auto; user-select: none;";
const dx = 40; // Assuming dx is predefined
const circle_radius = 10;
const _color_node = "#555";

var width = div.clientWidth;
var height = div.clientHeight;

const font = "15px sans-serif";
const _color_back = 0x000000;
const _color_leaf = "#999";
 

// Create the color scale.
const color = d3.scaleLinear()
    .domain([0, 5])
    .range(["hsl(152,80%,80%)", "hsl(228,30%,40%)"])
    .interpolate(d3.interpolateHcl);

// Compute the layout.
const pack = data => d3.pack()
    .size([width, height])
    .padding(30)
  (d3.hierarchy(data)
    .sum(d => d.value)
    .sort((a, b) => b.value - a.value));
const root = pack(data);

// Create the SVG container.
const svg = d3.create("svg")
    .attr("viewBox", `-${width / 2} -${height / 2} ${width} ${height}`)
    .attr("width", width)
    .attr("height", height)
    .attr("style", `max-width: 100%; height: auto; display: block; margin: 0 -14px; background: ${_color_back}; cursor: pointer;`);

// Append the nodes.
const node = svg.append("g")
  .selectAll("circle")
  .data(root.descendants().slice(1))
  .join("circle")
    .attr("fill", d => d.children ? color(d.depth) : _color_leaf)
    .attr("stroke", "black") // Add stroke color here
    .attr("stroke-width", 1) // Adjust stroke width as needed
    .attr("pointer-events", d => !d.children ? "all" : null)
    .on("mouseover", function (event,d) { 
        d3.select(this).attr("stroke", "red");
        _onMouseOver(d.data.name);
     })
    .on("mouseout", function() { d3.select(this).attr("stroke", "black"); })
    .on("click", (event, d) => {
      if (!d.children) {
        // Handle click on leaf node (e.g., display information, without zooming out)
        console.log("Clicked on a leaf node:", d.data.name);
        _onClick(d.data.name);
        event.stopPropagation(); 
      } else {
        console.log("CLICK",d );
        // Handle click on non-leaf node (e.g., zoom in/out behavior)
        focus !== d && (zoom(event, d), event.stopPropagation());
      }

      
    });

// Append the text labels.
const label = svg.append("g")
    .style("font", font)
    .attr("pointer-events", "none")
    .attr("text-anchor", "middle")
  .selectAll("text")
  .data(root.descendants())
  .join("text")
    .style("fill-opacity", d => d.parent === root ? 1 : 0)
    .style("display", d => d.parent === root ? "inline" : "none")
    .text(d => d.data.name);

// Create the zoom behavior and zoom immediately in to the initial focus node.
svg.on("click", (event) => zoom(event, root));
let focus = root;
let view;
zoomTo([focus.x, focus.y, focus.r * 2]);

function zoomTo(v) {
  const k = width / v[2];

  view = v;

  label.attr("transform", d => `translate(${(d.x - v[0]) * k},${(d.y - v[1]) * k})`);
  node.attr("transform", d => `translate(${(d.x - v[0]) * k},${(d.y - v[1]) * k})`);
  node.attr("r", d => d.r * k);
}

function zoom(event, d) {

  

  const focus0 = focus;

  focus = d;

  const transition = svg.transition()
      .duration(event.altKey ? 7500 : 750)
      .tween("zoom", d => {
        const i = d3.interpolateZoom(view, [focus.x, focus.y, focus.r * 2]);
        return t => zoomTo(i(t));
      });

  label
    .filter(function(d) { return d.parent === focus || this.style.display === "inline"; })
    .transition(transition)
      .style("fill-opacity", d => d.parent === focus ? 1 : 0)
      .on("start", function(d) { if (d.parent === focus) this.style.display = "inline"; })
      .on("end", function(d) { if (d.parent !== focus) this.style.display = "none"; });
}

 

  div.appendChild(svg.node());
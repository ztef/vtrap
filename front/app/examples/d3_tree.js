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
  "name":"flare","children":[{"name":"uno",children:[{"name":"dos"},{"name":"tres"}]},{"name":"dos"},{"name":"tres"}]
 }


var width = div.clientWidth;
var height = div.clientHeight;

// Configuration variables
const marginTop = 50;
const marginRight = 10;
const marginBottom = 10;
const marginLeft = 60;
const font = "15px sans-serif";
const svgStyle = "max-width: 100%; height: auto; user-select: none;";
const dx = 40; // Assuming dx is predefined
const circle_radius = 10;
const _color_node = "#555";
const _color_leaf = "#999";
 



  const root = d3.hierarchy(data);
  
  //const dy = (width - marginRight - marginLeft) / (1 + root.height);
  const dy = 100;
  
  // Define the tree layout and the shape for links.
  const tree = d3.tree().nodeSize([dx, dy]);
  const diagonal = d3.linkHorizontal().x(d => d.y).y(d => d.x);

  // Create the SVG container, a layer for the links and a layer for the nodes.
  const svg = d3.create("svg")
      .attr("width", width)
      .attr("height", height)
      .attr("viewBox", [-marginLeft, -marginTop, width, dx])
      .attr("style", `font: ${font}; ${svgStyle}`);

  const gLink = svg.append("g")
      .attr("fill", "none")
      .attr("stroke", "#555")
      .attr("stroke-opacity", 0.4)
      .attr("stroke-width", 1.5);

  const gNode = svg.append("g")
      .attr("cursor", "pointer")
      .attr("pointer-events", "all");

  function update(event, source) {
      const duration = event?.altKey ? 2500 : 250; // hold the alt key to slow down the transition
      const nodes = root.descendants().reverse();
      const links = root.links();
  
      // Compute the new tree layout.
      tree(root);

      let left = root;
      let right = root;
      root.eachBefore(node => {
        if (node.x < left.x) left = node;
        if (node.x > right.x) right = node;
      });
  
     const height = right.x - left.x + marginTop + marginBottom;
     
      const transition = svg.transition()
          .duration(duration)
          .attr("height", height)
          .attr("viewBox", [-marginLeft, left.x - marginTop, width, height])
          .tween("resize", window.ResizeObserver ? null : () => () => svg.dispatch("toggle"));

      // Update the nodes…
      const node = gNode.selectAll("g")
        .data(nodes, d => d.id);

      // Enter any new nodes at the parent's previous position.
      const nodeEnter = node.enter().append("g")
          .attr("transform", d => `translate(${source.y0},${source.x0})`)
          .attr("fill-opacity", 0)
          .attr("stroke-opacity", 0)
          .on("click", (event, d) => {
            d.children = d.children ? null : d._children;
            update(event, d);
          });

      nodeEnter.append("circle")
          .attr("r", circle_radius)
          .attr("fill", d => d._children ? _color_node : _color_leaf)
          .attr("stroke-width", 10);

      nodeEnter.append("text")
          .attr("dy", "0.31em")
          .attr("x", d => d._children ? -(circle_radius + 2) : (circle_radius + 2))
          .attr("text-anchor", d => d._children ? "end" : "start")
          .text(d => d.data.name)
          .style("fill", "white");

      // Transition nodes to their new position.
      const nodeUpdate = node.merge(nodeEnter).transition(transition)
          .attr("transform", d => `translate(${d.y},${d.x})`)
          .attr("fill-opacity", 1)
          .attr("stroke-opacity", 1);

      // Transition exiting nodes to the parent's new position.
      const nodeExit = node.exit().transition(transition).remove()
          .attr("transform", d => `translate(${source.y},${source.x})`)
          .attr("fill-opacity", 0)
          .attr("stroke-opacity", 0);

      // Update the links…
      const link = gLink.selectAll("path")
        .data(links, d => d.target.id);

      // Enter any new links at the parent's previous position.
      const linkEnter = link.enter().append("path")
          .attr("d", d => {
            const o = {x: source.x0, y: source.y0};
            return diagonal({source: o, target: o});
          });

      // Transition links to their new position.
      link.merge(linkEnter).transition(transition)
          .attr("d", diagonal);
  
      // Transition exiting nodes to the parent's new position.
      link.exit().transition(transition).remove()
          .attr("d", d => {
            const o = {x: source.x, y: source.y};
            return diagonal({source: o, target: o});
          });

      // Stash the old positions for transition.
      root.eachBefore(d => {
        d.x0 = d.x;
        d.y0 = d.y;
      });
  }

// Do the first update to the initial configuration of the tree — where a number of nodes
// are open (arbitrarily selected as the root, plus nodes with 7 letters).

  root.x0 = dy / 2;
  root.y0 = 0;
  root.descendants().forEach((d, i) => {
    d.id = i;
    d._children = d.children;
    if (d.depth && d.data.name.length !== 7) d.children = null;
  });

  update(null, root);

  div.appendChild(svg.node());
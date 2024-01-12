
import { vi_geometry_factory } from './vi_geometry_factory.js';
import { vi_HiperLine } from './vi_hiperline.js';
import { vi_HiperCircle } from './vi_hipercircle.js';





class vi_Board {
  constructor(slot, render, origin, levels, type, angle, amplitude, graphics) {
    this.slot = slot;
    this.render_engine = render;
    this.origin = { ...origin };
    this.levels = levels || [];
    this.type = type || "";
    this.content = null;
    this.angle = angle;
    this.amplitude = amplitude;
    this.geometry_factory = new vi_geometry_factory();
    this.graphics = graphics;

    // Initialize the content based on the board type
    this.initializeContent();
  }

  initializeContent() {
    switch (this.type) {
      case "radial":
        this.content = new vi_HiperCircle(this.amplitude, this.angle, this.origin);
        this.content.setGraphics(this.graphics);
        this.content.setLevels(this.levels);
        break;
      case "linear":
          this.content = new vi_HiperLine(this.amplitude, this.angle, this.origin);
          this.content.setGraphics(this.graphics);
          this.content.setLevels(this.levels);
          break;
      default:
        console.error(`Unknown board type: ${this.type}`);
    }
  }


  arrayToDotNotation(arr) {
    if (!Array.isArray(arr) || arr.length === 0) {
      return '';
    }
  
    return arr.join('.');
  }

  generateCombinations(arr, callback, currentCombination = [], currentIndex = 0) {
    // Base case: if currentIndex reaches the end of the array
    if (currentIndex === arr.length) {


      let slot =  this.arrayToDotNotation(currentCombination);
      
      callback(slot);
      
      return;
    }
  
    // Iterate over possible values for the current position
    for (let i = 0; i < arr[currentIndex]; i++) {
      // Create a copy of the current combination to avoid modifying it for different recursive calls
      const newCombination = [...currentCombination];
      newCombination.push(i);
  
      // Recursively generate combinations for the next index
      this.generateCombinations(arr, callback, newCombination, currentIndex + 1);
    }
  }

  printCombination(combination) {
    console.log(combination);
  }


  traverse(callback){
    const inputArray = this.levels;
    this.generateCombinations(inputArray, callback);
  }



 drawCenter(){

   var pos =this.origin;
   var color = this.graphics.center.color;

   var g = this.geometry_factory.createGeometry('Circle',[this.graphics.center.amplitude,64]);
   var m = this.geometry_factory.createObject(g,{x:pos.x,y:pos.y,z:pos.z}, { color: color,transparent: this.graphics.center.transparent, opacity: this.graphics.center.opacity});
   var o = this.geometry_factory.createVisualObject(m,'hb');

   this.render_engine.addGeometry(o); 


 }


 getEndpoint(startX, startY, angleInRadians, length) {
  // Calculate the x and y components of the vector
  let deltaX = length * Math.cos(angleInRadians);
  let deltaY = length * Math.sin(angleInRadians);

  // Calculate the endpoint coordinates
  let endX = startX + deltaX;
  let endY = startY + deltaY;

  return { x: endX, y: endY, z:0 };
 }


 drawLine(){

  var pos =this.origin;
  var color = this.graphics.line.color;
  var endpoint = this.getEndpoint(pos.x,pos.y, this.angle, this.amplitude);


  this.render_engine.addLine({ x: pos.x, y:pos.y, z: 0 },endpoint);


}





  draw(){

   if(this.graphics){

        if(this.graphics.center){
                 this.drawCenter();
        }

        if(this.graphics.line){
          this.drawLine();
        }

        
   }


   let pos = {x:0,y:0,z:0};

   for(let level=0; level<this.levels.length; level++){


    var points = this.content.getSegments(level);
    points.forEach((point)=>{

      

              pos.x = point.x;
              pos.y = point.y;
              pos.z = 0;

              let color = 0xff0000;

              var g = this.geometry_factory.createGeometry('Circle',[1,16]);
              var m = this.geometry_factory.createObject(g,{x:pos.x,y:pos.y,z:pos.z}, { color: color,transparent: false, opacity: 0.5 });
              var o = this.geometry_factory.createVisualObject(m,'hbp');

              this.render_engine.addGeometry(o); 

    });



   }


  }


}




export class vi_HiperBoard {
  constructor(render) {
    this.render_engine = render;
    this.boardContainer = new Map();
    this.geometry_factory = new vi_geometry_factory();
    this.depth = 0;  // numero de niveles de profundidad del arbol
    this.mask = '';  // mascara de sub boards
    this.treeDepth = 1;  // profundidad del arbol
    this.maxTreeDepth = 0;
  }

  addBoard(conf, slot) {
    const { type, origin, levels, content, angle, amplitude, graphics } = conf.board;

    

    if(!slot){
      slot = 'root';
    }

    if(this.depth < levels.length){
      this.depth = levels.length; 
        
    }

    if(this.treeDepth > this.maxTreeDepth){
      this.maxTreeDepth = this.treeDepth;
      this.mask = this.mask + '.' + levels.length;

    }

    

    const newBoard = new vi_Board(slot, this.render_engine, origin, levels, type, angle, amplitude, graphics);
    this.boardContainer.set(slot, newBoard);

   

    if(content.board){ // si hay board dentro del board

     

      newBoard.traverse((path)=>{
        
        let p = newBoard.content.locatePointByPath(path);
        let a = newBoard.content.getAngleForPoint(p);
        console.log(path,p,a);

        content.board.origin = p;
        content.board.angle = a;

        this.treeDepth = this.treeDepth + 1;
        this.addBoard(content,slot+'.'+path); 
        this.treeDepth = this.treeDepth - 1;        


      });

    } else {

     

    }

    return true;
  }


  draw(){


   this.boardContainer.forEach((board,slot)=>{

        board.draw();

   })
    

  }


  getBoards() {
    return this.boardContainer;
  }


  /*
  convertStringToArray(inputString) {
    // Split the input string using the dot as a separator
    let stringArray = inputString.split('.');

    // Convert each element of the array to a number
    let numberArray = stringArray.map(Number);

  return numberArray;
}

 multiplyArrayValues(numbersArray) {
  if (numbersArray.length === 0) {
      // Handle the case where the array is empty
      return 0;
  }

  // Use the reduce function to calculate the product
  let product = numbersArray.reduce((accumulator, currentValue) => accumulator * currentValue);

  return product;
 }

 removeFirstNNumbers(path, n) {
  // Split the input path using commas as separators
  let pathArray = path.split('.');

  // Remove the first n elements from the array
  let newPathArray = pathArray.slice(n);

  // Join the remaining elements to form the new path
  let newPath = newPathArray.join('.');

  return newPath;
}

getFirstElementAsNumber(path) {
  // Split the input path using commas as separators
  let pathArray = path.split(',');

  // Get the first element and convert it to a number
  let firstElement = parseFloat(pathArray[0]);

  return firstElement;
}

removeFirstAndAddOne(inputArray) {
  // Check if the input array is not empty
  if (inputArray.length > 0) {
      // Use slice to remove the first element
      inputArray = inputArray.slice(1);
  }

  // Add 1 to the end of the array
  inputArray.push(1);

  return inputArray;
}





convertToDecimalFromArray(customNumberArray, _ranges) {
  
  const ranges = this.removeFirstAndAddOne( _ranges);
  const base = ranges.length;


  // Calculate the decimal value
  let decimalValue = 0;

  for (let i = 0; i < customNumberArray.length; i++) {
      decimalValue += customNumberArray[i] * Math.pow(ranges[i], customNumberArray.length - i - 1);
  }

  return decimalValue;
}

 getFirstNElements(inputArray, n) {
  return inputArray.slice(0, n);
 }

  locateBoardByPath(bp){

     let board = bp.board;
     let path = bp.path;


      let p = this.convertStringToArray(path);

      if (p.length > this.boardContainer[board].levels.length){
         
          
        let nextPath = this.removeFirstNNumbers(path,this.boardContainer[board].levels.length);

        let nextBoard = this.convertToDecimalFromArray(this.getFirstNElements(p,this.boardContainer[board].levels.length ),this.boardContainer[board].levels)+1;
          

          bp = this.locateBoardByPath({board:nextBoard,path:nextPath})       // Llamada recursiva
        }
      
      return bp;

  }

  */

  splitPath(path, n) {
    // Split the path into sections using commas
    const sections = path.split('.');

    // Extract the first n sections as boardPath
    const bP = sections.slice(0, n).join('.');

    // Extract the rest of the sections as nodePath
    const nP = sections.slice(n).join('.');

    
    return { bP, nP };
 }


 countPathElements(path) {
  // Split the path into sections using dots
  const sections = path.split('.');

  // Count the number of elements
  const numberOfElements = sections.length;

  return numberOfElements;
 }

 checkMask(mask, n) {


      let match = false;
      let exceso = 0;


      // Split the mask into sections using dots
      const sections = mask.split('.');

      // Remove the leading empty section resulting from a leading dot in the mask
      sections.shift();

      // Check if n matches any of the conditions
      let currentSum = 0;
      for (let i = 0; i < sections.length; i++) {
          const currentNumber = parseInt(sections[i]);
          currentSum += currentNumber;

          if (n === currentSum) {
              match = true;
              return({match:true,section:i, exceso:0});
          }

          if(n < currentSum){
              exceso = currentSum - n;
              return({match:false, section:i, exceso:exceso});
          }


      }

      return {match:false,section:0, exceeds:0};
  }


  extractSubpaths(mask, path) {
    // Split the mask into sections using dots
    const maskSections = mask.split('.');

    // Remove the leading empty section resulting from a leading dot in the mask
    maskSections.shift();

    // Split the path into sections using commas
    const pathSections = path.split('.');

    // Initialize variables
    let currentIndex = 0;
    const subpaths = [];

    // Iterate over mask sections to form subpaths
    for (let i = 0; i < maskSections.length; i++) {
        const sectionLength = parseInt(maskSections[i]);
        
        // Extract subpath from the current index to the specified length
        const subpath = pathSections.slice(currentIndex, currentIndex + sectionLength).join('.');

        // Add the subpath to the result array
        subpaths.push(subpath);

        // Update the current index for the next iteration
        currentIndex += sectionLength;
    }

    return subpaths;
}

mask2array(mask){
  const maskSections = mask.split('.');

  // Remove the leading empty section resulting from a leading dot in the mask
  maskSections.shift();
  return maskSections;

}



removeExternalDots(inputString) {
  // Use a regular expression to remove leading and trailing dots
  const resultString = inputString.replace(/^\.+|\.+$/g, '');

  return resultString;
}

removeLastElement(mask) {
  // Split the mask into sections using dots
  const maskSections = mask.split('.');

  // Remove the last element
  maskSections.pop();

  // Join the sections back into a string
  const updatedMask = maskSections.join('.')+'.9';

  return updatedMask;
}


getPosition(absolutepath){

  let boardPath = '';
  let nodePath = '';
  let mask = this.removeLastElement(this.mask) 



  let subpaths = this.extractSubpaths(mask, absolutepath);
  
  let masklevels = this.mask2array(mask); 

  for(let i=0; i<masklevels.length; i ++){
     if (this.countPathElements(subpaths[i]) == masklevels[i]){
        boardPath = boardPath + '.' + subpaths[i];
     } else {
        nodePath = nodePath +  subpaths[i];
     }
  }
 

  boardPath = this.removeExternalDots(boardPath);
  nodePath = this.removeExternalDots(nodePath);


  
  if(boardPath != ''){
    boardPath = '.' + boardPath;
  }
  


  let root = this.boardContainer.get('root'+boardPath);
  let point = root.content.locatePointByPath(nodePath);
  let angle = root.content.angle;



 return {board:root, point:point, angle:angle};

}


  setLabel(absolutepath,label){


    let {board, point, angle} = this.getPosition(absolutepath, label);


    angle = angle + Math.PI /2;

    let pos = {x:0, y:0, z:0};

    pos.x = point.x;
    pos.y = point.y;
    pos.z = 0;


    let color = 0x00ff00;

    var g = this.geometry_factory.createGeometry('Circle',[1,16]);
    var m = this.geometry_factory.createObject(g,{x:pos.x,y:pos.y,z:pos.z}, { color: color,transparent: false, opacity: 0.5 });
    var o = this.geometry_factory.createVisualObject(m,'hbp');

    this.render_engine.addGeometry(o); 


    color = 0x00ff00;

   
    pos.y = pos.y - 8;
    

    let rotate = {x:0, y:0, z:angle};

    this.render_engine.addLabel(label,pos,rotate,{size:1, height:0.3});
    
   

  }


}





  




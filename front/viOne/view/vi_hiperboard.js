

class vi_mainCircle {

  constructor(radius, initialAngle = 0, origin = { x: 0, y: 0 }) {
    this.radius = Math.max(0, radius);
    this.initialAngle = initialAngle;
    
    this.origin = { ...origin };
  }

  divideCircle(totalMarkers) {
    const points = [];

    for (let i = 0; i < totalMarkers; i++) {
      const angle = (2 * Math.PI * i) / totalMarkers + this.initialAngle;
      const x = this.origin.x + this.radius * Math.cos(angle);
      const y = this.origin.y + this.radius * Math.sin(angle);
      points.push({ x, y });
    }

    return points;
  }

  getMarkerCoordinates(markerNumber, totalMarkers) {
    if (markerNumber < 0 || markerNumber >= totalMarkers) {
      console.error("Invalid marker number");
      return null;
    }

    const angle = (2 * Math.PI * markerNumber) / totalMarkers + this.initialAngle;
    const x = this.origin.x + this.radius * Math.cos(angle);
    const y = this.origin.y + this.radius * Math.sin(angle);

    return { x, y };
  }

  getAngleForMarker(markerNumber, totalMarkers) {
    if (markerNumber < 0 || markerNumber >= totalMarkers) {
      console.error("Invalid marker number");
      return null;
    }

    return (2 * Math.PI * markerNumber) / totalMarkers + this.initialAngle;
  }


  calculatePointsBetweenMarkers(markerNumber, m, totalMarkers) {
    const startAngle = this.getAngleForMarker(markerNumber, totalMarkers);
    const endAngle = this.getAngleForMarker((markerNumber + 1) % totalMarkers, totalMarkers);

    const stepSize = (endAngle - startAngle) / m;

    const points = [];
    for (let i = 0; i < m; i++) {
      const angle = startAngle + i * stepSize;
      const x = this.origin.x + this.radius * Math.cos(angle);
      const y = this.origin.y + this.radius * Math.sin(angle);
      points.push({ x, y });
    }

    return points;
}




}

export class vi_HiperCircle {


  constructor(centralCircleRadius, initialAngle = 0, origin = { x: 0, y: 0 }) {
    this.centralCircle = new vi_mainCircle(centralCircleRadius, initialAngle, origin);
    this.totalMarkers = 0;
    this.levels = [];
    this.globalMap = new Map();
    
  }


  setLevels(levels) {
    this.levels = levels;
    this.calculateTotalMarkers();
    for (let i = 0; i < levels.length; i++) {
      this.globalMap.set(i, this.calculatePointsForLevel(i));
    }
   
  }


  calculateTotalMarkers() {
    this.totalMarkers = this.levels.reduce((total, level) => total * level, 1);
  }

  getAngleForMarker(markerNumber) {
    return this.centralCircle.getAngleForMarker(markerNumber, this.totalMarkers);
  }

  divideCentralCircle() {
    if (this.totalMarkers === 0) {
      console.error("Total markers not set. Use setTotalMarkers method.");
      return null;
    }

    return this.centralCircle.divideCircle(this.totalMarkers);
  }

  getCoordinatesOfMarker(markerNumber) {
    if (this.totalMarkers === 0) {
      console.error("Total markers not set. Use setTotalMarkers method.");
      return null;
    }

    return this.centralCircle.getMarkerCoordinates(markerNumber, this.totalMarkers);
  }

  setTotalMarkers(totalMarkers) {
    this.totalMarkers = totalMarkers;
  }

  calculatePointsBetweenMarkers(markerNumber, m) {
    if (this.totalMarkers === 0) {
      console.error("Total markers not set. Use setTotalMarkers method.");
      return null;
    }

    return this.centralCircle.calculatePointsBetweenMarkers(markerNumber, m, this.totalMarkers);
  }


  getSegments(level){

    return this.globalMap.get(level);
  }



  calculatePointsForLevel(level){ 

    var totalMarkersInLevel = 1;
    for(var i=0; i<=level; i++){
      totalMarkersInLevel = totalMarkersInLevel * this.levels[i];
    }

    return this.centralCircle.divideCircle(totalMarkersInLevel);
  }


  calculateLinesForLevel(level,lineLength){ 

    var totalMarkersInLevel = 1;
    for(var i=0; i<=level; i++){
      totalMarkersInLevel = totalMarkersInLevel * this.levels[i];
    }

    var lines = [];

    var puntos = this.centralCircle.divideCircle(totalMarkersInLevel);
 
    puntos.forEach((p)=>{

      const directionVector = {
        x: p.x - this.centralCircle.origin.x,
        y: p.y - this.centralCircle.origin.y
      };

      // Normalize the direction vector
      const length = Math.sqrt(directionVector.x ** 2 + directionVector.y ** 2);
      const normalizedVector = {
        x: directionVector.x / length,
        y: directionVector.y / length
      };

      // Calculate the endpoint coordinates based on the lineLength
      const endpoint = {
        x: this.centralCircle.origin.x + normalizedVector.x * lineLength,
        y: this.centralCircle.origin.y + normalizedVector.y * lineLength
      };

      // Use the provided callback function for drawing/rendering
      lines.push({
        start: { x: this.centralCircle.origin.x, y: this.centralCircle.origin.y },
        end: { x: endpoint.x, y: endpoint.y }
      });


     

    });
 
 
    return lines;
 
  }

 

  getCoordinatesForLevelAndMarker(level, markerNumber) {
    if (level < 0 || level >= this.levels.length) {
      console.error("Invalid level");
      return null;
    }
  
    const totalMarkersInLevel = this.levels[level];
  
    if (markerNumber < 0 || markerNumber >= totalMarkersInLevel) {
      console.error("Invalid marker number for the specified level");
      return null;
    }
  
    const markersInPreviousLevels = this.calculateMarkersInPreviousLevels(level);
    const markerIndex = markersInPreviousLevels + markerNumber;
  

    const upTo = this.calculateMarkersUpToLevel(level); 
    const points = this.centralCircle.divideCircle(upTo);
  
    return points[markerIndex % upTo];
  
  }


  
  calculateMarkersInPreviousLevels(level) {
    return this.levels.slice(0, level + 1).reduce((sum, current) => sum + current, 0) - this.levels[level];
  }
  
  calculateMarkersUpToLevel(level) {
    return this.levels.slice(0, level + 1).reduce((sum, current) => sum + current, 0) ;
  }
  
  
  
  

  getLineCoordinatesForLevelAndMarker(level, markerNumber) {
    const markerCoordinates = this.getCoordinatesForLevelAndMarker(level, markerNumber);

    if (!markerCoordinates) {
      return null;
    }

    // Return the coordinates for the line from the origin to the marker
    return [
      { x: this.centralCircle.origin.x, y: this.centralCircle.origin.y },
      { x: markerCoordinates.x, y: markerCoordinates.y }
    ];
  }

  getCoordinatesForAbsoluteMarker(absoluteMarkerNumber) {
    if (absoluteMarkerNumber < 0 || absoluteMarkerNumber >= this.totalMarkers) {
      console.error("Invalid absolute marker number");
      return null;
    }
  
    const points = this.centralCircle.divideCircle(this.totalMarkers);
    return points[absoluteMarkerNumber];
  }


  drawLinesForLevel(level, lineLength, drawCallback) {
    const totalMInLevel = this.calculateTotalMarkersInLevel(level);

   

    for (let _level = 0; _level <= level; _level++) {


      let mNumber = this.levels[_level];

      for(let m = 0; m < mNumber; m++){

      
         console.log("level:", _level, " m:", m);

          const markerCoordinates = this.getCoordinatesForLevelAndMarker(_level, m);


          if(!markerCoordinates){
            console.log('error');
          }
            

          // Calculate the direction vector from the origin to the marker
          const directionVector = {
            x: markerCoordinates.x - this.centralCircle.origin.x,
            y: markerCoordinates.y - this.centralCircle.origin.y
          };

          // Normalize the direction vector
          const length = Math.sqrt(directionVector.x ** 2 + directionVector.y ** 2);
          const normalizedVector = {
            x: directionVector.x / length,
            y: directionVector.y / length
          };

          // Calculate the endpoint coordinates based on the lineLength
          const endpoint = {
            x: this.centralCircle.origin.x + normalizedVector.x * lineLength,
            y: this.centralCircle.origin.y + normalizedVector.y * lineLength
          };

          // Use the provided callback function for drawing/rendering
          drawCallback({
            start: { x: this.centralCircle.origin.x, y: this.centralCircle.origin.y },
            end: { x: endpoint.x, y: endpoint.y }
          });

        }
    }

    
  }


  calculateAbsoluteMarkerNumber(level, markerNumber) {
    let totalMarkersBeforeLevel = 0;
    for (let i = 0; i < level; i++) {
      totalMarkersBeforeLevel += this.calculateTotalMarkersInLevel(i);
    }
    return totalMarkersBeforeLevel + markerNumber;
  }



  calculateTotalMarkersInLevel(level) {
    let totalMarkersInLevel = 1;
    for (let i = 0; i <= level; i++) {
      totalMarkersInLevel *= this.levels[i];
    }
    return totalMarkersInLevel;
  }


  locatePointByPath(path) {
    const pathSegments = path.split('.').map(Number);

    if (!pathSegments.every(Number.isInteger)) {
      console.error('Invalid path. Each segment in the path must be a number.');
      return null;
    }


    // acumula el valor de cada nievel como si fueran centenas, decenas, unidades

    var levelvalues = [];
    for(let i=0; i < this.levels.length; i ++)
    {
      let v = 1;
      for(let j=i+1; j < this.levels.length; j ++){
          v = v * this.levels[j]; 
      }

      levelvalues.push(v);
    }


    // calculate the absolute index :

    var index = 0;
    for(let i=0; i< pathSegments.length-1; i++){
      index = index + pathSegments[i] * levelvalues[i];
    }

    index = index + pathSegments[pathSegments.length-1];

    let currentPoints = this.globalMap.get(pathSegments.length-1);
    

    return currentPoints[index];
  }





}

class Segment {
  constructor(basePoint, length, angle) {
    this.basePoint = { ...basePoint };
    this.length = length;
    this.angle = angle;
  }

 

  generatePoints(numPoints) {
    const points = [];

    for (let i = 0; i < numPoints; i++) {
      const t = (2 * i + 1) / (2 * numPoints); // Calculate the middle point within each subdivision
      const x = this.basePoint.x + this.length * Math.cos(this.angle) * t;
      const y = this.basePoint.y + this.length * Math.sin(this.angle) * t;
      const z = this.basePoint.z; // Assuming z-coordinate remains constant for simplicity
      points.push({ x, y, z });
    }

    return points;
  }

  
}


export class vi_HiperLine {
  constructor(origin, angle, length) {
    this.origin = { ...origin };
    this.angle = angle || 0;
    this.length = length || 0;
    this.separation = 5;
    this.globalMap = new Map();
  }

  

  setLength(length) {
    this.length = Math.max(0, length);
  }


  setLevels(levels) {
    this.levels = levels || [];
    // Calculate and store points for each level in the global map
    for (let i = 0; i < levels.length; i++) {
      this.globalMap.set(i, this.calcSegments(i));
    }
  }


  getSegments(level){

    return this.globalMap.get(level);
  }

  calcSegments(level){

    const basePoint = this.origin;
    const length = this.length;
    const angle = this.angle;
    var acumPoints = [];

    const segment = new Segment(basePoint, length, angle);  // convierte la linea en un segmento


    var startLevel = 0;

    const divideRecursive = (currentLevel, segment) => {
      if (currentLevel <= level) {

        var points = segment.generatePoints(this.levels[currentLevel]); 


        let delta = segment.length / points.length;
        points.forEach((p)=>{
    

          //p.y = p.y + level * this.separation;


          const separationX = level * this.separation * Math.sin(this.angle);
          const separationY = level * this.separation * Math.cos(this.angle);

          p.x -= separationX;
          p.y += separationY;





          if(currentLevel == level){
              acumPoints.push(p);
          }

          var seg = new Segment(p, delta, angle );
    
          divideRecursive(currentLevel + 1, seg);
    
        })

      }
    };

    divideRecursive(startLevel, segment);


    return acumPoints;


  }



  locatePointByPath(path) {
    const pathSegments = path.split('.').map(Number);

    if (!pathSegments.every(Number.isInteger)) {
      console.error('Invalid path. Each segment in the path must be a number.');
      return null;
    }


    // acumula el valor de cada nievel como si fueran centenas, decenas, unidades

    var levelvalues = [];
    for(let i=0; i < this.levels.length; i ++)
    {
      let v = 1;
      for(let j=i+1; j < this.levels.length; j ++){
          v = v * this.levels[j]; 
      }

      levelvalues.push(v);
    }


    // calculate the absolute index :

    var index = 0;
    for(let i=0; i< pathSegments.length-1; i++){
      index = index + pathSegments[i] * levelvalues[i];
    }

    index = index + pathSegments[pathSegments.length-1];

    let currentPoints = this.globalMap.get(pathSegments.length-1);
    

    return currentPoints[index];
  }
  
  
}



class vi_hiperBoard {
  constructor() {
    this.boardContainer = [];
  }

  addBoard(board) {
    if (board instanceof vi_HiperBoard) {
      this.boardContainer.push(board);
      return true;
    } else {
      console.error('Invalid board. Must be an instance of vi_HiperBoard.');
      return false;
    }
  }

  getBoards() {
    return this.boardContainer;
  }
}

class vi_HiperBoard {
  constructor(origin) {
    this.origin = { ...origin }; // Copy the origin object to avoid external modification
    // You can initialize other properties or setup here for the individual board
  }
  // You can add methods and other properties as needed for the individual board
}

// Example usage:

const boardContainer = new vi_hiperBoard();

const board1 = new vi_HiperBoard({ x: 0, y: 0, z: 0 });
const board2 = new vi_HiperBoard({ x: 10, y: 5, z: 0 });

boardContainer.addBoard(board1);
boardContainer.addBoard(board2);

const boards = boardContainer.getBoards();
console.log(boards);


  




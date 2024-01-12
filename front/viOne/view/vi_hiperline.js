class vi_Segment {
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
    constructor(length, angle,origin ) {
      this.origin = { ...origin };
      this.angle = angle;
      this.length = length || 0;
      this.separation = 5;
      this.globalMap = new Map();
      this.graphics = null;
      this.render = null;
    }
  
    

    setRenderEngine(re,gf){
        this.render = re;
        this.geometry_factory = gf;
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
  
    setGraphics(graphics){
      this.graphics = graphics;
    }
  
  
    getSegments(level){
  
      return this.globalMap.get(level);
    }
  
    calcSegments(level){
  
      const basePoint = this.origin;
      const length = this.length;
      const angle = this.angle;
      var acumPoints = [];
  
      const segment = new vi_Segment(basePoint, length, angle);  // convierte la linea en un segmento
  
  
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
  
            var seg = new vi_Segment(p, delta, angle );
      
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
  
  
  
    getAngleForPoint(point){
  
      const angle =    Math.PI / 2 + this.angle;
  
     
      
      return angle;
  
    }



    getEndpoint(l) {
      
      var endX = this.origin.x + l * Math.cos(this.angle);
      var endY = this.origin.y + l * Math.sin(this.angle);
  
      
      return { x: endX, y: endY };
  }




    draw(level){
        
            var points = this.getSegments(level);

            
            let init = {...points[0]};
            let pos = {...points[0]};
            

            let color = 0xff0000;

            points.forEach((point)=>{

                pos.x = point.x;
                pos.y = point.y;
                pos.z = 0;

           

                var g = this.geometry_factory.createGeometry('Circle',[1,16]);
                var m = this.geometry_factory.createObject(g,{x:pos.x,y:pos.y,z:pos.z}, { color: color,transparent: false, opacity: 0.5 });
                var o = this.geometry_factory.createVisualObject(m,'hbp');

                this.render.addGeometry(o); 

            });


            if(level==0){

                let long = this.length + this.length / this.levels[0];
                this.render.addLine(init,this.getEndpoint(long));
            } else {
                
              this.render.addLine(init,pos);

            }
          }
    
    
  }
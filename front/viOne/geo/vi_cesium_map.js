/*

  VISUAL INTERACTION SYSTEMS

  MAPA Generico usando CESIUM


*/

import vi_Map from '/front/viOne/geo/vi_map.js'; 
 


class vi_CesiumMap extends vi_Map {

  constructor(controller) {
    

      super(controller);

      this.previousCameraAltitude = null; 
     
      
    }
  
    async loadMap(map_window) {

      await this.loadExternalFiles();
  
      this.MapLib = Cesium;
    
     
      Cesium.Ion.defaultAccessToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiIwODczNzBiYy0xOGZmLTQyOWEtYjdjNy00NmM1YzlhYWUzOWMiLCJpZCI6MTQ3MDQ0LCJpYXQiOjE2ODY4MDYxNjR9.8OgBzwtTc65BVPlZbo6MOozogPQMsnUtc4Hg9lBFLMQ';


            this.viewer = new Cesium.Viewer(map_window, {
                terrain: Cesium.Terrain.fromWorldTerrain(),
                pickEnabled: true,
                timeline: false,
            });
  
            this.viewer.camera.flyTo({
                destination: Cesium.Cartesian3.fromDegrees(
                -100.3152,
                25.6520,
                5000
                ),
                orientation: {
                heading: Cesium.Math.toRadians(0.0),
                pitch: Cesium.Math.toRadians(-15.0),
                },
            });

            this.viewer.camera.moveEnd.addEventListener(this.handleCameraMove.bind(this));
  
  
            // Add Cesium OSM Buildings, a global 3D buildings layer.
            const buildingTileset = await Cesium.createOsmBuildingsAsync();
            this.viewer.scene.primitives.add(buildingTileset);

           

            this.viewer.selectedEntityChanged.addEventListener((selectedEntity) => {
              if (Cesium.defined(selectedEntity)) {
                if (Cesium.defined(selectedEntity.name)) {
                  const uniqueId = selectedEntity.name;
                  const objectData = this.objectEntities[uniqueId];
            
                  if (objectData) {
                    
                    this.controller.triggerObjectPicked(objectData);
                  }
                } else {
                  console.log('Unknown entity selected.');
                }
              } else {
                console.log('Deselected.');
              }
            });


            // Inicializa Reloj y Marker

            var start = Cesium.JulianDate.fromIso8601('2018-01-01T00:00:00.00Z');
            var mid = Cesium.JulianDate.addSeconds(start, 5, new Cesium.JulianDate());
            var stop = Cesium.JulianDate.addSeconds(start, 10, new Cesium.JulianDate());
            
            this.clock = this.viewer.clock;
            this.clock.startTime = start;
            this.clock.currentTime = start;
            this.clock.stopTime = stop;
            this.clock.clockRange = Cesium.ClockRange.LOOP_STOP;
            //this.clock.clockRange = Cesium.ClockRange.UNBOUNDED;
      
            this.clock.shouldAnimate = true;
      
            
            this.pulseProperty = new Cesium.SampledProperty(Number);
            this.pulseProperty.setInterpolationOptions({
                interpolationDegree : 3,
                interpolationAlgorithm : Cesium.HermitePolynomialApproximation
            });
            
            this.pulseProperty.addSample(start, 7.0);
            this.pulseProperty.addSample(mid, 1000.0);
            this.pulseProperty.addSample(stop, 7.0);




     
    }

    async loadExternalFiles() {
      // Define the URLs of the JavaScript and CSS files
      //const cesiumJsUrl =
     //   'http://cesium-dev.s3-website-us-east-1.amazonaws.com/cesium/worker-inline/Build';
     // const cesiumCssUrl =
     //   'http://cesium-dev.s3-website-us-east-1.amazonaws.com/cesium/worker-inline/Build/Cesium/Widgets/widgets.css';
  
      const cesiumJsUrl = '/front/viOne/js/Cesium/Cesium.js';

      const cesiumCssUrl = '/front/viOne/js/Cesium/Widgets/widgets.css';
  



      // Create a script element for the Cesium JavaScript
      const cesiumJsScript = document.createElement('script');
      cesiumJsScript.src = cesiumJsUrl;
  
      // Create a link element for the Cesium CSS
      const cesiumCssLink = document.createElement('link');
      cesiumCssLink.href = cesiumCssUrl;
      cesiumCssLink.rel = 'stylesheet';
  
      // Append the script and link elements to the head of the document
      document.head.appendChild(cesiumJsScript);
      document.head.appendChild(cesiumCssLink);
  
      // Return a promise that resolves when both files are loaded
      return Promise.all([
        new Promise((resolve) => {
          cesiumJsScript.onload = resolve;
        }),
        new Promise((resolve) => {
          cesiumCssLink.onload = resolve;
        }),
      ]);
    }
  
    

    handleCameraMove() {
      // Get the camera's altitude (distance from the ground)
      const cameraAltitude = this.viewer.camera.positionCartographic.height;
  
      // Define a threshold or delta value for significant change
      const threshold = 100; // Adjust this value as needed
  
      // Check if cameraAltitude has changed significantly
      if (this.previousCameraAltitude === null || Math.abs(cameraAltitude - this.previousCameraAltitude) >= threshold) {
          // Calculate a scaling factor based on the camera's altitude
          const scalingFactor = this.calculateScalingFactor(cameraAltitude);
  
          console.log("ALTITUD : ", cameraAltitude, "FACTOR : ", scalingFactor);
  
          // Update the scale of all cylinders
          this.updateObjectsScale(scalingFactor);
  
          // Update the previousCameraAltitude
          this.previousCameraAltitude = cameraAltitude;
      }
  }

    


    handleObjectSelectedOutside(event, payload) {
    
      // Check if the payload has the ID
      if (payload.id && this.objectEntities[payload.id]) {

        const objectEntity = this.objectEntities[payload.id];

        if(objectEntity){
          this.viewer.flyTo(objectEntity);
        }

       
      } else {
        console.log("Object Entity not found by ID:", payload.id);
      }
    }

   
    
   
    
    calculateScalingFactor(x) {
      const m = 9 / 9950; // Slope
      const b = 154 / 199; // Y-intercept
    
      const y = m * x + b;
      return y;
    }

    updateObjectsScale(scalingFactor) {

      /*

        console.log("ESCALANDO");
        // Iterate through all cylinder entities and update their scale
        for (const id in this.objectEntities) {
            if (this.objectEntities.hasOwnProperty(id)) {
                const objectEntity = this.objectEntities[id];

                // Update the cylinder's scale
                objectEntity.cylinder.length = 1000 * scalingFactor; // Adjust the length as needed
                objectEntity.cylinder.topRadius = 10 * scalingFactor; // Adjust the top radius as needed
                objectEntity.cylinder.bottomRadius = 10 * scalingFactor; // Adjust the bottom radius as needed
            }
        }

        */
    }
  
   
  

   
    addObject(event, newObject) {

    

            const entities = this.entityBuilder(newObject);

            var entitiesList = [];


            //const objectEntity = this.viewer.entities.add(entity);

            entities.forEach(entity => {
      
              const objectEntity = this.viewer.entities.add(entity);
              objectEntity.description = newObject.getFormatedData();
      
              entitiesList.push(objectEntity);

           });
       

      
            this.objectEntities[newObject.id] = entitiesList; 
      
       
    }
      

    updateObject(event, updatedObject) {

      

      const id = updatedObject.id; // Use the mobile object's ID as the cylinder ID
      const newLatitude = updatedObject.data.position._lat; // Use the mobile object's latitude
      const newLongitude = updatedObject.data.position._long; // Use the mobile object's longitude


        const objectEntities = this.objectEntities[id];  

        
      
        if (objectEntities) {
             

          objectEntities.forEach((entity) =>{

            const objectCoordinates = Cesium.Cartesian3.fromDegrees(
              newLongitude,
              newLatitude,
              entity.offset.z
            );
        
            entity.position.setValue(objectCoordinates);

            entity.cylinder.material.color.setValue(Cesium.Color.fromCssColorString("#FFEAFF").withAlpha(1));
            entity.cylinder.material.color.setValue(Cesium.Color.fromCssColorString("#FFEA00").withAlpha(1));

          
          }

          );

          this.placeMarker(newLatitude,newLongitude);

           

           
        }
        
    }


    placeMarker(newLatitude,newLongitude){

     if(this.marker){

      const objectCoordinates = Cesium.Cartesian3.fromDegrees(
        newLongitude,
        newLatitude,
        500
      );
  
      this.marker.position.setValue(objectCoordinates);





     } else {

      var pos = {
        position : Cesium.Cartesian3.fromDegrees(
          newLongitude,
          newLatitude,
         500
          ),
       
        ellipse: {
          semiMinorAxis: this.pulseProperty,
          semiMajorAxis: this.pulseProperty,
          height: 500.0,
          material:  Cesium.Color.ORANGERED,
          outline: true, // height must be set for outline to display
        }



     };

     /*
      point : {
            pixelSize : this.pulseProperty,
            color : Cesium.Color.ORANGERED
        },
     */

      this.marker = this.viewer.entities.add(pos);
      
  
    }
  }


    removeObject(event, id) {
      const objectEntity = this.objectEntities[id]; // Get the cylinder entity by ID
      if (objectEntity) {
        this.viewer.entities.remove(objectEntity); // Remove the specified cylinder entity from the viewer
        delete this.objectEntities[id]; // Remove the reference from the local collection
      }
    }
       
  
   
  
    setupTooltip(tooltipHTML) {
      this.tooltipElement = document.getElementById('tooltip');
  
      this.viewer.screenSpaceEventHandler.setInputAction(
        (movement) => {
          const pickedObject = this.viewer.scene.pick(
            movement.endPosition
          );
          if (
            Cesium.defined(pickedObject) &&
            pickedObject.id === this.objectEntity
          ) {
            const tooltipPosition = Cesium.SceneTransforms.wgs84ToWindowCoordinates(
              this.viewer.scene,
              this.objectEntity.position.getValue()
            );
  
            this.tooltipElement.innerHTML = tooltipHTML;
            this.tooltipElement.style.display = 'block';
  
            this.tooltipElement.style.left = `${movement.endPosition.x}px`;
            this.tooltipElement.style.top = `${movement.endPosition.y}px`;
          } else {
            //this.tooltipElement.style.display = 'none';
          }
        },
        Cesium.ScreenSpaceEventType.MOUSE_MOVE
      );
    }
  }
  
  export default vi_CesiumMap;
  
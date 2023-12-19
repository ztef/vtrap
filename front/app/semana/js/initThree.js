var sceneGL;

var sceneCSS3D;

var svgSecundary3D;

var controls;

var camera;

var raycaster = new THREE.Raycaster();

var mouse = new THREE.Vector2();


var lineaSenaladora;

var svgMujeres;

var svgHombres;

var group;

var geometriasCreados=[];

var graficaFrontal3D;

function init(){


                console.log("inicializando escena");   
	
            	var sceneCreator = new VOne.SceneCreator();

                
                sceneGL = sceneCreator.createScene({ bodyBGColor: 0x2a273b, bodyBGAlpha: 1.0, antialias:true, bgColor:"#000000", bgAlpha:0.09,  useTweenAnimations:true, glRenderer: THREE.WebGLRenderer, width:windowWidth, height:windowHeight,controls: THREE.OrbitControls,        parentType:"div", cameraNear:.1 , cameraFar:100000000 ,containerId:"webglContainer",raycastThreshold:40,verticalDegFOV:35  });


                sceneCSS3D = sceneCreator.createScene({ bgColor:"#00FF00", bgAlpha:0.0, glRenderer: THREE.CSS3DRenderer, width:windowWidth, height:windowHeight, useControls: sceneGL.controls , camera:sceneGL.camera,   parentType:"div",  containerId:"svgGraficaFrontal",raycastThreshold:40, verticalDegFOV:35  });   

              
               
             

            	controls= sceneGL.controls;

            	camera = sceneCSS3D.camera;

                sceneGL.camera.position.set(-5300,6000,133);

            	
                // //Encuadra las ventanas del DOM
                $("#svgGraficaFrontal").css("position","fixed");
                $("#svgGraficaFrontal").css("float","left");

                //$('canvas').css({ 'background':'#2a273b'});
                //$("#svgGraficaFrontal").css("pointer-events","none");
                $("#webglContainer").css("z-index",3);

                $("#svgGraficaFrontal").css("z-index",-2);

                $("#webglContainer").css("position","fixed");
                // $("#webglContainer").css("z-index",-1);

                
                sceneCSS3D.controls.target.x=-202;
                sceneCSS3D.controls.target.y=-344; 
                sceneCSS3D.controls.target.z=93;
              
                
                //SVG (Elemento del DOM ) principal
                graficaFrontal3D = new THREE.CSS3DObject( $("#svgMain")[0] );  

                sceneCSS3D.add( graficaFrontal3D );
                
                graficaFrontal3D.position.set(0,0,0);

                graficaFrontal3D.rotation.x=-90*(Math.PI/180);




                raycaster = new THREE.Raycaster();

                raycaster.params.PointCloud.threshold = .5;

                /*

                controls.minPolarAngle = 0*(Math.PI/180);

                controls.maxPolarAngle =.5*(Math.PI/180);  

                controls.minDistance = 20;

                controls.maxDistance = 5000;   

                controls.minAzimuthAngle = 0*(Math.PI/180);  

                controls.maxAzimuthAngle = .5*(Math.PI/180);

                */


                //LUCES ****************************
                

                var directionalLight = new THREE.DirectionalLight(  0xffffff, .4 );
                directionalLight.position.x = -500;
                directionalLight.position.y = 20000;
                directionalLight.position.z = 5000;
                directionalLight.position.normalize();
                sceneGL.add( directionalLight );
                
                directionalLight.shadow.camera = true;
                directionalLight.castShadow = true;
                directionalLight.shadowDarkness = 0.5;

                 var directionalLight = new THREE.DirectionalLight(  0xffffff, 1 );
                directionalLight.position.x = -35000;
                directionalLight.position.y = -5000;
                directionalLight.position.z = 15000;
                directionalLight.position.normalize();
                sceneGL.add( directionalLight );

                directionalLight.shadow.camera = true;
                directionalLight.castShadow = true;
                directionalLight.shadowDarkness = 0.5;
                

                var directionalLight = new THREE.DirectionalLight(  0xffffff, 1 );
                directionalLight.position.x = 9000;
                directionalLight.position.y = 6000;
                directionalLight.position.z = -20000;
                directionalLight.position.normalize();
                sceneGL.add( directionalLight );


                 var directionalLight = new THREE.DirectionalLight(  0xffffff, 1 );
                directionalLight.position.x = 30000;
                directionalLight.position.y = 0;
                directionalLight.position.z = 25000;
                directionalLight.position.normalize();
                sceneGL.add( directionalLight );

                //DibujaParticulas();

                TotalesEntidades();

                DibujaParticulas();

                DibujaEdades();

                DibujaTotales();

                setInterval(()=>{ 

                    DrawToolTip();

                }, 100 );
   

}



var slicesMaterial;

var ultimoSeleccionado;

var ultimoSeleccionadoPago;


function onDocumentMouseMove( event ) {  

    

    mouse_x=event.pageX;

    mouse_y=event.pageY;

    
    if(modo == "bienes"){

        return;
        
    }

    event.preventDefault();

    mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
    mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;
   
    raycaster.setFromCamera( mouse, camera );


    // CILINDORS DE PROYECTOS *****************************************************************************

    var intersects = raycaster.intersectObjects( celdasCreadas ); 


    if (  intersects.length > 0 ) {   


        if( !modoSeleccionaSVG ){ 


                if(ultimoSeleccionado != intersects[0].object){
                   

                            if(ultimoSeleccionado){

                                var material = new THREE.MeshBasicMaterial( {color: 0xffffcc   ,  depthTest:true , transparent:true , opacity:.9 } );     

                                    ultimoSeleccionado.material=material;

                            }


                            var material = new THREE.MeshBasicMaterial( {color: 0xffffff   ,  depthTest:true , transparent:false , opacity:1 } );;   

                            intersects[0].object.material=material;
                        
                            ultimoSeleccionado= intersects[0].object;


                            var obj= intersects[0].object;

                            $("#toolTip2").css("visibility","visible");          
                            $("#toolTip2").css("left",(mouse_x+20)+"px");
                            $("#toolTip2").css("top",mouse_y-50+"px"); 

                            //Ubicacion: diccionarioElementosIndividuales[e].ubicacion,
                                //Sububicacion: diccionarioElementosIndividuales[e].subUbicacion,
                                //Tipo: diccionarioElementosIndividuales[e].tipo,
                                //Subtipo:diccionarioElementosIndividuales[e].subCategoria


                            var toolText =  
                                            "<span style='color:#8FB7C4;font-family:Coda'>Ubicacion: <span style='color:yellow'>"+obj.data.Ubicacion+" <br>"+
                                            "<span style='color:#8FB7C4'>Sububicacion: <span style='color:yellow'>"+obj.data.Sububicacion+" <br>"+
                                            "<span style='color:#8FB7C4;font-family:Coda'>Tipo: <span style='color:yellow'>"+obj.data.Tipo+" <br>"+
                                            "<span style='color:#8FB7C4'>Subtipo: <span style='color:yellow'>"+obj.data.Subtipo+" <br>"+
                                            "<span style='color:#8FB7C4;font-family:Coda'>Bienes: <span style='color:yellow'>"+formatNumber(obj.data.Cantidad)+" <br>";
                                          
                                                                                                                                                   
                                            ;

                            $("#toolTip2").html(toolText);                  

                   

                }

        }

    }else {         

                if(ultimoSeleccionado){

                   var material = new THREE.MeshBasicMaterial( {color: 0xffffcc   ,  depthTest:true , transparent:true , opacity:.9 } );   

                            ultimoSeleccionado.material=material;

                            ultimoSeleccionado=undefined;

                }
        
                $("#toolTip2").css("visibility","hidden"); 

    }



}





function onDocumentMouseDown(  ) {

    


    raycaster.setFromCamera( mouse, camera );


    var intersects = raycaster.intersectObjects( cedis3D );


    if (  intersects.length > 0 ) {

           // if(intersects[0].object.position)
                //TweenLite.to( controls.target, 2, {x:intersects[0].object.position.x , y:intersects[0].object.position.y-400 , z:intersects[0].object.position.z ,delay:0});

               

    }else{




    }

    

}



var diccionarioParticulas={};

var geometryModel;

var diccionarioElementosIndividuales={};

var maximoValorPorCelda = 0;

function DibujaParticulas(){	

			//Rows= Rows.splice(0,3500);

			for(var i=0; i < Rows.length; i++){	

					var id_Celda = Rows[i].dia+"_"+Rows[i].edadRedondeada+"_"+Rows[i].colonia+"_"+Rows[i].condicion;

					if( !diccionarioElementosIndividuales[id_Celda] ){

						diccionarioElementosIndividuales[id_Celda]={cantidad:0,dibujados:0 };

					}

					diccionarioElementosIndividuales[id_Celda].cantidad++;

					if(maximoValorPorCelda < diccionarioElementosIndividuales[id_Celda].cantidad )
						maximoValorPorCelda = diccionarioElementosIndividuales[id_Celda].cantidad;

			}

			var dias = Object.keys(diccionarioDias);


			var colores=["#ff0000","#ffcb1f"]

			if(sceneGL){	

				var geometriesGenerator = new VOne.GenericBufferGeometriesGenerator();				
				
				geometriesGenerator.setModel(Rows)

				.setPosition(function(v){									

								if(diccionarioColonias[v.colonia]){

									var id_Celda = v.dia+"_"+v.edadRedondeada+"_"+v.colonia+"_"+v.condicion;

									// COLONIA ******
						
									var posX = diccionarioColonias[v.colonia].x;

									var posY = diccionarioDias[dias[v.dia]].posY;

									var anchoEdad= diccionarioDias[dias[v.dia]].alto/50;

									var offSetEdad = v.edadRedondeada*anchoEdad;

									diccionarioElementosIndividuales[id_Celda].dibujados++;

									var alturaBase=0;

									switch(v.condicion){
										case 1:
											alturaBase=0;
										break;
										case 2:
											alturaBase=300;
										break;
										case 3:
											alturaBase=400;
										break;

									}


									v.X = posX-(config.profundidadCanvas/2);
									
									v.Z = posY+offSetEdad-(config.anchoCanvas/2);	

									v.Y = alturaBase+diccionarioElementosIndividuales[id_Celda].dibujados*25;									
								
											
									return  new THREE.Vector3(v.X, v.Y, v.Z);

								}else{

									return  new THREE.Vector3(0,0,0);

								}
					

				})
				.setSize(function(v){ 	// v - representa cada objeto del arreglo
						
						v.tamanioOriginal=150;	



						switch(v.condicion){
							case 1:
								v.tamanioOriginal=150;
							break;
							case 2:
								v.tamanioOriginal=200;
							break;
							case 3:
								v.tamanioOriginal=300;
							break;

						}					

						return v.tamanioOriginal;				

				})
				.setAlpha(function(v){ 	// v - representa cada objeto del arreglo

						return 1;	
					
				})
				.setColor(function(v){ 	// v - representa cada objeto del arreglo

						var colorBase="#cccccc";

						switch(v.condicion){
							case 1:
								colorBase="#ffffff";
							break;
							case 2:
								colorBase=colores[getRandomInt(0,1)];
							break;
							case 3:
								colorBase="#e730ff";
							break;

						}


						v.colorOriginal=new THREE.Color(colorBase);
	
						return v.colorOriginal;

				});


				geometryModel = geometriesGenerator.generate();

				var shadersCreator = new VOne.ShaderCreator();


				var textureCanvas = document.createElement('canvas');
			    textureCanvas.width = 128;
			    textureCanvas.height = 128;
			    textureCanvas.background = 'transparent';

			    var context = textureCanvas.getContext('2d');
			    var grad = context.createRadialGradient(64, 64, 1, 64, 64, 128);
			    grad.addColorStop(0, 'rgba(255, 255, 255, 1)');
			    //grad.addColorStop(0.5, 'rgba(255, 255, 255, 0.66)');
			    grad.addColorStop(1, 'rgba(150, 150, 150, 1)');

			    context.arc(64, 64, 64, 0, 2 * Math.PI);
			    context.fillStyle = grad;
			    context.fill();

			    particlesTexture = new THREE.Texture(textureCanvas);
			    particlesTexture.needsUpdate = true;

				var nodesShader = shadersCreator.createShader(
								{
								color: 'color',
								size: 'size',
								alpha: 'alpha',
								points: true,
								useTHREETexture: particlesTexture
								//useTexture: 'sprites/whiteSphere2.png'
								});


				var bufferGeometryMaterial = new THREE.ShaderMaterial({
									uniforms: nodesShader.uniforms,
									vertexShader: nodesShader.vertexShader,
									fragmentShader: nodesShader.fragmentShader,

									//blending: THREE.AdditiveBlending,
									//blendEquation: THREE.AddEquation,
									// blendSrc: THREE.SrcAlphaFactor,
									// blendDst: THREE.SrcAlphaFactor,

									depthTest: true,
									transparent: false

									});


				particles = new THREE.Points(geometryModel.geometry, bufferGeometryMaterial);

				particles.frustumCulled  = false;

				sceneGL.add(particles);

				

				geometryModel.setMesh(particles);

				sceneGL.registerInteractiveBufferGeometry(geometryModel);


				sceneGL.registerInteractiveBufferGeometry(geometryModel);

				geometryModel.setInteraction('onMouseOver', function(element, index){	

										if(modo == "grupos"){

									        return;
									        
									    }						
										
							
										var data = geometryModel.dataModel[index];
										
										// color
										
										var colorArray = geometryModel.getColorArray();							

										colorArray[index * 3] = 255;
										colorArray[index * 3 + 1] = 255;
										colorArray[index * 3 + 2] = 255;

										var geom = geometryModel.getGeometry();

										geom.attributes.color.needsUpdate = true;


										// tamanio

										var sizeArray = geometryModel.getSizeArray();	

										sizeArray[index] = sizeArray[index]*1.3;

										geom.attributes.size.needsUpdate = true;
										

										$("#toolTip").css("visibility","visible");	        
								        $("#toolTip").css("left",(mouse_x+20)+"px");
			                    		$("#toolTip").css("top",mouse_y-50+"px"); 			    	

								      
								    	var toolText =  
								    					"<span style='color:#fff600'>Dia:  <span style='color:#ffffff'>"+data.dia+" <br>"+
								    					"<span style='color:#fff600'>Alertas:  <span style='color:#ffffff'>"+data.edad+"<br>"+
								    					"<span style='color:#fff600'>Router:  <span style='color:#ffffff'> "+nombreColonias[data.colonia]+"<br><hr>"+
								    					"<span style='color:#fff600'>Marca:  <span style='color:#ffffff'> <br>"+
								    					"<span style='color:#fff600'>Localidad:  <span style='color:#ffffff'><br>"+
								    					"<span style='color:#fff600'>Clave:  <span style='color:#ffffff'><br>"+
								    					"<span style='color:#fff600'>Tipo:  <span style='color:#ffffff'> <br>";
								    					;

								

								    					
								    	$("#toolTip").html(toolText);	

					    							
							


						    });


							geometryModel.setInteraction('onMouseOut', function(element, index){
											
											if(!geometryModel.dataModel[index])
												return;

											var data = geometryModel.dataModel[index];

												var geom = geometryModel.getGeometry();	

											// tamanio

											var sizeArray = geometryModel.getSizeArray();	

											sizeArray[index] = geometryModel.dataModel[index].tamanioOriginal;

											geom.attributes.size.needsUpdate = true;

											// color

											var colorRGB = new THREE.Color(geometryModel.dataModel[index].colorOriginal);

											var colorArray = geometryModel.getColorArray();			

											colorArray[index * 3] = colorRGB.r ;
											colorArray[(index * 3) + 1] = colorRGB.g ;
											colorArray[(index * 3)+ 2] = colorRGB.b ;


												
											
											geom.attributes.color.needsUpdate = true;
										
											$("#toolTip").css("visibility","hidden");	   	
											

							});	

							geometryModel.setInteraction('onClick', function(element, index){

										var data = geometryModel.dataModel[index];

										TweenLite.to( controls.target, 2, {x:data.X,y:data.Y,z:data.Z,delay:0});						
								

							 
							});


			}

			

}



var escaladoParticulas=1;

function AumentaTamanioParticula(){
		

		var tamanios = geometryModel.getSizeArray();

		for(var i=0; i<tamanios.length; i++){			

			tamanios[i] = tamanios[i]*1.2;

		}

		var geom = geometryModel.getGeometry();			
			
		geom.attributes.size.needsUpdate = true;

		escaladoParticulas = ((escaladoParticulas*100)*1.2)/100;


}



function ReduceTamanioParticula(){

		var tamanios = geometryModel.getSizeArray();

		for(var i=0; i<tamanios.length; i++){			

			tamanios[i] = tamanios[i]*.8;

		}

		var geom = geometryModel.getGeometry();			
			
		geom.attributes.size.needsUpdate = true;

		escaladoParticulas = ((escaladoParticulas*100)*.8)/100 ;
	
}


var celdasCreadas=[];

function DibujaGruposCelda(){

		for ( var e in diccionarioElementosIndividuales ){

			var radio = diccionarioSubAros[ diccionarioElementosIndividuales[e].subCategoria ].inicio; //anchoSubGrupo

			var angulo = diccionarioSubCategorias[  diccionarioElementosIndividuales[e].ubicacion +"_"+ diccionarioElementosIndividuales[e].subUbicacion ].angulo;

			angulo= angulo+(diccionarioSubCategorias[  diccionarioElementosIndividuales[e].ubicacion +"_"+ diccionarioElementosIndividuales[e].subUbicacion ].ancho/2)// ancho


			// dibuja Cilindro

			var radioCilindro = GetValorRangos( diccionarioElementosIndividuales[e].cantidad , 1 , maximoValorPorCelda  , 1  ,   50);

			var geometry = new THREE.CylinderGeometry( radioCilindro , radioCilindro , 1 , 40 );

	       	var material = new THREE.MeshBasicMaterial( {color: 0xffffcc   ,  depthTest:true , transparent:true , opacity:.9 } );

	       	cylinderOpaco = new THREE.Mesh( geometry, material );

	       	sceneGL.add( cylinderOpaco );

	       	sceneGL._scene.remove( cylinderOpaco );

	       	cylinderOpaco.data=

	       	{
	       		Ubicacion: diccionarioElementosIndividuales[e].ubicacion,
	       		Sububicacion: diccionarioElementosIndividuales[e].subUbicacion,
	       		Tipo: diccionarioElementosIndividuales[e].tipo,
	       		Subtipo:diccionarioElementosIndividuales[e].subCategoria,
	       		Cantidad:diccionarioElementosIndividuales[e].cantidad
	       	}

	       	var position = CreaCoordenada( angulo  , radioExt-radio+diccionarioSubAros[ diccionarioElementosIndividuales[e].subCategoria ].anchoGrupo  , {x:config.anchoCanvas/2 , y:config.anchoCanvas/2 }  );

	       	cylinderOpaco.position.set( position.x-config.anchoCanvas/2 , 0 , position.y-config.anchoCanvas/2 );

	       	celdasCreadas.push(cylinderOpaco);

		}


}

var modo= "bienes";

function CambiaModo(){

	if(modo == "bienes"){

		modo = "grupos";

		for(var i=0; i < celdasCreadas.length; i++){

				sceneGL.add( celdasCreadas[i] );

		}

		sceneGL._scene.remove( particles );

	}else{

		modo = "bienes";

		for(var i=0; i < celdasCreadas.length; i++){

				sceneGL._scene.remove( celdasCreadas[i] );

		}

		sceneGL.add( particles );

	}

}



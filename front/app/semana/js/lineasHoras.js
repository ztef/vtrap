


function DibujaLineasHoras(){


	
	 for(var i=0;  i < MposCategorias.length; i++){ 
	 			

                for(var j=0;  j < MposCategorias[i].values.length; j++){ 


                				var maximoCaso=0;

                				for(var l=0; l < MposCategorias[i].values[j].horasArr.length; l++){ 

		                			if(maximoCaso < MposCategorias[i].values[j].horasArr[l].sumatoria ){

		                					maximoCaso = MposCategorias[i].values[j].horasArr[l].sumatoria;

		                			}

	                			}



                				var posAnterior;

                				var caso=0;

		                		for(var l=0; l < MposCategorias[i].values[j].horasArr.length; l++){ 

		                				


		                				var fecha = new Date(Number(MposCategorias[i].values[j].horasArr[l].tiempo));

				                		var anguloData = diccionario_mpos[  MposCategorias[i].key  ];

										var radioData = diccionario_categorias[ MposCategorias[i].values[j].key  ].radio - (diccionario_categorias[  MposCategorias[i].values[j].key  ].ancho/2);

										//Ajusta el radio segun el tiempo en la que fue expedida la cita
										var ajusteRadio = GetValorRangos(  fecha.getTime()  , minDate  ,  maxDate   , 0   , diccionario_categorias[MposCategorias[i].values[j].key].ancho );

										var posicion = CreaCoordenada( anguloData.angulo-(anguloData.ancho/2)  ,  radioData+ajusteRadio    , {x:config.anchoCanvas/2,y:config.anchoCanvas/2 }  );

										var altura = GetValorRangos(  MposCategorias[i].values[j].horasArr[l].sumatoria ,  0  ,  maximoPorMinuto  ,  10  ,  800  );

									
										
										var X = posicion.x-(config.anchoCanvas/2)+5000;
										
										var Z = posicion.y-(config.anchoCanvas/2);


										if(MposCategorias[i].values[j].horasArr[l].sumatoria == maximoPorMinuto ){											
											
											var geometry = new THREE.CylinderGeometry( 100, 100, 1, 32 );
											//Yellow 
											var material = new THREE.MeshBasicMaterial( {color: 0xff0000,transparent:true, opacity:.5 } );
											var cylinder = new THREE.Mesh( geometry, material );
											sceneGL.add( cylinder );
											cylinder.position.set(X,altura+150,Z);

											//************************************

											var geometry = new THREE.CylinderGeometry( 400, 400, 1, 32 );
											//Yellow
											var material = new THREE.MeshBasicMaterial( {color: 0xff0000,transparent:true, opacity:.1 } );
											var cylinder = new THREE.Mesh( geometry, material );
											sceneGL.add( cylinder );
											cylinder.position.set(X,altura+150,Z);

										}


										// LINEA DE REFERENCIA ***************************************

										geometry = new THREE.Geometry();
										geometry.vertices.push(new THREE.Vector3(X, 0, Z)); //x, y, z
										geometry.vertices.push(new THREE.Vector3(X, altura , Z));

										material2 = new THREE.LineBasicMaterial( { color: 0xffffff , linewidth: 1 ,transparent:true,opacity:.3 } );
										var line2 = new THREE.Line(geometry, material2);
										sceneGL.add(line2);


										if(l>0){

												geometry = new THREE.Geometry();
												geometry.vertices.push(new THREE.Vector3(posAnterior.x, posAnterior.y, posAnterior.z)); //x, y, z
												geometry.vertices.push(new THREE.Vector3(X, altura , Z));

												material = new THREE.LineBasicMaterial( { color: 0xffffff , linewidth: .5 } );
												var line = new THREE.Line(geometry, material);
												sceneGL.add(line);

										}
										
										posAnterior={x:X  ,y:altura  ,z: Z }

										//Etiquetas de fechas

										caso++;

		                				if( caso==8 )
		                					caso=0;	

										if( caso==0 &&  MposCategorias[i].values[j].key == "Seguridad" ){

											svgSecondaryGraph.append("text")						
													//.attr("x",20 )
													//.attr("y", (alturaPorPeriodo*i)+margenSuperior+30  )
													.attr("fill","black")							
													.style("opacity",1)
													.style("font-family","Cabin")
													.style("font-weight","bold")
													.style("font-size",15)						
													.style("text-anchor","end")
													.attr("transform"," translate("+String(posicion.x)+","+String(posicion.y)+")  rotate("+String(anguloData.angulo-(anguloData.ancho/2)+180)+")")
													.text(function(){													

														return fecha.getDate()+" "+getMes(fecha.getMonth())+" "+fecha.getHours();

													});

											

										}

										if(maximoCaso == MposCategorias[i].values[j].horasArr[l].sumatoria && MposCategorias[i].values[j].key == "Seguridad"){

												svgSecondaryGraph.append("image")
															.attr("class","grafico")
															.attr("class","SvgDetailWindow")
															.attr("xlink:href","images/alert.png")
															.style("opacity",	1	)
															.attr("width",	50	)
															.attr("transform"," translate("+String(posicion.x)+","+String(posicion.y)+")  rotate("+String(anguloData.angulo-(anguloData.ancho/2)+180)+")")
															;

											}
										

								}	


                }

      }


}
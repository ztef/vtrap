var pies=[];

function DibujaGraficasComplementarias(){

		//Grafica Central

		

		//Cilindro transparente 

		var geometry = new THREE.CylinderGeometry( 120 , 120 , 800 , 62 );

        var material = new THREE.MeshPhongMaterial( {color: 0xffffff   ,  depthTest:true , transparent:true , opacity:.3 } );

        cylinderOpaco = new THREE.Mesh( geometry, material );

        sceneGL.add( cylinderOpaco );

        cylinderOpaco.position.set( 0 , 400 , 0 );


       // Cilindro opaco

       var geometry = new THREE.CylinderGeometry( 110 , 110 , 600 , 62 );

       var material = new THREE.MeshPhongMaterial( {color: 0x0ced48   ,  depthTest:true , transparent:false , opacity:1 } );

       cylinderOpaco = new THREE.Mesh( geometry, material );

       sceneGL.add( cylinderOpaco );

       cylinderOpaco.position.set( 0 , 300 , 0 );

       //Etiqueta

       var etiquetaMesh = new VOne.Label3D( "Ejecutado: $"+formatNumber(totalIngreso/1000)+"M" , { textColor: hexToRgb("#ffffff") , fontFace: "Cabin, sans-serif", transparent:false, opacity:1, fontSize: 13, textAlign: 'start', canvasFixedHeight:100 , canvasFixedWidth:400 });

	   sceneGL.add(etiquetaMesh);

	   etiquetaMesh.position.set( -240 , altura+50 , 0);

	   etiquetaMesh.position.y=600;

	   etiquetaMesh.position.x=160;

	  


       // Referencia año anterior

       var geometry = new THREE.CylinderGeometry( 140 , 140 , 1 , 62 );

       var material = new THREE.MeshPhongMaterial( {color: 0x828282   ,  depthTest:true , transparent:false , opacity:1 } );

       cylinderOpaco = new THREE.Mesh( geometry, material );

       sceneGL.add( cylinderOpaco );

       cylinderOpaco.position.set( 0 , 560 , 0 );

       //Etiqueta

       var etiquetaMesh = new VOne.Label3D( "Pagado: $"+formatNumber((totalIngreso/1000)*.9)+"M" , { textColor: hexToRgb("#cccccc") , fontFace: "Cabin, sans-serif", transparent:false, opacity:1, fontSize: 13, textAlign: 'start', canvasFixedHeight:100 , canvasFixedWidth:400 });

	   sceneGL.add(etiquetaMesh);

	   etiquetaMesh.position.set( -240 , altura+50 , 0);

	   etiquetaMesh.position.y=560;

	   etiquetaMesh.position.x=160;




        //META

       var geometry = new THREE.CylinderGeometry( 140 , 140 , 1 , 62 );

       var material = new THREE.MeshPhongMaterial( {color: 0xffffff   ,  depthTest:true , transparent:false , opacity:1 } );

       cylinderOpaco = new THREE.Mesh( geometry, material );

       sceneGL.add( cylinderOpaco );

       cylinderOpaco.position.set( 0 , 750 , 0 );

       //Etiqueta

       var etiquetaMesh = new VOne.Label3D( "Total de Proyectos: $"+formatNumber((totalIngreso/1000)*1.3)+"M" , { textColor: hexToRgb("#ffffff") , fontFace: "Cabin, sans-serif", transparent:false, opacity:1, fontSize: 13, textAlign: 'start', canvasFixedHeight:100 , canvasFixedWidth:400 });

	   sceneGL.add(etiquetaMesh);

	   etiquetaMesh.position.set( -240 , altura+50 , 0);

	   etiquetaMesh.position.y=750;

	   etiquetaMesh.position.x=160;



       // TICKS DEL CILINDOR CNETRAL

       var distanciaTick = 800/20;

		for(var i=1; i < 21; i++){

			var geometry = new THREE.SphereGeometry(2, 3, 3, 0, Math.PI * 2, 0, Math.PI * 2);
			var material = new THREE.MeshBasicMaterial( { color: new THREE.Color("#ffffff") ,  });
			var esfera = new THREE.Mesh(geometry, material);
			sceneGL.add(esfera);

			esfera.position.y = distanciaTick*i;

			esfera.position.x=120;


			var geometry = new THREE.SphereGeometry(2, 3, 3, 0, Math.PI * 2, 0, Math.PI * 2);
			var material = new THREE.MeshBasicMaterial( { color: new THREE.Color("#ffffff") ,  });
			var esfera = new THREE.Mesh(geometry, material);
			sceneGL.add(esfera);

			esfera.position.y = distanciaTick*i;

			esfera.position.x=-120;

		}

		var shadersCreator2 = new VOne.ShaderCreator();        

        var slicesShader = shadersCreator2.createShader({
                color: 'color',
                alpha: 'alpha'
            }); 


		for(var i=0; i < plazas.length; i++){

				var altura = GetValorRangos(  plazas[i].total  , 1  , 1108482  , 1 , 350);

				var slicesMaterial3 = new THREE.MeshPhongMaterial({

                                                        vertexShader: slicesShader.vertexShader,
                                                        fragmentShader: slicesShader.fragmentShader,
                                                        uniforms: slicesShader.uniforms,
                                                        blending: THREE.NormalBlending,
                                                        depthTest: true,
                                                        color: new THREE.Color( diccionarioCategorias[ plazas[i].key ].color  ),                                                      
                                                        alpha:.2,
                                                        transparent: true

                                                    });



           

	            var rebanada3 = new VOne.PieSlice ( {

	                startAngle:diccionarioCategorias[ plazas[i].key ].angulo,
	                endAngle:diccionarioCategorias[ plazas[i].key ].angulo+diccionarioCategorias[ plazas[i].key ].ancho,
	                innerRadius:150,
	                outerRadius:200,
	                height:altura,
	                color:new THREE.Color(diccionarioCategorias[ plazas[i].key ].color),
	                
	                transparent:true,
	                alpha: .2

	             }  );                    
	            


	            var mesh = new THREE.Mesh(rebanada3.getGeometry(), slicesMaterial3 )

	            mesh.material_ = {

                                   vertexShader: slicesShader.vertexShader,
                                    fragmentShader: slicesShader.fragmentShader,
                                    uniforms: slicesShader.uniforms,
                                    blending: THREE.NormalBlending,
                                    depthTest: true,
                                    color: new THREE.Color( diccionarioCategorias[ plazas[i].key ].color  ),                                                      
                                    alpha:.2,
                                    transparent: true

                                };

	            sceneGL.add(mesh);  

	            mesh.tipo=1;       

	            //sceneGL._scene.remove(mesh);      

	          	cedis3D.push(mesh);

	            mesh.rotation.x=90*(Math.PI/180);

	            mesh.rotation.z=-90*(Math.PI/180);

	            mesh.position.y=altura;

	            //REFRENCIA PLAZAS

	            var alturaObjetivo = altura*.3;

	            var slicesMaterial4 = new THREE.MeshPhongMaterial({

                                                        vertexShader: slicesShader.vertexShader,
                                                        fragmentShader: slicesShader.fragmentShader,
                                                        uniforms: slicesShader.uniforms,
                                                        blending: THREE.NormalBlending,
                                                        depthTest: true,
                                                        color: new THREE.Color( diccionarioCategorias[ plazas[i].key ].color  ),                                                      
                                                        alpha:.2,
                                                        transparent: true
                                                       
                                                    });





	            var rebanadaRef = new VOne.PieSlice ( {

	                startAngle:diccionarioCategorias[ plazas[i].key ].angulo,
	                endAngle:diccionarioCategorias[ plazas[i].key ].angulo+diccionarioCategorias[ plazas[i].key ].ancho,
	                innerRadius:150,
	                outerRadius:200,
	                height:alturaObjetivo,
	                color:new THREE.Color("#ffffff"),	                
	                transparent:true,
	                alpha: .2

	             }  );                      
	            
	             let edgeGeometry3 = rebanadaRef.getEdgesGeometry({
		                    color:new THREE.Color( 0xffffff ),
		                    alpha: .4
		                });


	            var materialBasico = new THREE.LineBasicMaterial( { color: new THREE.Color("#ffffff") , transparent:true,opacity:.4 });

	            var meshRef1 = new THREE.LineSegments(edgeGeometry3,materialBasico);



	          
	            sceneGL.add(meshRef1);  	           

	            //sceneGL._scene.remove(mesh);      

	          	pies.push(meshRef1);

	            meshRef1.rotation.x=90*(Math.PI/180);

	            meshRef1.rotation.z=-90*(Math.PI/180);

	            meshRef1.position.y=alturaObjetivo+altura+5;


              

               for(var j=0; j < plazas[i].values.length; j++){


               				var altura = GetValorRangos(  plazas[i].values[j].total  , 1  , 300000  , 1 , 100);

							var slicesMaterial3 = new THREE.MeshPhongMaterial({

			                                                        vertexShader: slicesShader.vertexShader,
			                                                        fragmentShader: slicesShader.fragmentShader,
			                                                        uniforms: slicesShader.uniforms,
			                                                        blending: THREE.NormalBlending,
			                                                        depthTest: true,
			                                                        color: new THREE.Color( diccionarioCategorias[ plazas[i].key ].color  ),                                                      
			                                                        alpha:.2,
			                                                        transparent: true

			                                                    });



			           

				            var rebanada3 = new VOne.PieSlice ( {

				                startAngle:diccionarioSubCategorias[ plazas[i].values[j].key ].angulo-diccionarioSubCategorias[ plazas[i].values[j].key ].ancho,
				                endAngle:diccionarioSubCategorias[ plazas[i].values[j].key ].angulo-2,
				                innerRadius:290,
				                outerRadius:350,
				                height:altura,
				                color:new THREE.Color(diccionarioCategorias[ plazas[i].key ].color),
				                
				                transparent:true,
				                alpha: .2

				             }  );                      
				            
				            


				            var mesh2 = new THREE.Mesh(rebanada3.getGeometry(), slicesMaterial3 )

				            mesh2.material_ = {

				                                                       	startAngle:diccionarioSubCategorias[ plazas[i].values[j].key ].angulo-diccionarioSubCategorias[ plazas[i].values[j].key ].ancho,
														                endAngle:diccionarioSubCategorias[ plazas[i].values[j].key ].angulo-2,
														                innerRadius:290,
														                outerRadius:350,
														                height:altura,
														                color:new THREE.Color(diccionarioCategorias[ plazas[i].key ].color),
														                
														                transparent:true,
														                alpha: .2

				                                                    };

				            sceneGL.add(mesh2);  

				            mesh2.tipo=2;       

				           	cedis3D.push(mesh2);

				          	pies.push(mesh2);

				            mesh2.rotation.x=90*(Math.PI/180);

				            mesh2.rotation.z=-90*(Math.PI/180);

				            mesh2.position.y=altura;



				            //REFRENCIA PLAZAS

				            var alturaObjetivo = altura*.3;

				            var slicesMaterial4 = new THREE.MeshPhongMaterial({

			                                                        vertexShader: slicesShader.vertexShader,
			                                                        fragmentShader: slicesShader.fragmentShader,
			                                                        uniforms: slicesShader.uniforms,
			                                                        blending: THREE.NormalBlending,
			                                                        depthTest: true,
			                                                        color: new THREE.Color( diccionarioCategorias[ plazas[i].key ].color  ),                                                      
			                                                        alpha:.2,
			                                                        transparent: true
			                                                       
			                                                    });





				            var rebanadaRef = new VOne.PieSlice ( {

				                startAngle:diccionarioSubCategorias[ plazas[i].values[j].key ].angulo-diccionarioSubCategorias[ plazas[i].values[j].key ].ancho,
				                endAngle:diccionarioSubCategorias[ plazas[i].values[j].key ].angulo-2,
				                innerRadius:290,
				                outerRadius:350,
				                height:altura*1.3,
				                color:new THREE.Color(diccionarioCategorias[ plazas[i].key ].color),
				                
				                transparent:true,
				                alpha: .2

				             }  );                      
				            
				             let edgeGeometry3 = rebanadaRef.getEdgesGeometry({
					                    color:new THREE.Color( 0xffffff ),
					                    alpha: .4
					                });


				            var materialBasico = new THREE.LineBasicMaterial( { color: new THREE.Color("#ffffff") , transparent:true,opacity:.4 });

				            var meshRef1 = new THREE.LineSegments(edgeGeometry3,materialBasico);



				          
				            sceneGL.add(meshRef1);  	           

				            //sceneGL._scene.remove(mesh);      

				          	pies.push(meshRef1);

				            meshRef1.rotation.x=90*(Math.PI/180);

				            meshRef1.rotation.z=-90*(Math.PI/180);

				            meshRef1.position.y=altura*1.3;

                  

		                   for(var k=0; k < plazas[i].values[j].values.length; k++){

		                       

		                        for(var l=0; l < plazas[i].values[j].values[k].values.length; l++){                         

		                               

		                        }

		                    }

               }


         }


}

var etiquetasProveedores=[];

var lineas=[];

function DibujaGraficasProveedores(){

	edades.sort(function(a, b){

			 		return b.cantidad-a.cantidad;

	            });

	for(var i=0 ; i < edades.length ; i++ ){

			var ancho = GetValorRangos(edades[i].cantidad,1,10000,1,300);

		 	var linea= svgLines.append("rect")
							.attr("width",1)
							.attr("class","windowDetail")
							.attr("height",3)
							.attr("fill","#829bc4")	
							.attr("x","10")
							.attr("filter","url(#glow)")
						    .attr("y",(i*8)+90)	;

			linea.transition()
							.delay(i*40)
							.duration(500)
						    .attr("width",ancho)		    
						    ;

			linea.ancho=ancho;

			lineas.push(linea);

			var etiqueta = svgLines.append("text")						
									
							.attr("fill",function(){

								return "#ffffff"	;

							})				
							.style("opacity",1)
							.style("font-family","Calibri")
							.style("font-weight","normal")
							.style("font-size",8)							
							.style("text-anchor","start")
							.attr("transform"," translate("+String(15+ancho)+","+String((i*8)+94)+")  rotate(0) ")
							.text(function(){

								return "C "+i+"  $000 M";



							});

			etiqueta.Y = (i*8)+94;

			etiqueta.X = ancho;

			etiquetasProveedores.push(etiqueta);

	}
	

}


var svgMain;

var svgSecondaryGraph;

var raycaster = new THREE.Raycaster();


var radioInt=config.profundidadCanvas*.15;


var radioExt=config.profundidadCanvas*.43;


var diccionarioColonias = {};

var svgLines;



function InitSVG(){	

			$("#svgLines")
					.css("width",(config.profundidadCanvas))
					.css("height",(config.anchoCanvas));


			svgLines = d3.select("#svgLines")						
								.append("svg")
								.attr("id","containerSCG")
								.attr("width", windowWidth )
								.attr("height", windowHeight )
								;


			$("#svgMain")
					.css("width",(config.profundidadCanvas))
					.css("height",(config.anchoCanvas));


			svgMain = d3.select("#svgMain")						
								.append("svg")
								.attr("id","containerSCG")
								.attr("width",(config.profundidadCanvas))
								.attr("height",(config.anchoCanvas))
								;


			


			//***************************************************************

			//dibuja celdas Por Dia
			var dias = Object.keys(diccionarioDias);

			var padding=50;

			var altoPorDia=((config.anchoCanvas-(padding*dias.length)-500 )/dias.length);

			var anchoRectangulo = config.profundidadCanvas*.7;

			var offSetIzq = 450;

			for(var i=0;  i < dias.length; i++){

					var posY = altoPorDia*i;

					diccionarioDias[ dias[i] ].posY = posY+(padding*i);

					diccionarioDias[ dias[i] ].alto = altoPorDia;


					svgMain	.append("rect")						
						.attr("width",anchoRectangulo)
						.attr("height",altoPorDia)
						.attr("x", offSetIzq )
                        .attr("y",  diccionarioDias[ dias[i] ].posY )
                        .style("fill","#9bdceb")
                        .attr("rx",5) 
                        .attr("ry",5)   
                        //.style("stroke","#28EBE1")                                        
                        .style("stroke-width",1)
                        .attr("filter","url(#dropshadow)")
                        .style("stroke-opacity",1)
                        .style("opacity",.1);
						;


					d3.select("#svgMain").append("text")							
								.attr("class","detalle")
								.attr("fill",function(){

									return "#ffffff"	;

								})				
								.style("opacity",.5)
								.style("font-family","Calibri")
								.style("font-weight","bold")
								.style("font-size",57)							
								.style("text-anchor","start")
								.attr("transform", "translate(" + String( 50 )  + ", " + String( diccionarioDias[ dias[i] ].posY+40 ) + ") rotate("+String(0)+")") 
								.text(function(){

								

									return getDia(diccionarioDias[ dias[i] ].fecha.getDay())+" "+diccionarioDias[ dias[i] ].fecha.getDate()+" "+getMes(diccionarioDias[ dias[i] ].fecha.getMonth());

								});

			}

			// COLONIAS

			var anchoPorColonia = anchoRectangulo/ colonias.length;

			for(var i=0;  i < colonias.length; i++){ 

						diccionarioColonias[colonias[i].key]={x: anchoPorColonia*i+offSetIzq , ancho:anchoPorColonia,total:colonias[i].values.length } 
            
            			d3.select("#svgMain").append("line")
					        		.style("stroke","#000000" )
					        		.attr("class","detalle")
							        .style("stroke-width", 4 )
							        .style("stroke-opacity", .5 )
					        		.attr("x1",anchoPorColonia*i+offSetIzq)
					        		.attr("y1",0)
					        		.attr("x2",anchoPorColonia*i+offSetIzq)
					        		.attr("y2",config.anchoCanvas-200)
						        		;


						d3.select("#svgMain").append("text")							
							.attr("class","detalle")
							.attr("fill",function(){

								return "#ffffff"	;

							})				
							.style("opacity",1)
							.style("font-family","Calibri")
							.style("font-weight","normal")
							.style("font-size",39)							
							.style("text-anchor","start")
							.attr("transform", "translate(" + String( anchoPorColonia*i+offSetIzq )  + ", " + String( config.anchoCanvas-260 ) + ") rotate("+String(90)+")") 
							.text(function(){

								nombreColonias[colonias[i].key]=entidades[i];

								return entidades[i];

							});

          	}


			init();		

}

var nombreColonias={};

function TotalesEntidades(){

	for(var e in diccionarioColonias){

		var altura = GetValorRangos( diccionarioColonias[e].total ,  1 , maximoPorEntidad  ,  1 , 600 );

		var geometry = new THREE.BoxGeometry( 30, altura	, 30 );
		var material = new THREE.MeshPhongMaterial( {color: 0xbfbfbf } );
		var cube = new THREE.Mesh( geometry, material );
		cube.position.set( diccionarioColonias[e].x-(config.profundidadCanvas/2) ,altura/2,(config.anchoCanvas/2)-290 );
		sceneGL.add( cube )

		var geometry = new THREE.BoxGeometry( 30, altura*.2	, 30 );
		var material = new THREE.MeshPhongMaterial( {color: 0xff490d} );
		var cube = new THREE.Mesh( geometry, material );
		cube.position.set( diccionarioColonias[e].x-(config.profundidadCanvas/2) ,altura+10+((altura*.2)/2),(config.anchoCanvas/2)-290 );
		sceneGL.add( cube );

		diccionarioColonias[e].posMiddle = cube;

		var alturaTop = getRandomInt(1,30);

		var geometry = new THREE.BoxGeometry( 30,alturaTop ,  30 );
		var material = new THREE.MeshPhongMaterial( {color: 0xff00f7} );
		var cube = new THREE.Mesh( geometry, material );
		cube.position.set( diccionarioColonias[e].x-(config.profundidadCanvas/2) , altura+10+(altura*.2)+(alturaTop/2)+10  ,(config.anchoCanvas/2)-290 );
		sceneGL.add( cube );

		diccionarioColonias[e].posTop = cube;

		diccionarioColonias[e].cuantosTop = alturaTop;

		diccionarioColonias[e].cuantosMiddle =  altura*.2;


	}

}

function DibujaEdades(){

		for(var i=0;  i < edades.length; i++){

				var ancho=edades[i].cantidad*.2;

				svgMain	.append("rect")						
						.attr("width",ancho)
						.attr("height",2)
						.attr("x", config.profundidadCanvas*.78 )
                        .attr("y", (7*i)+config.anchoCanvas*.82 )
                        .style("fill","white")                   
                        .style("stroke-width",1)
                       
                        .style("stroke-opacity",1)
                        .style("opacity",1);
						;

				svgMain	.append("rect")						
						.attr("width",ancho*.2)
						.attr("height",2)
						.attr("x", (config.profundidadCanvas*.78)+(ancho+9) )
                        .attr("y", (7*i)+config.anchoCanvas*.82 )
                        .style("fill","#ff0800")                   
                        .style("stroke-width",1)
                        .attr("filter","url(#glow)")
                        .style("stroke-opacity",1)
                        .style("opacity",1);
						;

				svgMain	.append("rect")						
						.attr("width",ancho*.02)
						.attr("height",2)
						.attr("x", (config.profundidadCanvas*.78)+(ancho+9)+(ancho*.2)+3 )
                        .attr("y", (7*i)+config.anchoCanvas*.82 )
                        .style("fill","#ff57f7")                   
                        .style("stroke-width",1)
                        .attr("filter","url(#glow)")
                        .style("stroke-opacity",1)
                        .style("opacity",1);
						;


		}

}

function DibujaTotales(){

		var alturaTotal=1200;

		svgMain.append("rect")						
						.attr("width",alturaTotal*.8)
						.attr("height",40)
						.attr("x", config.profundidadCanvas*.78 )
                        .attr("y", config.anchoCanvas*.96 )
                        .style("fill","#ffffff")                   
                        .style("stroke-width",1)
                        .attr("filter","url(#glow)")
                        .style("stroke-opacity",1)
                        .style("opacity",1);
						;

		svgMain.append("text")                            
                            .attr("x", config.profundidadCanvas*.78 )
                            .attr("y", config.anchoCanvas*.96+90  )
                            .style("fill","#ffffff")
                            .attr("class","lineTooltip")                             
                            .style("font-family","Calibri")
                            .style("text-anchor","start")
                            .style("font-weight","bold")
                            .style("font-size",61)                           
                            .text( formatNumber(alturaTotal*2) )
                            ;

		svgMain.append("rect")						
						.attr("width",alturaTotal*.2)
						.attr("height",40)
						.attr("x", config.profundidadCanvas*.78+(alturaTotal*.8+20) )
                        .attr("y", config.anchoCanvas*.96 )
                        .style("fill","#ff0800")                   
                        .style("stroke-width",1)
                        .attr("filter","url(#glow)")
                        .style("stroke-opacity",1)
                        .style("opacity",1);
						;

		svgMain.append("text")                            
                            .attr("x", config.profundidadCanvas*.78+(alturaTotal*.8+20) )
                            .attr("y", config.anchoCanvas*.96+90  )
                            .style("fill","#ff0800")
                            .attr("class","lineTooltip")                             
                            .style("font-family","Calibri")
                            .style("text-anchor","start")
                            .style("font-weight","bold")
                            .style("font-size",61)                           
                            .text( formatNumber((alturaTotal*.2))*2 )
                            ;

		svgMain.append("rect")						
						.attr("width",alturaTotal*.02)
						.attr("height",40)
						.attr("x", config.profundidadCanvas*.78+(alturaTotal*.8)+40+(alturaTotal*.2) )
                        .attr("y", config.anchoCanvas*.96 )
                        .style("fill","#ff57f7")                   
                        .style("stroke-width",1)
                        .attr("filter","url(#glow)")
                        .style("stroke-opacity",1)
                        .style("opacity",1);
						;

		svgMain.append("text")                            
                            .attr("x", config.profundidadCanvas*.78+(alturaTotal*.8)+40+(alturaTotal*.2) )
                            .attr("y", config.anchoCanvas*.96+90  )
                            .style("fill","#ff57f7")
                            .attr("class","lineTooltip")                             
                            .style("font-family","Calibri")
                            .style("text-anchor","start")
                            .style("font-weight","bold")
                            .style("font-size",61)                           
                            .text( formatNumber((alturaTotal*.02)*2) )
                            ;

        var caso=0;

        var posAnt0;
        var posAnt1;
        var posAnt2;

        for( var e in diccionarioDias ){

        		var anchoX = caso*130;

        		var X=getRandomInt(60,80)/100;

        		d3.select("#svgMain").append("line")
					        		.style("stroke","#ffffff" )
					        		.attr("class","detalle")
							        .style("stroke-width", 6 )
							        .style("stroke-opacity", 1 )
					        		.attr("x1",config.profundidadCanvas*.78 )
					        		.attr("y1",diccionarioDias[e].posY)
					        		.attr("x2",config.profundidadCanvas*.78+(anchoX*X) )
					        		.attr("y2",diccionarioDias[e].posY)
						        	;

				if(posAnt0){

						d3.select("#svgMain").append("line")
						        		.style("stroke","#ffffff" )
						        		.attr("class","detalle")
								        .style("stroke-width", 2 )
								        .style("stroke-opacity", .6 )
						        		.attr("x1",posAnt0.x)
						        		.attr("y1",posAnt0.y)
						        		.attr("x2",config.profundidadCanvas*.78+(anchoX*X) )
						        		.attr("y2",diccionarioDias[e].posY)
							        	;

				}

				posAnt0={x:config.profundidadCanvas*.78+(anchoX*X) ,y:diccionarioDias[e].posY };




        		d3.select("#svgMain").append("line")
					        		.style("stroke","#ff0000" )
					        		.attr("class","detalle")
							        .style("stroke-width", 6 )
							        .style("stroke-opacity", 1 )
					        		.attr("x1",config.profundidadCanvas*.78+(anchoX*X) )
					        		.attr("y1",diccionarioDias[e].posY)
					        		.attr("x2",config.profundidadCanvas*.78+(anchoX)+(anchoX*.2)+5 )
					        		.attr("y2",diccionarioDias[e].posY)
						        	;


				if(posAnt1){

						d3.select("#svgMain").append("line")
						        		.style("stroke","#ff0000" )
						        		.attr("class","detalle")
								        .style("stroke-width", 2 )
								        .style("stroke-opacity", .6 )
						        		.attr("x1",posAnt1.x)
						        		.attr("y1",posAnt1.y)
						        		.attr("x2",config.profundidadCanvas*.78+(anchoX)+(anchoX*.2)+5 )
						        		.attr("y2",diccionarioDias[e].posY)
							        	;

				}

				posAnt1={x:config.profundidadCanvas*.78+(anchoX)+(anchoX*.2)+5 ,y:diccionarioDias[e].posY };



				d3.select("#svgMain").append("line")
					        		.style("stroke","#f654ff" )
					        		.attr("class","detalle")
							        .style("stroke-width", 6 )
							        .style("stroke-opacity", 1 )
					        		.attr("x1",config.profundidadCanvas*.78+(anchoX)+(anchoX*.2)+10 )
					        		.attr("y1",diccionarioDias[e].posY)
					        		.attr("x2",config.profundidadCanvas*.78+(anchoX)+(anchoX*.2)+anchoX*.05 )
					        		.attr("y2",diccionarioDias[e].posY)
						        	;



				caso++;

        }


}



function DrawToolTip(){

		svgLines.selectAll(".lineTooltip").data([]).exit().remove();
      

        for(var e in diccionarioColonias){

        			var posicion3D = toScreenPosition( diccionarioColonias[e].posTop  ,camera);
        	
		        	svgLines.append("text")                            
                                .attr("x",posicion3D.x )
                                .attr("y", posicion3D.y -30  )
                                .style("fill","#ff8cfd")
                                .attr("class","lineTooltip") 
                                
                                .style("font-family","Calibri")
                                .style("text-anchor","middle")
                                .style("font-weight","bold")
                                .style("font-size",11)
                               
                                .text( Math.round(diccionarioColonias[e].cuantosTop/5) )
                                ;

                    svgLines.append("line")
					        		.style("stroke","#ff8cfd" )					        		
					        		.attr("class","lineTooltip") 
							        .style("stroke-width", .6 )
							        .style("stroke-opacity", .4 )
					        		.attr("x1",posicion3D.x)
					        		.attr("y1",posicion3D.y)
					        		.attr("x2",posicion3D.x)
					        		.attr("y2",posicion3D.y - 30 )
						        		;

                  

        }


}

var entidades=[
"Ciudad de México",
"Estado de México",
"Nuevo León",
"Jalisco",
"Veracruz",
"Guanajuato",
"Campeche",
"Coahuila",
"Puebla",
"Tabasco",
"Tamaulipas",
"Baja California",
"Sonora",
"Chihuahua",
"Michoacán",
"Queretaro",
"Sinaloa",
"San Luis Potosí",
"Chiapas",
"Hidalgo",
"Quintana Roo",
"Oaxaca",
"Yucatán",
"Guerrero",
"Aguascalientes",
"Durango",
"Morelos",
"Zacatecas",
"Baja California Sur",
"Nayarit",
"Colima",
"Tlaxcala"
];



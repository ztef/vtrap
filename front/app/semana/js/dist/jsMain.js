
var svgMain;

var force;

var circulos;


var raycaster = new THREE.Raycaster();

var mouse = new THREE.Vector2(), INTERSECTED;

var coleccionObjetosSeleccionables=[];


var padding = 60, // separation between nodes
    maxRadius = 6;

var nodes=[];

var lineaVertical,lineaHorizontal,tituloProveedor,tituloObjeto,tituloMonto,objetoAseguirLineas;

function InitSVG(){

	$("#svgMain")
			.css("width",(config.radioExterior*2)+100)
			.css("height",(config.radioExterior*2)+100);

	 d3.select("#svgMain")						
						.append("svg")
						.attr("id","containerSCG")
						.attr("width",(config.radioExterior*2)+100)
						.attr("height",(config.radioExterior*2)+100)
						;

	svgMain = d3.select("#svgMain")						
						.append("g")
						.attr("transform", "translate(" + 50 + "," + 50 + ")")						
						
						;

						


	init();

}

function DibujaElementosSVG(){


	//Crea Circulos Horas

	svgMain.append("circle")
				.attr("r",config.radioExterior+20)
				.attr("cx",config.radioExterior)
				.attr("cy",config.radioExterior)
				.style("opacity",.3)
				.style("fill","black")
				;

				

	var circle = svgMain.append("circle")
			.attr("r",config.radioInterior-26)
			.attr("cx",config.radioExterior)
			.attr("cy",config.radioExterior)
			.style("stroke","#1C9CAD")
			.style("fill","none")
			.style("stroke-width",13)
			.style("stroke-opacity",.4);


	svgMain.append("circle")
			.attr("r",config.radioInterior-20)
			.attr("cx",config.radioExterior)
			.attr("cy",config.radioExterior)
			.style("stroke","#1C9CAD")
			.style("fill","none")
			.style("stroke-width",3)
			.style("stroke-opacity",.7);

	svgMain.append("circle")
			.attr("r",config.radioInterior-45)
			.attr("cx",config.radioExterior)
			.attr("cy",config.radioExterior)
			.style("stroke","#CCCCCC")
			.style("fill","none")
			.style("stroke-width",65)
			.style("stroke-opacity",.1);


	var circle = svgMain.append("circle")
			.attr("r",config.radioExterior-10)
			.attr("cx",config.radioExterior)
			.attr("cy",config.radioExterior)
			.style("stroke","#1C9CAD")
			.style("fill","none")
			.style("stroke-width",4)
			.style("stroke-opacity",.8);


	



	var colorIngreso = d3.scale.linear().domain([minimoValorIngreso,maximoValorIngreso]).range(["#608E8F", "00FBFF"]);

	var colorGasto = d3.scale.linear().domain([minimoValorGasto,maximoValorGasto]).range(["#E6561E", "FFD900"]);

	var anchoCirculo = d3.scale.linear().domain([minimoGeneral,maximoGeneral]).range([5 , 60]);

	var anchoCategoria = d3.scale.linear().domain([0,maximoCategoria]).range([1 , 20]);

	var colorCategoriaIngreso = d3.scale.linear().domain([1000,maximoCategoria]).range(["#44349E", "#00FBFF"]);


	var colorCategoriaGasto = d3.scale.linear().domain([1,maximoCategoria]).range(["#E6561E", "#FFD900"]);

	var anchoCirculoCategoria = d3.scale.linear().domain([0,maximoCategoria]).range([1 , 10]);


	var anchoCirculoSubCategoria = d3.scale.linear().domain([0,maximoSubCategoria]).range([5 , 180]);

	var anchoCirculoPartida = d3.scale.linear().domain([minimoGeneral,maximoGeneral]).range([5 , 60]);

	var alturaParticulas = d3.scale.linear().domain([minimoGeneral,maximoGeneral]).range([60 , config.maximaAltura]);

	var radioEsferas = d3.scale.linear().domain([minimoGeneral,maximoGeneral]).range([3 , 35]);


	for(var i=0; i < dataNested.length; i++){


			

			if( dataNested[i].key == "Ingressos" ){

					console.log("Ingressos");

					var prefijo = "Ingressos";

					dataNested[i].anguloInicial = 0;	

					dataNested[i].anguloFinal = Math.round(357*(totalIngresos/(totalIngresos+totalGastos))) ;

			}else{

					console.log("gastos");

					var prefijo = "Despeses";

					dataNested[i].anguloInicial = Math.round(357*(totalIngresos/(totalIngresos+totalGastos)))+1 ;	

					dataNested[i].anguloFinal = Math.round(dataNested[i].anguloInicial+(357*(totalGastos/(totalIngresos+totalGastos))))-1 ;

			}

			var valorAngulo = ( dataNested[i].anguloFinal-dataNested[i].anguloInicial  )/dataNested[i].total;

			var anguloAnterior = dataNested[i].anguloInicial;



			//Pinta lineas de Categorias
			for(var j=0; j < dataNested[i].values.length; j++){

					var pos1 = CreaCoordenada( anguloAnterior , config.radioInterior ,  {	x:config.radioExterior	,	y:config.radioExterior	});
					var pos2 = CreaCoordenada( anguloAnterior, config.radioExterior*.98 ,  {	x:config.radioExterior	,	y:config.radioExterior	});


					if( dataNested[i].key == "Ingressos" ){

						var color = colorCategoriaIngreso( dataNested[i].values[j].total );

					}else{

						var color = colorCategoriaGasto( dataNested[i].values[j].total );

					}
					
					svgMain.append("line")				
						.attr("x1",pos1.x)
						.attr("y1",pos1.y)
						.attr("x2",pos2.x)
						.attr("y2",pos2.y)
						.style("stroke", color  )		
						.style("stroke-width", Math.round(anchoCirculoCategoria(dataNested[i].values[j].total)) )		
						.style("stroke-opacity",1);

					//ARCOS
					var radius =	config.radioExterior*.96;

					var anchoLinea = 30;

					var line=d3.svg.line.radial()
			                .interpolate( arcInterpolator(radius) ) 
			                .tension(2)
			                .radius(radius)
			                .angle(function(d, i) {              
			                  return d * degreeToRadians;
			              });

					var opacidadLinea = 1;			

					var angles = [  anguloAnterior , anguloAnterior + (valorAngulo*dataNested[i].values[j].total)  ];

					svgMain.append("path").datum(angles)
					.attr("class","aro")
					.style("opacity", opacidadLinea)
					.style("stroke-width",function (d){

								this.prefijo = prefijo;

								this.nombre=dataNested[i].values[j].key; 

                      			this.colorLinea=color;                     			

                      			this.total=	dataNested[i].values[j].total;

						        $(".tooltip").css("position","fixed");
						        $(".tooltip").css("z-index",900);


         				 		return 50;


                      })
					.on("mouseover",function(d){ 									                  		                                 

	                          d3.select(this)                              
	                          .style("stroke", "white");

	                          	$("#toolTip").css("visibility","visible");	        
					        	$("#toolTip").css("left",(mouse_x+20)+"px");
					        	$("#toolTip").css("top",mouse_y+"px");			    	

					        	

			    				var toolText =  "<span style='color:white'>"+this.prefijo+"<br>"+this.nombre+"<br>"+ formatNumber(this.total)+" M €";				    	                  
					    	    $("#toolTip").html(toolText);	    					                          

	                          return d; 

	                  })
	                  .on("mouseout",function(d){ 

	                  		$("#toolTip").css("visibility","hidden");       
	                         
	                          d3.select(this)                              
	                          .style("stroke", function(d){

	                          	return this.colorLinea;

	                          });								                          
	                          

	                          return d;
	                      
	                  })
	                  .attr("transform", "translate(" + String( config.radioExterior )  + ", " + String( config.radioExterior ) + ")") 
	                  .style("stroke", color)
	                  .style("fill", "none")
	                  .attr("d",line);

	                  var line=d3.svg.line.radial()
			                .interpolate( arcInterpolator(config.radioInterior) ) 
			                .tension(2)
			                .radius(config.radioInterior)
			                .angle(function(d, i) {              
			                  return d * degreeToRadians;
			              });


	                 svgMain.append("path").datum(angles)
					.attr("class","aro")
					.style("opacity", opacidadLinea)
					.style("stroke-width",function (d){

								this.prefijo = prefijo;

								this.nombre=dataNested[i].values[j].key; 

                      			this.colorLinea=color;                     			

                      			this.total=	dataNested[i].values[j].total;

						        $(".tooltip").css("position","fixed");
						        $(".tooltip").css("z-index",900);


         				 		return 10;


                      })
					.on("mouseover",function(d){ 									                  		                                 

	                          d3.select(this)                              
	                          .style("stroke", "white");

	                          	$("#toolTip").css("visibility","visible");	        
					        	$("#toolTip").css("left",(mouse_x+20)+"px");
					        	$("#toolTip").css("top",mouse_y+"px");			    	

					        	

			    				var toolText =  "<span style='color:white'>"+this.prefijo+"<br>"+this.nombre+"<br>"+ formatNumber(this.total)+" M €";				    	                  
					    	    $("#toolTip").html(toolText);	    					                          

	                          return d; 

	                  })
	                  .on("mouseout",function(d){ 

	                  		$("#toolTip").css("visibility","hidden");       
	                         
	                          d3.select(this)                              
	                          .style("stroke", function(d){

	                          	return this.colorLinea;

	                          });								                          
	                          

	                          return d;
	                      
	                  })
	                  .attr("transform", "translate(" + String( config.radioExterior )  + ", " + String( config.radioExterior ) + ")") 
	                  .style("stroke", color)
	                  .style("fill", "none")
	                  .attr("d",line);


					//Pinta Circulos de Subcategorias
					var valorDelRadio = (config.radioExterior-config.radioInterior)/dataNested[i].values[j].total;

					for(var k=0; k < dataNested[i].values[j].values.length; k++){

							var radioPos = config.radioInterior + ( valorDelRadio*dataNested[i].values[j].values[k].total );

							var anguloSubCategoria = anguloAnterior + ((anguloAnterior + (valorAngulo*dataNested[i].values[j].total))-anguloAnterior)/2;

							var Pos=CreaCoordenada( anguloSubCategoria  , radioPos ,  {	x:config.radioExterior	,	y:config.radioExterior	});

							svgMain.append("circle")
								.attr("r",  anchoCirculoSubCategoria( dataNested[i].values[j].values[k].total )  )
								.attr("cx",Pos.x)
								.attr("cy",Pos.y)
								.style("stroke","none")
								.style("fill",function(){

									this.prefijo = prefijo;

									this.nombre=dataNested[i].values[j].values[k].key; 

									this.colorLinea=color;                     			

	                      			this.total=	dataNested[i].values[j].values[k].total;

							        $(".tooltip").css("position","fixed");
							        $(".tooltip").css("z-index",900);

									return color;

								})								
								.style("fill-opacity",.2)
								.on("mouseover",function(d){ 									                  		                                 

			                          d3.select(this)                              
			                          .style("fill", "white");

			                          	$("#toolTip").css("visibility","visible");	        
							        	$("#toolTip").css("left",(mouse_x+20)+"px");
							        	$("#toolTip").css("top",mouse_y+"px");			    	

							        	

					    				var toolText =  "<span style='color:white'>"+this.prefijo+"<br>"+this.nombre+"<br>"+ formatNumber(this.total)+" M €";				    	                  
							    	    $("#toolTip").html(toolText);	    					                          

			                          return d; 

			                  })
			                  .on("mouseout",function(d){ 

			                  		$("#toolTip").css("visibility","hidden");       
			                         
			                          d3.select(this)                              
			                          .style("fill", function(d){

			                          	return this.colorLinea;

			                          });								                          
			                          

			                          return d;
			                      
			                  });


			                  //Dibuja las partidas
			                  for(var l=0; l < dataNested[i].values[j].values[k].values.length; l++){

			                  				var colorLinea = color.replace("#","");

			                  				var material = new THREE.LineBasicMaterial({

													        color: Number("0x"+colorLinea),transparent:true,opacity:.5

													    });

			                  				var geometry = new THREE.Geometry();
									        geometry.vertices.push(new THREE.Vector3(0, 0 , 0));
									        geometry.vertices.push(new THREE.Vector3( 0, alturaParticulas(dataNested[i].values[j].values[k].values[l].monto), 0 ));

									        var line = new THREE.Line(geometry, material);

									       

									        sceneGL.add(line);

									        var geometry = new THREE.SphereGeometry(radioEsferas(dataNested[i].values[j].values[k].values[l].monto), 20, 20, 0, Math.PI * 2, 0, Math.PI * 2);
											var material = new THREE.MeshBasicMaterial( {color: Number("0x"+colorLinea) } );
											var esfera = new THREE.Mesh(geometry, material);

											esfera.data = dataNested[i].values[j].values[k].values[l];

											

											esfera.color = color;

											

											esfera.position.y=alturaParticulas(dataNested[i].values[j].values[k].values[l].monto);

											sceneGL.add(esfera);

											coleccionObjetosSeleccionables.push(esfera);




			                  				var Pos2=CreaCoordenada( anguloSubCategoria  , getRandomInt(config.radioInterior,config.radioExterior) ,  {	x:config.radioExterior	,	y:config.radioExterior	});

							                  nodes.push({

					                  				radius:anchoCirculoPartida( dataNested[i].values[j].values[k].values[l].monto ),
					                  				cx:Pos.x,
					                  				cy:Pos.y,
					                  				x: Pos2.x,
					                  				y: Pos2.y,					                  				
					                  				origenX:Pos.x,
					                  				origenY: Pos.y,
					                  				line:line,
					                  				esfera:esfera,
					                  				color: color,
					                  				prefijo:prefijo,
					                  				nombre:dataNested[i].values[j].values[k].values[l].descripcion,
					                  				total:dataNested[i].values[j].values[k].values[l].monto,
					                  				line3D:line,
					                  				esfera:esfera,
					                  				svg:circle

					                  		 });


			                  }

					}


					anguloAnterior = anguloAnterior + (valorAngulo*dataNested[i].values[j].total);

			}

	}

	force = d3.layout.force()
		    .nodes(nodes)
		    .size([windowWidth, windowHeight])
		    .gravity(0)
		    .charge(-19)
		    .friction(.3)
		    .on("tick", tick)
		    .start();


		    circulos = svgMain.selectAll(".circulos")
							    .data(nodes)
							    .enter().append("circle")
							    .attr("class","circulos")
								.attr("r",  function(d){

									return anchoCirculoPartida( d.total );

								})
								.attr("cx",function(d){



									return d.cx;

								})
								.attr("cy",function(d){

									return d.cy;

								})
								.style("stroke","black")
								.style("stroke-width",.5)
								.style("stroke-opacity",.7)
								.style("fill",function(d){

									this.prefijo = d.prefijo;

									this.r = anchoCirculoPartida( d.total );

									this.nombre=d.nombre; 

									this.colorLinea=d.color;                     			

	                      			this.total=	d.total;

	                      			d.DOM = this;

							        $(".tooltip").css("position","fixed");
							        $(".tooltip").css("z-index",900);

									return d.color;

								})								
								.style("fill-opacity",1)
								.on("mouseover",function(d){ 									                  		                                 

			                          d3.select(this)                              
			                          .style("fill", "white");

			                          	$("#toolTip").css("visibility","visible");	        
							        	$("#toolTip").css("left",(mouse_x+20)+"px");
							        	$("#toolTip").css("top",mouse_y+"px");			    	

							        	

					    				var toolText =  "<span style='color:white'>"+this.prefijo+"<br>"+this.nombre+"<br>"+ formatNumber(this.total)+" M €";				    	                  
							    	    $("#toolTip").html(toolText);	    					                          

			                          return d; 

			                  })
			                  .on("mouseout",function(d){ 

			                  		$("#toolTip").css("visibility","hidden");       
			                         
			                          d3.select(this)                              
			                          .style("fill", function(d){

			                          	return this.colorLinea;

			                          });								                          
			                          

			                          return d;
			                      
			                  });

			                  setInterval(function(){ ActualizaPosiciones(); }, 4000);

			                  

}

var elementoBuscado;

var elementoResaltadoInterval;

var busquedaEnCurso=false;

function SimulaBusqueda(){

	busquedaEnCurso=!busquedaEnCurso;

	if(elementoBuscado){
				d3.select(elementoBuscado.DOM)
				.style("fill",elementoBuscado.DOM.colorLinea)
				.attr("r",elementoBuscado.radius);

				var material = new THREE.MeshBasicMaterial( { color: elementoBuscado.color_hex } );

	            elementoBuscado.esfera.material=material;

	            var material = new THREE.LineBasicMaterial( { color: elementoBuscado.color_hex } );

	            elementoBuscado.line.material=material;


				elementoBuscado=undefined;
	}


	if(busquedaEnCurso){

			$("#busqueda").addClass("seleccionado");
			$("#busqueda_2").addClass("seleccionado");			

			
			

			elementoBuscado =  nodes[getRandomInt(0,nodes.length-1)];

			   
			

			elementoResaltadoInterval = setInterval(function(){ 

						d3.select(elementoBuscado.DOM)
							.style("fill","white")
							.style("fill-opacity",1)
							.attr("r",0)
							.transition()
							.duration(1200)
							.style("fill-opacity",0)
							.attr("r",250)
							;


			 }, 2000);


			var material = new THREE.MeshBasicMaterial( { color: 0xFFFFFF } );

            elementoBuscado.esfera.material=material;

            var material = new THREE.LineBasicMaterial( { color: 0xFFFFFF } );

            elementoBuscado.line.material=material; 

	}else{

			$("#busqueda").removeClass("seleccionado");
			$("#busqueda_2").removeClass("seleccionado");	


			clearInterval(elementoResaltadoInterval);

	}

}



function onDocumentMouseDown( event ) {

			event.preventDefault();

		    mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
		    mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;

		    raycaster.setFromCamera( mouse, camera );

		    var intersects = raycaster.intersectObjects(coleccionObjetosSeleccionables);
		    
		    if ( intersects.length > 0 ) {

				    	$('#fotos').css("visibility","visible");
		                                  $("#fotos").css("left",(mouse_x-290)+"px");
		                                  $("#fotos").css("top",mouse_y+"px");



				    	var dataAro=[getRandomInt(0,10),getRandomInt(0,10),getRandomInt(0,10)];

				    	if(  !document.getElementById("aro").contentWindow.graficaSVG )
				    		document.getElementById("aro").contentWindow.Inicializa(500);

		              	$('#aro')[0].contentWindow.RenderActualiza(dataAro);                         

		              	$('#aro').css("visibility","visible");

		             	 $("#aro").css("left",(mouse_x)+"px");

		              	$("#aro").css("top",String(  mouse_y+(60*.2) )+"px");

		              	$('#aro')[0].contentWindow.AdjustSize(40*2,40*2,40); 

		              	$('#barras')[0].contentWindow.goto();

		              	$("#barras").css("left",(mouse_x+140)+"px");

		              	$('#barras').css("visibility","visible"); 

		              	$("#barras").css("top",mouse_y-100+"px");

		              	$("#svgGraficaFrontal").css("opacity",.1);
		              	

		    }else{

		    	$('#aro').css("visibility","hidden");
		    	$('#fotos').css("visibility","hidden");
		    	$('#barras').css("visibility","hidden"); 

		    	$("#svgGraficaFrontal").css("opacity",1);
		       
		    }


}




var ultimoSeleccionado=new Object();

function onDocumentMouseMove( event ) {
    event.preventDefault();

    mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
    mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;

    raycaster.setFromCamera( mouse, camera );

    var intersects = raycaster.intersectObjects(coleccionObjetosSeleccionables);
    if ( intersects.length > 0 ) {

    			modoSeleccionaSVG=false;

       			$("#svgGraficaFrontal").css('z-index', -2);

    			if(ultimoSeleccionado){

    				 var material = new THREE.MeshBasicMaterial( { color: ultimoSeleccionado.color } );                                       
                     ultimoSeleccionado.material=material; 

    			}     

                if(intersects[ 0 ].object){

                	$("#toolTip").css("visibility","visible");	        
					$("#toolTip").css("left",(mouse_x+20)+"px");
					$("#toolTip").css("top",(mouse_y-60)+"px");	

					var toolText =  "<span style='color:white'>"+intersects[ 0 ].object.data.tipo+"<br>"+intersects[ 0 ].object.data.descripcion+"<br>"+ formatNumber(intersects[ 0 ].object.data.monto)+" M €";				    	                  
					$("#toolTip").html(toolText);	   

                	 var material = new THREE.MeshBasicMaterial( { color: 0xFFFFFF } );                                       
                     intersects[ 0 ].object.material=material; 

                     ultimoSeleccionado=intersects[ 0 ].object;

                }

    }else{

    		modoSeleccionaSVG=true;

	    	$("#svgGraficaFrontal").css('z-index', 4);

    		if(ultimoSeleccionado){

    				 var material = new THREE.MeshBasicMaterial( { color: ultimoSeleccionado.color } );                                       
                     ultimoSeleccionado.material=material; 

    		}  

    		if(!modoSeleccionaSVG)
    			$("#toolTip").css("visibility","hidden");	 

    }

}










function ActualizaPosiciones(){

	for(var i=0; i< nodes.length; i++){

		nodes[i].cx = nodes[i].origenX+getRandomInt(-65,55);
		nodes[i].cy = nodes[i].origenY+getRandomInt(-65,55);

	}

	force.start();

}



function tick(e) {

  circulos
      .each(gravity(.2 * e.alpha))
      .each(collide(.5))
      .attr("cx", function(d)  { 	 			
	
      			if(d.line3D){

      				d.line3D.position.set(d.x-config.radioExterior ,0, d.y-config.radioExterior);    

      				d.esfera.position.x= d.x-config.radioExterior;

      				d.esfera.position.z= d.y-config.radioExterior;		

      			}

		        return d.x; 

      })
      .attr("cy", function(d) {       			

      			return d.y; 

      });  

}


// Move nodes toward cluster focus.
function gravity(alpha) {  

  return function(d) {

    d.y += (d.cy - d.y) * alpha;
    d.x += (d.cx - d.x) * alpha;

  };

}



// Resolve collisions between nodes.
function collide(alpha) {	

  var quadtree = d3.geom.quadtree(nodes);

  return function(d) {

		  	if(!permiteCoalicion){

						    var r = d.radius + maxRadius + padding,
						        nx1 = d.x - r,
						        nx2 = d.x + r,
						        ny1 = d.y - r,
						        ny2 = d.y + r;

				      		quadtree.visit(function(quad, x1, y1, x2, y2) {

					      if (quad.point && (quad.point !== d)) {
					        var x = d.x - quad.point.x,
					            y = d.y - quad.point.y,
					            l = Math.sqrt(x * x + y * y),
					            r = d.radius + quad.point.radius + (d.color !== quad.point.color) * padding;
					        if (l < r) {
					          l = (l - r) / l * alpha;
					          d.x -= x *= l;
					          d.y -= y *= l;
					          quad.point.x += x;
					          quad.point.y += y;
					        }
					      }

				      		return x1 > nx2 || x2 < nx1 || y1 > ny2 || y2 < ny1;

				    });

				  };

			}

}


var  permiteCoalicion=false;

;
var totalIngresos=0;

var totalGastos=0;

var dataNested;

//Maximos Minimos

var maximoValorIngreso=0;

var minimoValorIngreso=100000000000;

var maximoValorGasto=0;

var minimoValorGasto=100000000000;

var maximoGeneral = 0;

var minimoGeneral=100000000000;

var maximoCategoria=0;

var maximoSubCategoria=0;

var Rows;

function Consulta(){

		d3.csv("docs/balance.csv") 
                      		.row(function(d) { return d; })
                      		.get(function(error, rows) {

                      		console.log("rows",rows);

                      		for(var i=0; i < rows.length; i++){

		                      			rows[i].monto=Number( rows[i].monto.replaceAll(",","").replaceAll("€","") );

		                      			rows[i].monto=Math.round(rows[i].monto/1000);

		                      			if(  rows[i].tipo == "Ingressos" ){

				                      				totalIngresos+=Number(rows[i].monto);	

				                      				if( maximoValorIngreso  < rows[i].monto ){

			                      						maximoValorIngreso = rows[i].monto;
			                      						
			                      					}

			                      					if( minimoValorIngreso  > rows[i].monto ){

			                      							minimoValorIngreso = rows[i].monto;
			                      						
			                      					}	                      				

		                      			}else{

				                      				totalGastos+=Number(rows[i].monto);

				                      				if( maximoValorGasto  < rows[i].monto ){

			                      						maximoValorGasto = rows[i].monto;
			                      						
			                      					}

			                      					if( minimoValorGasto  > rows[i].monto ){

			                      							minimoValorGasto = rows[i].monto;
			                      						
			                      					}

		                      			}

		                      			if( maximoGeneral  < rows[i].monto ){

                      						maximoGeneral = rows[i].monto;
                      						
                      					}

                      					if( minimoGeneral  > rows[i].monto ){

                      							minimoGeneral = rows[i].monto;
                      						
                      					}

		                      			


                      		}

                      		Rows=rows;

                      		dataNested=d3.nest()
									.key(function(d) { return d.tipo; })
									.key(function(d) { return d.categoria; })
									.key(function(d) { return d.subcategoria; })
									.entries(rows);

							for(var i=0; i < dataNested.length; i++){

										dataNested[i].total=0;

										for(var j=0; j < dataNested[i].values.length; j++){

													dataNested[i].values[j].total=0;

													for(var k=0; k < dataNested[i].values[j].values.length; k++){

																dataNested[i].values[j].values[k].total=0;

																for(var l=0; l < dataNested[i].values[j].values[k].values.length; l++){

																		dataNested[i].total+=dataNested[i].values[j].values[k].values[l].monto;
																		dataNested[i].values[j].total+=dataNested[i].values[j].values[k].values[l].monto;
																		dataNested[i].values[j].values[k].total+=dataNested[i].values[j].values[k].values[l].monto;

																}

																if( maximoSubCategoria  < dataNested[i].values[j].values[k].total ){

						                      						maximoSubCategoria = dataNested[i].values[j].values[k].total;
						                      						
						                      					}

													}

													dataNested[i].values[j].values.sort(function(obj1, obj2) {	

														return obj2.total - obj1.total;

													});


													if( maximoCategoria  < dataNested[i].values[j].total ){

			                      						maximoCategoria = dataNested[i].values[j].total;
			                      						
			                      					}

										}

										dataNested[i].values.sort(function(obj1, obj2) {	

											return obj2.total - obj1.total;
											
										});

							}


                      		$("#ingresos").html(formatNumber(totalIngresos)+" M €");

        					$("#gastos").html(formatNumber(totalGastos)+" M €");

        					DibujaElementosSVG();


        });


 }


function FiltraDatos(){

	EliminaParticulas();

	dataGraph=[];

	for(var i=0; i < dataRaw.length; i++){

			if(dataRaw[i].unixTime >= fechaInicial.getTime() && dataRaw[i].unixTime <= fechaFinal.getTime()){

					dataGraph.push(dataRaw[i]);

			}

	}

	DibujaParticulas();

	DibujaElementosSVG();

	DibujaParticulasIndicadores();


}






;var etiquetaTiempo="";

var degreeToRadians = Math.PI/180;

function SeleccionaRangoFechas(dias){

        lapsoDeTiempoSeleccionado=dias;

        switch(dias){
             case 1:

                $("#dia_btn").css("color","yellow");
                $("#semana_btn").css("color","gray");
                $("#mes_btn").css("color","gray");
                $("#anio_btn").css("color","gray");

                etiquetaTiempo="Llamadas de las Ultimas Horas";

               

            break;
            case 7:

                 $("#dia_btn").css("color","gray");
                $("#semana_btn").css("color","yellow");
                $("#mes_btn").css("color","gray");
                $("#anio_btn").css("color","gray");

                etiquetaTiempo="Llamadas de la Semana";

               

            break;
            case 30:

                 $("#dia_btn").css("color","gray");
                $("#semana_btn").css("color","gray");
                $("#mes_btn").css("color","yellow");
                $("#anio_btn").css("color","gray");

                etiquetaTiempo="Llamadas del Mes";

                         

            break;
            case 365:

                $("#dia_btn").css("color","gray");
                $("#semana_btn").css("color","gray");
                $("#mes_btn").css("color","gray");
                $("#anio_btn").css("color","yellow");

                etiquetaTiempo="Llamadas del Año";
                        

            break;

        }

       
        $("#etiquetaTiempo").html(etiquetaTiempo);

        ConsultaDatosPrincipalesMpos();        


}


var getUrlParameter = function getUrlParameter(sParam) {
    var sPageURL = decodeURIComponent(window.location.search.substring(1)),
        sURLVariables = sPageURL.split('&'),
        sParameterName,
        i;

    for (i = 0; i < sURLVariables.length; i++) {
        sParameterName = sURLVariables[i].split('=');

        if (sParameterName[0] === sParam) {
            return sParameterName[1] === undefined ? true : sParameterName[1];
        }
    }
};

function round_dec(num) {
  return Math.round(num * 10) / 10;
}


function toScreenPosition(obj, camera)
{
    var vector = new THREE.Vector3();

    var widthHalf = 0.5*windowWidth;
    var heightHalf = 0.5*windowHeight;

    obj.updateMatrixWorld();
    vector.setFromMatrixPosition(obj.matrixWorld);
    vector.project(camera);

    vector.x = ( vector.x * widthHalf ) + widthHalf;
    vector.y = - ( vector.y * heightHalf ) + heightHalf;

    return { 
        x: vector.x,
        y: vector.y
    };

};

function isFullScreen() {
return Math.abs(screen.width - window.innerWidth) < 10; 
}

function fullScreen() {
    var el = document.documentElement
        , rfs = // for newer Webkit and Firefox
               el.requestFullScreen
            || el.webkitRequestFullScreen
            || el.mozRequestFullScreen
            || el.msRequestFullScreen
    ;
    if (typeof rfs != "undefined" && rfs) {
        rfs.call(el);
    } else if (typeof window.ActiveXObject != "undefined") {
        // for Internet Explorer
        var wscript = new ActiveXObject("WScript.Shell");
        if (wscript != null) {
            wscript.SendKeys("{F11}");
        }
    }

}


function latLng2Point(latLng, map) {
  var topRight = map.getProjection().fromLatLngToPoint(map.getBounds().getNorthEast());
  var bottomLeft = map.getProjection().fromLatLngToPoint(map.getBounds().getSouthWest());
  var scale = Math.pow(2, map.getZoom());
  var worldPoint = map.getProjection().fromLatLngToPoint(latLng);
  return new google.maps.Point((worldPoint.x - bottomLeft.x) * scale, (worldPoint.y - topRight.y) * scale);
}

function point2LatLng(point, map) {
  var topRight = map.getProjection().fromLatLngToPoint(map.getBounds().getNorthEast());
  var bottomLeft = map.getProjection().fromLatLngToPoint(map.getBounds().getSouthWest());
  var scale = Math.pow(2, map.getZoom());
  var worldPoint = new google.maps.Point(point.x / scale + bottomLeft.x, point.y / scale + topRight.y);
  return map.getProjection().fromPointToLatLng(worldPoint);
}


var rad = function(x) {
  return x * Math.PI / 180;
};

var getDistance = function(p1, p2) {
  var R = 6378137; // Earth’s mean radius in meter
  var dLat = rad(p2.lat() - p1.lat());
  var dLong = rad(p2.lng() - p1.lng());
  var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(rad(p1.lat())) * Math.cos(rad(p2.lat())) *
    Math.sin(dLong / 2) * Math.sin(dLong / 2);
  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  var d = R * c;
  return d; // returns the distance in meter
};


Date.prototype.addDays = function(days) {
    this.setDate(this.getDate() + parseInt(days));
    return this;
};

Date.prototype.removeDays = function(days) {
    this.setDate(this.getDate() - parseInt(days));
    return this;
};

function distanciaGeodesica(lat1, long1, lat2, long2){ 
    var degtorad = 0.01745329; 
    var radtodeg = 57.29577951; 
    var dlong = (long1 - long2); 
    var dvalue = (Math.sin(lat1 * degtorad) * Math.sin(lat2 * degtorad)) 
        + (Math.cos(lat1 * degtorad) * Math.cos(lat2 * degtorad) 
            * Math.cos(dlong * degtorad));     
    var dd = Math.acos(dvalue) * radtodeg;   
    var miles = (dd * 69.16); 
    var km = (dd * 111.302);    
    
    return km; 
}

String.prototype.replaceAll = function (find, replace) {
    var str = this;
    return str.replace(new RegExp(find.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&'), 'g'), replace);
};


function componentToHex(c) {
    var hex = c.toString(16);
    return hex.length == 1 ? "0" + hex : hex;
}

function rgbToHex(r, g, b) {
    return "#" + componentToHex(r) + componentToHex(g) + componentToHex(b);
}

function hexToRgb(hex) {
    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
        a:1
    } : null;
}


// google.maps.Polygon.prototype.getBounds = function(latLng) {
//     var bounds = new google.maps.LatLngBounds();
//     var paths = this.getPaths();
//     var path;
//     for (var p = 0; p < paths.getLength(); p++) {
//         path = paths.getAt(p);
//         for (var i = 0; i < path.getLength(); i++) {
//             bounds.extend(path.getAt(i));
//         }
//     }
//     return bounds;
// }


function polygonCenter(poly) {
    var lowx,
        highx,
        lowy,
        highy,
        lats = [],
        lngs = [],
        vertices = poly.getPath();

    for(var i=0; i<vertices.length; i++) {
      lngs.push(vertices.getAt(i).lng());
      lats.push(vertices.getAt(i).lat());
    }

    lats.sort();
    lngs.sort();
    lowx = lats[0];
    highx = lats[vertices.length - 1];
    lowy = lngs[0];
    highy = lngs[vertices.length - 1];
    center_x = lowx + ((highx-lowx) / 2);
    center_y = lowy + ((highy - lowy) / 2);
    return (new google.maps.LatLng(center_x, center_y));
  }

function arcInterpolator(r) {
   
    return function(points) {
   
        var allCommands = [];
        
        var startAngle;
                             
        points.forEach(function(point, i) {            
          
            var angle = Math.atan2(point[0], point[1]);

            var command;
            
            if (i) command = ["A", //draw an arc from the previous point to this point
                        r,
                        r,
                        0,
                       +(Math.abs((angle) - (startAngle)) > Math.PI),                           
                       +(angle < startAngle),
                       point[0], 
                       point[1] 
                       ];
            
            else command = point; 
            
            startAngle = angle;
            
            allCommands.push( command.join(" ") ); 

        });
                                      
        return allCommands.join(" ");
    };
}

function CreaCoordenada(angulo,radio,_centroide)
{  


    if (typeof(_centroide)==='undefined') _centroide = centroide;

    var rad  = (angulo-90) * (Math.PI / 180);
    //  origen  +  radio  *  Math.cos(rad);
    var Temp=new Object();
    Temp.x = (0 + radio * Math.cos(rad))+_centroide.x;
    Temp.y = (0 + radio * Math.sin(rad))+_centroide.y;

    return Temp;               

}

 function getDia(dia){
  switch(dia){
    case 0:
        return "Dom";
    break;
    case 1:
        return "Lun";
    break;
    case 2:
        return "Mar";
    break;
    case 3:
        return "Mie";
    break;
    case 4:
        return "Jue";
    break;
    case 5:
        return "Vie";
    break;
    case 6:
        return "Sab";
    break;

  }
}

function getMes(mes){
  switch(mes){
    case 0:
        return "Ene";
    break;
    case 1:
        return "Feb";
    break;
    case 2:
        return "Mar";
    break;
    case 3:
        return "Abr";
    break;
    case 4:
        return "May";
    break;
    case 5:
        return "Jun";
    break;
    case 6:
        return "Jul";
    break;
     case 7:
        return "Ago";
    break;
     case 8:
        return "Sep";
    break;
     case 9:
        return "Oct";
    break;
     case 10:
        return "Nov";
    break;
     case 11:
        return "Dic";
    break;

  }
}


function toTitleCase(str)
{
    return str.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
}


function getPointerLocation(currentLatLng) {
    var scale = Math.pow(2, mapa_.getZoom());
   
  

    var nw = new google.maps.LatLng(
        mapa_.getBounds().getNorthEast().lat(),
        mapa_.getBounds().getSouthWest().lng()
    );    

    var worldCoordinateNW = mapa_.getProjection().fromLatLngToPoint(nw);    

    var worldCoordinate = mapa_.getProjection().fromLatLngToPoint(currentLatLng);
    var currentLocation = new google.maps.Point(
        Math.floor((worldCoordinate.x - worldCoordinateNW.x) * scale),
        Math.floor((worldCoordinate.y - worldCoordinateNW.y) * scale)
    );
    
    return currentLocation;
}



function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}


function GetValorRangos(valor,X1,X2,Y1,Y2){ 
    var  m =  (Y2 - Y1 ) / (X2-X1)
    var b=Y1-m*X1
    var NuevaPos=(m*valor)+b
    return NuevaPos;
}

function formatNumber(number)
{   
  try{
    number = number.toFixed(2) + '';

    x = number.split('.');
    x1 = x[0];
    x2 = x.length > 1 ? '.' + x[1] : '';
    var rgx = /(\d+)(\d{3})/;
    while (rgx.test(x1)) {
        x1 = x1.replace(rgx, '$1' + ',' + '$2');
    }
    //return x1 + x2;
    return x1;
    }catch(e){
    
  }
}

d3.selection.prototype.moveToFront = function() {
  return this.each(function(){
    this.parentNode.appendChild(this);
  });
};

//  *************  convertidor de coordennadas utm a cooords geograficas****************
function utmToLatLng(zone, easting, northing, northernHemisphere){
        if (!northernHemisphere){
            northing = 10000000 - northing;
        }

        var a = 6378137;
        var e = 0.081819191;
        var e1sq = 0.006739497;
        var k0 = 0.9996;

        var arc = northing / k0;
        var mu = arc / (a * (1 - Math.pow(e, 2) / 4.0 - 3 * Math.pow(e, 4) / 64.0 - 5 * Math.pow(e, 6) / 256.0));

        var ei = (1 - Math.pow((1 - e * e), (1 / 2.0))) / (1 + Math.pow((1 - e * e), (1 / 2.0)));

        var ca = 3 * ei / 2 - 27 * Math.pow(ei, 3) / 32.0;

        var cb = 21 * Math.pow(ei, 2) / 16 - 55 * Math.pow(ei, 4) / 32;
        var cc = 151 * Math.pow(ei, 3) / 96;
        var cd = 1097 * Math.pow(ei, 4) / 512;
        var phi1 = mu + ca * Math.sin(2 * mu) + cb * Math.sin(4 * mu) + cc * Math.sin(6 * mu) + cd * Math.sin(8 * mu);

        var n0 = a / Math.pow((1 - Math.pow((e * Math.sin(phi1)), 2)), (1 / 2.0));

        var r0 = a * (1 - e * e) / Math.pow((1 - Math.pow((e * Math.sin(phi1)), 2)), (3 / 2.0));
        var fact1 = n0 * Math.tan(phi1) / r0;

        var _a1 = 500000 - easting;
        var dd0 = _a1 / (n0 * k0);
        var fact2 = dd0 * dd0 / 2;

        var t0 = Math.pow(Math.tan(phi1), 2);
        var Q0 = e1sq * Math.pow(Math.cos(phi1), 2);
        var fact3 = (5 + 3 * t0 + 10 * Q0 - 4 * Q0 * Q0 - 9 * e1sq) * Math.pow(dd0, 4) / 24;

        var fact4 = (61 + 90 * t0 + 298 * Q0 + 45 * t0 * t0 - 252 * e1sq - 3 * Q0 * Q0) * Math.pow(dd0, 6) / 720;

        var lof1 = _a1 / (n0 * k0);
        var lof2 = (1 + 2 * t0 + Q0) * Math.pow(dd0, 3) / 6.0;
        var lof3 = (5 - 2 * Q0 + 28 * t0 - 3 * Math.pow(Q0, 2) + 8 * e1sq + 24 * Math.pow(t0, 2)) * Math.pow(dd0, 5) / 120;
        var _a2 = (lof1 - lof2 + lof3) / Math.cos(phi1);
        var _a3 = _a2 * 180 / Math.PI;

        var latitude = 180 * (phi1 - fact1 * (fact2 + fact3 + fact4)) / Math.PI;

        if (!northernHemisphere){
          latitude = -latitude;
        }

        var longitude = ((zone > 0) && (6 * zone - 183.0) || 3.0) - _a3;

        var obj = {
              latitude : latitude,
              longitude: longitude
        };


        return obj;
      }


convertPixels = function(x, y) {

    return overlay.getProjection().fromDivPixelToLatLng(new google.maps.Point(x, y));

};

var poligonos=new Object();
poligonos.poligonoN0;
poligonos.poligonoN1;

function CalcularGrados(lat,lng,intensidad){
   
    PintaPoligonosTemporales(String(lat+","+lng),120,0xFF0000,1,"poligonoN1"); //Calcular Minutos  1
    PintaPoligonosTemporales(String(lat+","+lng),1200,0xFF0000,.5,"poligonoN0"); //Calcular Segundos  0      

}

function PintaPoligonosTemporales(cad,divisor,colorLinea,alphaLinea,poligono){ 
    

    var Coords=CalculaCoordenadas(cad,divisor);
    
    CoordsPoligono = new Array();

    var coords=new Array();

    var latLng=new google.maps.LatLng(Coords.Y1,Coords.X1);     
    coords.push(latLng);
   

    var latLng=new google.maps.LatLng(Coords.Y1,Coords.X2);     
    coords.push(latLng);

    var latLng=new google.maps.LatLng(Coords.Y2,Coords.X2);     
    coords.push(latLng);
         

    var latLng=new google.maps.LatLng(Coords.Y2,Coords.X1);     
    coords.push(latLng);

    var latLng=new google.maps.LatLng(Coords.Y1,Coords.X1);     
    coords.push(latLng);    
    
    if(poligonos[poligono]){poligonos[poligono].setMap(null)}

    //Calcula la intensidad del color:
    var intensidad=0;
    if(poligono=="poligonoN0")
    
    if(coleccionN0[Coords.Y1+","+Coords.X1] && poligono=="poligonoN0"){
        intensidad=(GetValorRangos(coleccionN0[Coords.Y1+","+Coords.X1].valor,1,maximaCantidadN0, 1,10)/10);
        alphaLinea=0;
    }

    var strokeWeight=.6;
    if(coleccionN1[Coords.Y1+","+Coords.X1] && poligono=="poligonoN1"){

        strokeWeight=(GetValorRangos(coleccionN1[Coords.Y1+","+Coords.X1].valor,1,maximaCantidadN1, 1,30))/10;
        alphaLinea=(GetValorRangos(coleccionN1[Coords.Y1+","+Coords.X1].valor,1,maximaCantidadN1, 2,10))/10;
        
    }

    poligonos[poligono] = new google.maps.Polygon({
                          paths: coords,
                          strokeColor:  colorLinea,
                          strokeOpacity: alphaLinea,
                          strokeWeight: strokeWeight,
                          fillColor: 'red',
                          fillOpacity: intensidad                                                 
                        });        

    poligonos[poligono].setMap(mapa_); 

}

var TodosN1Dibujados=[];
var TodosN0Dibujados=[];

function DibujaTodosN1(){

        for(var e in coleccionN1){

                var Coords=coleccionN1[e].coordenadas;
            
                CoordsPoligono = new Array();

                var coords=new Array();

                var latLng=new google.maps.LatLng(Coords.Y1,Coords.X1);     
                coords.push(latLng);

               

                var latLng=new google.maps.LatLng(Coords.Y1,Coords.X2);     
                coords.push(latLng);

                var latLng=new google.maps.LatLng(Coords.Y2,Coords.X2);     
                coords.push(latLng);                 

                var latLng=new google.maps.LatLng(Coords.Y2,Coords.X1);     
                coords.push(latLng);

                var latLng=new google.maps.LatLng(Coords.Y1,Coords.X1);     
                coords.push(latLng);           

                //Calcula la intensidad del color:

                var intensidad=(GetValorRangos(coleccionN1[Coords.Y1+","+Coords.X1].valor,1,maximaCantidadN1, 0,5))/10;             

                TodosN1Dibujados.push(new google.maps.Polygon({
                                      paths: coords,                                  
                                      strokeOpacity: 0,
                                      strokeWeight: 0,
                                      fillColor: 'red',
                                      fillOpacity: intensidad                                                 
                                    })
                );        

                TodosN1Dibujados[TodosN1Dibujados.length-1].setMap(mapa_);
                

        }


        for(var e in coleccionN0){

                var Coords=coleccionN0[e].coordenadas;
            
                CoordsPoligono = new Array();

                var coords=new Array();

                var latLng=new google.maps.LatLng(Coords.Y1,Coords.X1);     
                coords.push(latLng);               

                var latLng=new google.maps.LatLng(Coords.Y1,Coords.X2);     
                coords.push(latLng);

                var latLng=new google.maps.LatLng(Coords.Y2,Coords.X2);     
                coords.push(latLng);                 

                var latLng=new google.maps.LatLng(Coords.Y2,Coords.X1);     
                coords.push(latLng);

                var latLng=new google.maps.LatLng(Coords.Y1,Coords.X1);     
                coords.push(latLng);    

                     

                //Calcula la intensidad del color:

                var intensidad=(GetValorRangos(coleccionN0[Coords.Y1+","+Coords.X1].valor,1,maximaCantidadN0, 0,30))/10;             

                TodosN0Dibujados.push(new google.maps.Polygon({
                                      paths: coords,                                  
                                      strokeOpacity: 0,
                                      strokeWeight: 0,
                                      fillColor: 'red',
                                      fillOpacity: intensidad                                                 
                                    })
                );        

                TodosN0Dibujados[TodosN0Dibujados.length-1].setMap(mapa_);
                

        }

}

function limpiaCaracteresEspeciales(str){

    str=str.replaceAll("á","a");
    str=str.replaceAll("é","e");
    str=str.replaceAll("í","i");
    str=str.replaceAll("ó","o");
    str=str.replaceAll("ú","u");
    str=str.replaceAll("ñ","n");
    str=str.replaceAll(" ","");

    return str;
}

function EliminaTodosN(){

    for(var i=0;i<TodosN1Dibujados.length;i++){

        TodosN1Dibujados[i].setMap(null);

    }

    TodosN1Dibujados=[];

     for(var i=0;i<TodosN0Dibujados.length;i++){

        TodosN0Dibujados[i].setMap(null);

    }

    TodosN0Dibujados=[];

}

function ObtieneNombres(lat,lng){
   
    var n1=CalculaCoordenadas(String(lat+","+lng),120); //Calcular Minutos  1
    var n0=CalculaCoordenadas(String(lat+","+lng),1200); //Calcular Segundos  0 

    return {n0:{Y1:n0.Y1,X1:n0.X1,Y2:n0.Y2,X2:n0.X2  },n1:{ Y1:n1.Y1,X1:n1.X1,Y2:n1.Y2,X2:n1.X2} };

}


function CalculaCoordenadas(cad,divisor){

    var arrTem = cad.split(",");
    var cad = arrTem[1];
    var cordX = cad.split(".");
    var cordY = new Array();

    XXEntero= cordX[0];
   
    Xdecimales = Number("."+cordX[1]);
    Xdecimales =  Xdecimales / (1/divisor);
   
    cordX = Xdecimales.toString().split(".");
    
    
    X1 = Number(cordX[0]);
    X2 = (X1+1)*(1/divisor);
    X1 = X1 *(1/divisor);
    if(X1 >=0){
        if(XXEntero >= 0){
            X1 = XXEntero+X1;
        }
        else{
            X1 = XXEntero-X1;
        }
    }else{
        X1 = Number(XXEntero+(X1.toString().substr(1)));
    }
    if(X2 >=0){
        if(XXEntero > 0){
            X2 = XXEntero+X2;
        }
        else{
            X2 = XXEntero-X2;
        }
    }else{
        X2 = Number(XXEntero+(X2.toString().substr(1)));
    }
    
    if(arrTem[1].toString().split(".")[0] == "-0"){
        X1= (X1*-1);
    }
    if(arrTem[1].toString().split(".")[0] == "0"){
        X2 =(X2*-1);
    }   

    cad = arrTem[0];
    cordY = cad.split(".");
    YYEntero= cordY[0];
     
    Ydecimales = Number("."+cordY[1]);
    Ydecimales =  Ydecimales / (1/divisor);
    cordY = Ydecimales.toString().split(".");
    
    
    Y1 = Number(cordY[0]);
    Y2 = (Y1+1)*(1/divisor);
    Y1 = Y1 *(1/divisor);
    
    if(Y1 >=0){
        if(YYEntero >= 0){
            Y1 = Number(YYEntero)+Number(Y1);
        }
        else{
            Y1 = Number(YYEntero)-Number(Y1);
        }
    }else{
        Y1 = Number(Number(YYEntero)+Number(Y1.toString().substr(1)));
    }
    

    if(Y2 >=1){
        if(YYEntero >= 0){
            
            Y2 = Number(YYEntero)+Number(Y2);
        }
        else{
            
            Y2 =Number(Number(YYEntero)+Number(Y2.toString().substr(1)));
        }
    }
    else{
        Y2 = Number(YYEntero+(Y2.toString().substr(1)));
    }
    if(arrTem[0].toString().split(".")[0] == "-0"){
        Y1= (Y1*-1);
        Y2 =(Y2*-1);
    }
    return {Y1:Y1,X1:X1,Y2:Y2,X2:X2};
}




;var sceneGL;

var sceneCSS3D;

var controls;

var camera;

var raycaster = new THREE.Raycaster();

var mouse = new THREE.Vector2();

var raycaster = new THREE.Raycaster();

var mouse = new THREE.Vector2();

var lineaSenaladora;

var svgMujeres;

var svgHombres;

function init(){

	
	var sceneCreator = new VOne.SceneCreator();	


    sceneCSS3D = sceneCreator.createScene({ bgColor:"#00FF00", bgAlpha:0.0, glRenderer: THREE.CSS3DRenderer, width:windowWidth, height:windowHeight, controls: THREE.OrbitControls ,   parentType:"div",  containerId:"svgGraficaFrontal",verticalDegFOV:60  });	

	sceneGL = sceneCreator.createScene({ bodyBGColor: 0x2a273b, bodyBGAlpha: 1.0, bgColor:"#000000", bgAlpha:0.09,  useTweenAnimations:true, glRenderer: THREE.WebGLRenderer, width:windowWidth, height:windowHeight,	useControls: sceneCSS3D.controls ,	camera:sceneCSS3D.camera,   parentType:"div", cameraNear:.1 , cameraFar:100000000 ,containerId:"webglContainer",raycastThreshold:10,verticalDegFOV:60  });

	

	controls= sceneCSS3D.controls;

	camera = sceneCSS3D.camera;


	// //Encuadra las ventanas del DOM
	$("#svgGraficaFrontal").css("position","fixed");
 	$("#svgGraficaFrontal").css("float","left");

    //$('canvas').css({ 'background':'#2a273b'});
  	//$("#svgGraficaFrontal").css("pointer-events","none");
  	$("#webglContainer").css("z-index",3);
    $("#svgGraficaFrontal").css("z-index",-2);

	$("#webglContainer").css("position","fixed");
	// $("#webglContainer").css("z-index",-1);

	

    sceneCSS3D.camera.position.set(0,1300,1500);

    controls.target.z=0;
    controls.target.x=0;
    controls.target.y=-500;

    graficaFrontal3D = new THREE.CSS3DObject( $("#svgMain")[0] );   
    

    sceneCSS3D.add( graficaFrontal3D );

    
    graficaFrontal3D.position.set(0,0,0);

    graficaFrontal3D.rotation.x=-90*(Math.PI/180);


    raycaster = new THREE.Raycaster();

    raycaster.params.PointCloud.threshold = .5;

    controls.minPolarAngle = 0*(Math.PI/180);

    controls.maxPolarAngle = 120*(Math.PI/180);  

    //controls.minDistance = 400;

    //controls.maxDistance = 3000;   

    controls.minAzimuthAngle = 110*(Math.PI/180);  

    controls.maxAzimuthAngle = 120*(Math.PI/180);



    var light = new THREE.AmbientLight( 0x111111 ); // soft white light
    sceneGL.add( light );

    var directionalLight = new THREE.DirectionalLight(  0xffffff, .8);
    directionalLight.position.x = 500;
    directionalLight.position.y = 600;
    directionalLight.position.z = 500;
    //directionalLight.position.normalize();


    //directionalLight.shadowCameraVisible = true;
    directionalLight.castShadow = true;
    //directionalLight.shadowDarkness = 0.5;

    sceneGL.add( directionalLight );


    // LINEAS****************************


    var material = new THREE.LineBasicMaterial({
        color: 0x6B6B6B
    });



    //LUCES ****************************
    

    var directionalLight = new THREE.DirectionalLight(  0xffffff, .4 );
    directionalLight.position.x = -500;
    directionalLight.position.y = 400;
    directionalLight.position.z = -500;
    directionalLight.position.normalize();
    sceneGL.add( directionalLight );
    
    directionalLight.shadow.camera = true;
    directionalLight.castShadow = true;
    directionalLight.shadowDarkness = 0.5;

     var directionalLight = new THREE.DirectionalLight(  0xffffff, .2 );
    directionalLight.position.x = 500;
    directionalLight.position.y = -500;
    directionalLight.position.z = 500;
    directionalLight.position.normalize();
    sceneGL.add( directionalLight );

    directionalLight.shadow.camera = true;
    directionalLight.castShadow = true;
    directionalLight.shadowDarkness = 0.5;
    

    var directionalLight = new THREE.DirectionalLight(  0xffffff, .2 );
    directionalLight.position.x = 650;
    directionalLight.position.y = 650;
    directionalLight.position.z = -800;
    directionalLight.position.normalize();
    sceneGL.add( directionalLight );

   
    



};
function EliminaBarrasPersonas(){



	svgMujeres.selectAll(".etiquetaPersonaMujer").data([]).exit().remove();
	svgHombres.selectAll(".etiquetaPersonaHombre").data([]).exit().remove();

	

	svgMujeres.selectAll(".barraPersonaMujer").data([]).exit().remove();
	svgHombres.selectAll(".barraPersonaHombre").data([]).exit().remove();

	for(var j=0; j < diasRegistrados.length; j++){

		diasRegistrados[j].Mujer=0;
		diasRegistrados[j].Hombre=0;

	}

}

var maximoPersonasDeportadasPorDia=0;

function DibujaBarrasPersonas(){

	EliminaBarrasPersonas();

	//Dibuja Barras:

	var diccionarioFechas={};


	for(var i=0; i< modeloParaPersonas.length; i++){

				if( !diccionarioFechas["_"+modeloParaPersonas[i].fecha.getTime()] ){

					diccionarioFechas["_"+modeloParaPersonas[i].fecha.getTime()]={
																					Hombre:0,
																					Mujer:0,																					
																					fecha:modeloParaPersonas[i].fecha.getTime()

																				}

				}else{					

					if(diccionarioFechas["_"+modeloParaPersonas[i].fecha.getTime()]){

						diccionarioFechas["_"+modeloParaPersonas[i].fecha.getTime()][ String(modeloParaPersonas[i].genero) ]+=1;
						
					}

				}

				

				if(maximoPersonasDeportadasPorDia < diccionarioFechas["_"+modeloParaPersonas[i].fecha.getTime()][ modeloParaPersonas[i].genero ] )
					maximoPersonasDeportadasPorDia = diccionarioFechas["_"+modeloParaPersonas[i].fecha.getTime()][ modeloParaPersonas[i].genero ];

		

	}


	var lapsoEspacioY = windowWidth/diasRegistrados.length;


	
	//Dibuja Etiquetas
	for(var i=0; i< modeloParaPersonas.length; i++){

		for(var j=0; j < marcasTiempo.length; j++){	

				var fechaMarcaTiempo = new Date(marcasTiempo[j].fecha);			

				if  (  modeloParaPersonas[i].fecha.getMonth() == fechaMarcaTiempo.getMonth() &&  modeloParaPersonas[i].fecha.getFullYear() == fechaMarcaTiempo.getFullYear() ){					

					if( marcasTiempo[j][String(modeloParaPersonas[i].genero)] || marcasTiempo[j][String(modeloParaPersonas[i].genero)] === 0 )
						marcasTiempo[j][String(modeloParaPersonas[i].genero)]+=1;					

				}				

		}

	}
	

	var lapsoEspacioYEtiquetas = windowWidth/marcasTiempo.length;

	var diccionarioDiasConPersonas=[];

	for(var e in diccionarioFechas){

		diccionarioDiasConPersonas.push(diccionarioFechas[e]);

	}


	svgMujeres
			.selectAll(".barraPersonaMujer")
			.data(diccionarioDiasConPersonas)
			.enter()
			.append("rect")
			.attr("id","barraPersona")
			.attr("class","barraPersonaMujer")
			.attr("x", function(d,i){

				return GetValorRangos( d.fecha ,minimaFecha  , maximaFecha , 0 , windowWidth );

			} )
			.attr("y", function(d){

				
				return config.profundidadBarrasHombresMujeres-30-GetValorRangos( d.Mujer , 0 , maximoPersonasDeportadasPorDia  ,  0 , config.profundidadBarrasHombresMujeres );

			} )
			.style("fill","yellow")

			.attr("height", function(d){	
					

				return GetValorRangos( d.Mujer , 0 , maximoPersonasDeportadasPorDia  ,  0 , config.profundidadBarrasHombresMujeres );

			} )
			.attr("width",function(d){				

				return lapsoEspacioY;

			} );

	svgHombres
			.selectAll(".barraPersonaHombre")
			.data(diccionarioDiasConPersonas)
			.enter()
			.append("rect")
			.attr("id","barraPersona")
			.attr("class","barraPersonaHombre")
			.attr("x", function(d,i){

				return GetValorRangos( d.fecha ,minimaFecha  , maximaFecha , 0 , windowWidth );

			} )
			.attr("y", function(d){

				return config.profundidadBarrasHombresMujeres-30-GetValorRangos( d.Hombre , 0 , maximoPersonasDeportadasPorDia  ,  0 , config.profundidadBarrasHombresMujeres );

			} )
			.style("fill","#4F76F7")
			.style("opacity",.6)
			.attr("height", function(d){	

				return GetValorRangos( d.Hombre , 0 , maximoPersonasDeportadasPorDia  ,  0 , config.profundidadBarrasHombresMujeres );

			} )
			.attr("width",function(d){				

				return lapsoEspacioY;

			} );

		

		svgMujeres
			.selectAll(".etiquetaPersonaMujer")
			.data(marcasTiempo)
			.enter()
			.append("text")
			.attr("id","etiquetaPersonaMujer")
			.attr("class","etiquetaPersonaMujer")
			.attr("x", function(d,i){

				return GetValorRangos( d.fecha ,minimaFecha  , maximaFecha , 0 , windowWidth );

			} )
			.attr("y", function(d){

				
				return config.profundidadBarrasHombresMujeres-10;

			} )
			.style("fill","yellow")
			.style("font-size",11)
			.style("font-family","Coda")
			.style("text-anchor","middle")
			.text(function(d){

				if(Number(d.Mujer)==0)
					return "";

				return formatNumber(d.Mujer);
			})
			;

		svgHombres
			.selectAll(".etiquetaPersonaHombre")
			.data(marcasTiempo)
			.enter()
			.append("text")
			.attr("id","etiquetaPersonaHombre")
			.attr("class","etiquetaPersonaHombre")
			.attr("x", function(d,i){

				return GetValorRangos( d.fecha ,minimaFecha  , maximaFecha , 0 , windowWidth );

			} )
			.attr("y", function(d){

				
				return config.profundidadBarrasHombresMujeres-10;

			} )
			.style("fill","#4F76F7")
			.style("font-size",10)
			.style("font-family","Coda")
			.style("text-anchor","middle")
			.text(function(d){

				if(Number(d.Hombre)==0)
					return "";

				return formatNumber(d.Hombre);
			})
			;
		

} 





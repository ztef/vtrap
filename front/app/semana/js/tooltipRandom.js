var esferasReferenciaTooltip={};

var sujetos={};

var posicionContenedor3D;

var mitadPantalla;


function IniciaTimerRandomPersonas(){

	var geometry = new THREE.SphereGeometry( 1, 32, 32 );
	var material = new THREE.MeshBasicMaterial( {color: 0xFFFFFF} );
	var sphere = new THREE.Mesh( geometry, material );
	sceneGL.add( sphere );

	esferasReferenciaTooltip["esfera1"]=sphere;

      // ******************************************

      var geometry1 = new THREE.SphereGeometry( 1, 32, 32 );
      var material = new THREE.MeshBasicMaterial( {color: 0xFFFFFF} );
      var sphere2 = new THREE.Mesh( geometry1, material );
      sceneGL.add( sphere2 );

      esferasReferenciaTooltip["esfera2"]=sphere2;    

	setInterval(function(){ 

		MuestraTooltipRandom();

	}, 7000);

	setInterval(function(){ 

		ActualizaPosicionLineas();

	}, 100);

	setInterval(function(){ 

		ActualizaPosicionTool();

	}, 8000);

}



function MuestraTooltipRandom(){

      

      $("#ficha").css("visibility","visible");
      $("#ficha2").css("visibility","visible");
      


      for(var i=0;  i < 2; i++){
                  
                  var indiceRef = getRandomInt(0,Rows.length-1);

                  sujetos["sujeto"+(i+1)] = Rows[indiceRef];

                  sujetos["sujeto"+(i+1)].elementoReferencia = esferasReferenciaTooltip["esfera"+(i+1)];

      }
	
      if(sujetos.sujeto1){

            


      	$("#Title").html("Calificación: <span style='font-weight:bold;'>"+sujetos.sujeto1["total"]+"</span>");
            $("#Date").html("Área: <span style='font-weight:bold;'>"+sujetos.sujeto1["Area"]+"</span>");
      	$("#Views").html("Localidad: <span style='font-weight:bold;'>"+sujetos.sujeto1["Localidad"]+"</span>");
            
            
          

      }

      

      if(sujetos.sujeto2){           

            $("#Title2").html("Calificación: <span style='font-weight:bold;'>"+sujetos.sujeto1["total"]+"</span>");
            $("#Date2").html("Área: <span style='font-weight:bold;'>"+sujetos.sujeto1["Area"]+"</span>");
            $("#Views2").html("Localidad: <span style='font-weight:bold;'>"+sujetos.sujeto1["Localidad"]+"</span>");
           

      }

     
      

     

}

function ActualizaPosicionLineas(){

            d3.selectAll(".senalador").data([]).exit().remove();

   
            if(sujetos["sujeto1"]){

                              sujetos["sujeto1"].elementoReferencia.position.set(sujetos["sujeto1"].X,sujetos["sujeto1"].Y,sujetos["sujeto1"].Z);

            			
            			posicionContenedor3D = toScreenPosition( sujetos["sujeto1"].elementoReferencia  ,camera);


                              $("#ficha1").css("top",posicionContenedor3D.y-($("#ficha1").height()/2));
 
                          
            			   

                              

                              if(posicionContenedor3D.x < 0 ){

                                    $("#ficha1").css("visibility","hidden"); 

                                    

                              }else{

                                    $("#ficha1").css("visibility","visible");

                                    d3.select("#svgLines").append("line")
                                                .attr("class","senalador")
                                                .attr("y1",posicionContenedor3D.y)
                                                .attr("y2",posicionContenedor3D.y )
                                                .attr("x1", 200 )
                                                .attr("x2",posicionContenedor3D.x  )         
                                                .style("opacity",.3 )
                                                .style("stroke","#ffffff")
                                                .style("stroke-width",1)
                                                ;


                           


                                    d3.select("#svgLines").append("circle")
                                                      .attr("class","senalador")
                                                      .attr("r",40)
                                                      .attr("cx",posicionContenedor3D.x)
                                                      .attr("cy",posicionContenedor3D.y)                                
                                                      .style("fill","none")
                                                      .style("stroke","#ffffff")
                                                      .style("stroke-opacity",.3)
                                                      ; 

                              }               
                                        


            }

            if(sujetos["sujeto2"]){

                              sujetos["sujeto2"].elementoReferencia.position.set(sujetos["sujeto2"].X,sujetos["sujeto2"].Y,sujetos["sujeto2"].Z);

                              
                              posicionContenedor3D = toScreenPosition( sujetos["sujeto2"].elementoReferencia  ,camera);


                              $("#ficha2").css("top",posicionContenedor3D.y-($("#ficha2").height()/2));
 
                          
                             


                              if( posicionContenedor3D.x >  windowWidth ||  posicionContenedor3D.x < 0){

                                    $("#ficha2").css("visibility","hidden"); 


                                     
                              }else{

                                    $("#ficha2").css("visibility","visible");

                                    d3.select("#svgLines").append("line")
                                                .attr("class","senalador")
                                                .attr("y1",posicionContenedor3D.y)
                                                .attr("y2",posicionContenedor3D.y )
                                                .attr("x1", windowWidth - 200 )
                                                .attr("x2",posicionContenedor3D.x  )         
                                                .style("opacity",.3 )
                                                .style("stroke","#ffffff")
                                                .style("stroke-width",1)
                                                ;



                                    d3.select("#svgLines").append("circle")
                                                      .attr("class","senalador")
                                                      .attr("r",40)
                                                      .attr("cx",posicionContenedor3D.x)
                                                      .attr("cy",posicionContenedor3D.y)                                
                                                      .style("fill","none")
                                                      .style("stroke","#ffffff")
                                                      .style("stroke-opacity",.3)
                                                      ; 


                              }                   
                                        


            }

            

      


}

function ActualizaPosicionTool(){

	if(posicionContenedor3D){	

		var altura = 	posicionContenedor3D.y-($("#ficha").height()/2);

		if(altura  >  windowHeight - $("#ficha").height() )
			altura = windowHeight - $("#ficha").height();

		TweenMax.to("#ficha", 7, {top:altura});



	}



}












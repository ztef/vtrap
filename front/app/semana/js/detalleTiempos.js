

function DibujaDetalleTiempos(){

	for(var i=0; i < diccionarioEdades.length; i++){

			var anchoArco =  GetValorRangos( diccionarioEdades[i].cantidad , 1 , 3400 , 0  , 80  );

		
	        var lineBkgndArc=d3.svg.line.radial()
				                .interpolate( arcInterpolator( diccionarioEdades[i].radio*.8 ) ) 
				                .tension(2)
				                .radius(diccionarioEdades[i].radio*.8 )
				                .angle(function(d, i) { 

				                  return d * degreeToRadians;

				              	});


			svgMain.append("path")
							.datum([ 280  , 280+anchoArco  ])
							
							.style("opacity", .6)													
				          	.attr("transform", "translate(" + String( (config.anchoCanvas)/2 )  + ", " + String( (config.anchoCanvas)/2 ) + ") rotate(0)") 
				          	.style("stroke", "#ffffff"  )
				          	.style("fill", "none")
				          	.attr("d",lineBkgndArc	)				         
							.style("stroke-width",11);



			


	}
	
	var posicion4 = CreaCoordenada( 279.5 ,  radioInt  , {x:config.anchoCanvas/2  ,y:config.anchoCanvas/2 });

	var posicion5 = CreaCoordenada( 279.5 ,  radioExt ,   {x:config.anchoCanvas/2  ,y:config.anchoCanvas/2 });

	var posicion6 = CreaCoordenada( 282 ,  radioExt*.7  , {x:config.anchoCanvas/2  ,y:config.anchoCanvas/2 });

	svgMain.append("line")
	    		.style("stroke","white" )
		        .style("stroke-width", 1 )
		        .style("stroke-opacity", 1 )
		        .attr("filter","url(#glow)")
	    		.attr("x1",posicion4.x)
	    		.attr("y1",posicion4.y)
	    		.attr("x2",posicion5.x)
	    		.attr("y2",posicion5.y)
	    		;

	svgMain.append("text")						
				//.attr("x",20 )
				//.attr("y", (alturaPorPeriodo*i)+margenSuperior+30  )
				.attr("fill","white")							
				.style("opacity",.2)
				.style("font-family","Cabin")
				.style("font-weight","bold")
				.style("font-size",60)						
				.style("text-anchor","end")
				.attr("transform"," translate("+String(posicion6.x)+","+String(posicion6.y)+")  rotate("+String(280+90)+")")
				.text(function(){

					return "Rendimiento de servicio";

				});

}
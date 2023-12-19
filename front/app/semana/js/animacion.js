
var tiempos=[];

function GeneraDatosTiempo(){
	

	// **************


	var anchoPorSegmento = ((radioExt-90) - radioInt) / 22;	

	var acumulado=radioInt;

	for(var e in etapas){

		var data=stream_layers(1,290*2);

		var pos0 = CreaCoordenada( 0 , acumulado  , {x:config.anchoCanvas/2 , y:config.anchoCanvas/2 }  );

		var valorAnterior={x:pos0.x-config.anchoCanvas/2  ,y:0 , z:pos0.y-config.anchoCanvas/2 };;

		

		for(var i=1;  i < data[0].length; i++){
			

			var pos1 = CreaCoordenada( i*.5 , acumulado  , {x:config.anchoCanvas/2 , y:config.anchoCanvas/2 }  );			

			var line;

			//CURVA

			var opacidad = GetValorRangos( i , 0  , data[0].length  ,   1 ,  100 );

			geometry = new THREE.Geometry();
			 
			geometry.vertices.push(new THREE.Vector3(valorAnterior.x, valorAnterior.y*50 ,valorAnterior.z ));
			geometry.vertices.push(new THREE.Vector3(pos1.x-config.anchoCanvas/2, data[0][i].y*50, pos1.y-config.anchoCanvas/2));
			
			material = new THREE.LineBasicMaterial( { color: 0xffffff , linewidth: 1 ,transparent:true,opacity:0+(opacidad/100)} );
			var line = new THREE.Line(geometry, material);
			//sceneGL.add(line);

			tiempos.push(line);

			//VERTICAL			

			geometry2 = new THREE.Geometry();
			 
			geometry2.vertices.push(new THREE.Vector3(pos1.x-config.anchoCanvas/2 , 0 ,pos1.y-config.anchoCanvas/2 ));
			geometry2.vertices.push(new THREE.Vector3(pos1.x-config.anchoCanvas/2, data[0][i].y*50, pos1.y-config.anchoCanvas/2));
			
			material2 = new THREE.LineBasicMaterial( { color: 0xffffff , linewidth: 1 ,transparent:true,opacity:0+(opacidad/100)} );
			var line2 = new THREE.Line(geometry2, material2);
			//sceneGL.add(line2);			

			valorAnterior={x:pos1.x-config.anchoCanvas/2  ,y:data[0][i].y , z:pos1.y-config.anchoCanvas/2 };


			tiempos.push(line2);



		}

		acumulado+=anchoPorSegmento;

	}


}
var Rows;


var maximo=0;

var mpos;

var dateParser =   d3.time.format("%Y-%m-%d %H:%M:%S");//2016-05-03 21:27:19 

var minDate=100000000000000;
var maxDate=0;

var diccionarioDias={};

var maximoPorEntidad = 0;

var colonias;

var edadesArr =[];
     
function Consulta(){

    $("#cargando").css("visibility","visible");    

      d3.json("docs/datosTest.json", function(error, rows) {

          rows=rows.data;

          

          console.log(rows);

          console.log(rows[0]);

       

          mpos = d3.nest()
                  .key(function(d) { return d.municipio; })
                  .entries(rows); 

         

          for(var i=0;  i < edades.length; i++){

            for(var j=0;  j < edades[i].cantidad; j++){

                edadesArr.push(i);

            }

          }

          for(var i=0;  i < rows.length; i++){

                     rows[i].fecha = dateParser.parse(rows[i].FECHA_RECEPCION.substr(0,18));  

                     rows[i].edad = edadesArr[getRandomInt(0,edadesArr.length-1)];

                     //Identifica Dias Consultados

                     var dia = new Date(rows[i].fecha.getFullYear(), rows[i].fecha.getMonth(),rows[i].fecha.getDate());

                     if(!diccionarioDias[dia.getTime()])
                            diccionarioDias[dia.getTime()]={fecha:dia};

                    if(minDate > rows[i].fecha.getTime() )   
                        minDate = rows[i].fecha.getTime();

                    if(maxDate < rows[i].fecha.getTime() )
                        maxDate = rows[i].fecha.getTime(); 
                    

          }

          // simula el dia que le toca
          var diaProbabilidad = [1,1,1,2,2,2,2,2,3,3,3,3,3,3,4,4,4,4,4,4,4,5,5,5,5,5,5,5,5,5,5,5,5,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9];

          var condiciones=[1,1,1,1,,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,2,2,2,2,2,2,2,2,2,2,2,3];

          for(var i=0;  i < rows.length; i++){

            rows[i].dia = diaProbabilidad[getRandomInt(0,diaProbabilidad.length-1)]-1;

            rows[i].condicion = condiciones[getRandomInt(0,condiciones.length-1)];

            rows[i].edadRedondeada= Math.round(rows[i].edad/2);

          }


          //rows= rows.splice(0,10000);

          Rows=rows;

          colonias = mpos = d3.nest()
                  .key(function(d) { return d.colonia; })
                  .entries(rows);           

          colonias = colonias.sort((a, b) => b.values.length - a.values.length);

          colonias=colonias.splice(1,33);
     
          for(var i=0;  i < colonias.length; i++){

            if( colonias[i].values.length > maximoPorEntidad){

                maximoPorEntidad = colonias[i].values.length;

            }

          }

          InitSVG();                          
             
    });


 }





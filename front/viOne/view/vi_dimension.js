import {vi_segment}  from './vi_segment.js';

export class vi_dimension {

    constructor(config){
       
        this.name = config.name;
        this.label = config.label;
        this.axis = config.axis;            // eje
        this.delta = config.delta;          // delta o incremente entre segmentos
        this.position = 0;                 // valor ultimo
        this.dimensions = []                // SUBDIMENSIONES


        console.log('dimension ', this.name, 'creada');



        if(config.dimensions){

            config.dimensions.forEach((dimension_config) => {
                
                var dimension = new vi_dimension(dimension_config);  // Llamada Recursiva
                this.dimensions.push(dimension);

            });


        }


        this.segments = {};

        
    }


    locateSegments(data, acum){


        var segment;

        // checa si existe un segmento para este dato dentro de esta dimension
        if (this.segments.hasOwnProperty(data[this.name]))
        {
            
            segment = this.segments[data[this.name]];

        } else {


            // Crea el segmento si no existe
            this.position = this.position + this.delta;
            this.segments[data[this.name]] = new vi_segment({dimension:this.name, label:data[this.name], axis:this.axis, position:this.position});
        
            segment = this.segments[data[this.name]]; 
        }


        // en este punto ya se localizo el segmento dentro de esta dimension.
        // ahora hay que ir a las subdimensiones para localizar los segmentos en cada una de ellas


        this.dimensions.forEach((dimension)=>{

            var seg = dimension.locateSegments(data, acum);
            //acum.push(seg);

        });

        acum.push(segment);

        return acum;
        

    }


    // imprime los segmentos
    print(){
        for (let segmento in this.segments) {
            if (this.segments.hasOwnProperty(segmento)) {
                console.log(segmento + ': ' + this.segments[segmento]);
            }
        }

    }



}
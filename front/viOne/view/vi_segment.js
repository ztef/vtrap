import {vi_dimension}  from './vi_dimension.js';

export class vi_segment{




    // {dimension:this.name, label:data[this.name], position:this.position}
    constructor(segment_data){
        
        this.name =segment_data.segmentname;
        this.label=segment_data.label;
        this.dimension = segment_data.dimension;
        this.position = segment_data.position;
        this.axis = segment_data.axis;
        this.counter = 0; // Numero de elementos que han caido en este segmento
        this.dimensions_def = segment_data.dimensions_def;
        this.data = segment_data.data;
        this.dimensions = [];
        

        this.dimensions_def.forEach(dimension => {
            
            var dim = new vi_dimension(dimension);
             
            this.dimensions.push(dim);


        });
    
    }


    addData(data){


        var segments = [];

        // Checa data para cada dimension :
        this.dimensions.forEach((dimension)=>{

            var subsegments = dimension.getSegments(data,[],'');
            subsegments.forEach((ss)=>{
                segments.push(ss);
            })

        });

        //var pos = {};
        //segments.forEach((segment)=>{
        //       pos[segment.axis] = segment.value;
        //});

        return segments;

    }

    

}
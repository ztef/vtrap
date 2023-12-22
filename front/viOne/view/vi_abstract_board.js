import {vi_dimension}  from './vi_dimension.js';


export class vi_abstractBoard {


    /*
    
    var board_config = {

    boardType: "xyz",
    dimensions : [
        {
            name:"cliente",
            label:"Clientes",
            axis:"x",
            dimensions : [
                {
                    name:"ruta",
                    label:"Rutas",
                    axis:"y",
                       dimensions : [
                        {
                            name:"mobil",
                            label:"mobil",
                            axis:"z",   
                            dimensions: [
                                {
                                    name:"tipo",
                                    label:"tipo",
                                    axis:"color"   
                                }
                            ]
                        }
                       ]
                }
            ]   
        },
        
    ]
    }    
    
    */ 


    constructor(name, board_config, render_engine){
       
        this.name = name;
        this.render_engine = render_engine;
        this.dimensions = [];
        board_config.dimensions.forEach(dimension => {
            
                var dim = new vi_dimension(dimension);
                this.addDimension(dim);

              


        });


    }


    addDimension(dim){
      
            this.dimensions.push(dim);
            
       
    }



    addElement(data){

        var segments;

        // Checa data para cada dimension :
        this.dimensions.forEach((dimension)=>{

            segments = dimension.locateSegments(data,[]);
            console.log(segments);

        });
               
    
    };


    print(){

        console.log("TABLERO :");
        this.dimensions.forEach((dimension)=>{

            console.log('Dimension : ', dimension.name);
            dimension.print();

        });
    }




}
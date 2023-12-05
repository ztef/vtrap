export class vi_abstractBoard {

    constructor(name){
       
        this.name = name;

        this.dimensions = {};
    }


    addDimension(dim){
        if (!this.dimensions.hasOwnProperty(dim.name)) {
            this.dimensions[dim.name] = dim;
            
        } else {
            console.error(`Dimension name ${dim.name} already exists.`);
        }
    }


}
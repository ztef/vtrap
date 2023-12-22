export class vi_segment{




    // {dimension:this.name, label:data[this.name], position:this.position}
    constructor(segment_data){
        
        this.name =segment_data.label;
        this.dimension = segment_data.dimension;
        this.position = segment_data.position;

        console.log('segemto en dim:', this.dimension, ' name:', this.name, ' pos:', this.position);
      
    
    }

    in(n){
        if(n == this.name){
            return true;
        } else {
            return false;
        }
    }

}
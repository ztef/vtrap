export class vi_segment{

    constructor(name, label){
        
        this.name = name;
        this.label = label;
        
    
    }

    in(n){
        if(n == this.name){
            return true;
        } else {
            return false;
        }
    }

}
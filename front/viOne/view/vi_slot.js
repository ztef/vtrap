export class vi_slot {

    constructor(point, delta, axis){
        this.point = point;
        this.delta = delta;
        this.axis = axis;
        this.objects = [];
    }

    add(object){

        this.objects.push(object);

    }

    getTopPoint(){

        let topPoint = {...this.point};

        topPoint[this.axis] = this.objects.length * this.delta;

        return topPoint;

    }


}
export class vi_dimension {

    constructor(name){
       
        this.name = name;

        this.segments = {};
        this.graphics = {};
        
    }


    addSegment(segment){
        if (!this.segments.hasOwnProperty(segment.name)) {
            this.segments[segment.name] = segment;
            
        } else {
            console.error(`Segment name ${segment.name} already exists.`);
        }
    }

    setGraphics(graphicsData){
        this.graphics = graphicsData;
    }

}
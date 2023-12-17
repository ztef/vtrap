

import vi_RemoteListener from "./vi_remote_listener.js"





class vi_GoogleSheetListener extends vi_RemoteListener {
  constructor(dataSource, mobileObjectModel) {

    super();
    this.dataSource = dataSource;
    this.collections = dataSource.config.collections;
    this.objectModel = mobileObjectModel;

    this.loadSheets();
   
  }


  async loadSheets(){

    var sheetnumber = 0;

    this.collections.forEach(collection => {
       
        this.loadData(sheetnumber,collection.collection);

        sheetnumber = sheetnumber + 1;

    });


  }


  async loadData(sheetnumber, collection) {
    try {
      console.log("Fetch de datos de google");
      // Make an HTTP GET request to your Node.js route
      const response = await fetch('/api/getFromSheet?sheetnumber='+sheetnumber+'&sheet='+this.dataSource.config.SPREADSHEET_ID);
  
      if (response.ok) {
        // Parse the response as JSON
        const data = await response.json();
  
        // Process the data from the Google Spreadsheet
        console.log("DATOS DE LA HOJA DE CALCULO");
        console.log(data);
  
        // TODOS LOS REGISTROS DEBEN TENER :
            // id
            // type (opcional)
            // position (_lat, _long) (opcional)

        for (const key in data) {
          if (data.hasOwnProperty(key)) {
            const element = data[key];
            
            const record = {
                id:element.id,
                type: element.type,
                position:{
                    _lat: element._lat,
                    _long: element._long
                },
                fields:element

            };
            console.log(record);
            this.objectModel.updateOrAddObject(record.id,  collection, record);
          }
        }
  
       
      } else {
        console.error('Failed to fetch data:', response.status, response.statusText);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  }
  

  
}

export default vi_GoogleSheetListener;



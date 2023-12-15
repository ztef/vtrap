/*

  VISUAL INTERACTION SYSTEMS

  Modelo generico de objetos en Memoria


*/


import vi_Object from "./vi_object.js"

class vi_ObjectModel  {

    constructor(controller) {
      

      this.controller = controller;
      this.controller.setModel(this);
  
     
      this.objects = [];
    }
  
    /*
    
    Update or add an object

    */

    updateOrAddObject(id, collection, data) {

      const existingObject = this.objects.find((object) => object.id === id && object.collection === collection);

      if (existingObject) {
        
        existingObject.data = data;
        existingObject.collection = collection;
         
        this.controller.triggerObjectUpdated(collection, existingObject);
         
        return existingObject;
      } else {
        
        /*
        const newObject = {
          id,
          collection: collection,
          data,
           
        };
        */

        const newObject = new vi_Object(id, collection, data);

        this.objects.push(newObject);
        this.controller.triggerObjectAdded(collection, newObject);

        return newObject;
      }
    }
  
    /*
    
    Read an  object by ID
  
    */

   


    readObject(collection, id) {
      return this.objects.find((object) => object.id === id && object.collection === collection);
    }
    
  
    /* 
    
      Delete a mobile object by ID
    
    */
    
      deleteObject(collection, id) {

      const index = this.objects.findIndex((object) => {object.id === id && object.collection === collection});
      if (index !== -1) {
        this.objects.splice(index, 1);
        
        this.controller.triggerObjectDeleted(collection, id);
        return true; // Object deleted successfully
      }
      return false; // Object not found
    }
  
    /* 
    
    Get all objects

    */

    getAllObjects() {
      return this.objects;
    }
  }
  
  export { vi_ObjectModel as vi_ObjectModel };
  
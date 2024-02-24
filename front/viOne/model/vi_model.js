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

    setCollectionLoaded(collection){
      this.controller.triggerCollectionLoaded(collection);
    }

  
    /*
    
    Read an  object by ID
  
    */

   
    //lectura de un objeto dentro de una coleccion

    readObject(collection, id) {
      return this.objects.find((object) => object.id === id && object.collection === collection);
    }

    // lectura de un objeto cuyo campo sea igual a un valor determinado (regresa el primero si hay varios)
    readObjectbyField(collection, field, value) {
      return this.objects.find((object) => object.data.fields[field] === value && object.collection === collection);
    }

    // Lectura de varios objetos que cumplan con que un campo sea igual a un valor (regresa todos)
    getObjectsByField(collection, field, value) {
      return this.objects.filter((object) => object.data.fields[field] === value && object.collection === collection);
    }

    getObjectsByCollection(collection) {
      return this.objects.filter((object) =>  object.collection === collection);
    }
  
   // Regresa un arreglo con valores unicos de un campo
  getUniqueFieldValues(collection, field) {
    
    const filteredObjects = this.objects.filter(object => object.collection === collection);

    // Extract the values of the specified field from filtered objects
    const fieldValues = filteredObjects.map(object => object.data.fields[field]);

    // Use Set to remove duplicates and convert back to an array
    const uniqueFieldValues = [...new Set(fieldValues)];

    return uniqueFieldValues;
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
  
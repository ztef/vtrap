/*

  VISUAL INTERACTION SYSTEMS

  Implementacion de un Controlador Universal Observable


*/

import vi_ActionObserver from './vi_action_observer.js';


class vi_Controller {
    constructor() {

      this.actionObserver = new vi_ActionObserver();
      this.model = null;  
     
    }


    setModel(m){
      this.model = m;
    }



    /*
        domain<<<<<<<
        Agrega a un Observador (una Funcion) para una accion determinada
    */

    addObserver(domain, actionName, observerFunction) {
        this.actionObserver.addObserver(domain, actionName, observerFunction);
    }
    

    triggerAction(domain, action, data){
      this.actionObserver.notify(domain, action, data);
    }


    triggerObjectSelected(domain, data) {
        this.actionObserver.notify(domain, 'objectSelected', data);
    }

    triggerObjectPicked(domain, data) {
      this.actionObserver.notify(domain, 'objectPicked', data);
    }


    triggerObjectAdded(domain, data) {
      
      this.actionObserver.notify(domain, 'objectAdded', data);
    }

    triggerObjectUpdated(domain, data) {
      
      this.actionObserver.notify(domain, 'objectUpdated', data);
    }

    triggerObjectDeleted(domain, data) {
      this.actionObserver.notify(domain, 'objectDeleted', data);
    }


  
   
  
}
  
  export default vi_Controller;
  
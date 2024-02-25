// firebaseListener.js



import vi_RemoteListener from "./vi_remote_listener.js"

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.4.0/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.4.0/firebase-analytics.js";
import { getFirestore, collection, onSnapshot, doc, getDoc, getDocs } from "https://www.gstatic.com/firebasejs/10.4.0/firebase-firestore.js";




class vi_FirebaseListener extends vi_RemoteListener {
  constructor(dataSource, mobileObjectModel) {

    super();
    this.dataSource = dataSource;
    this.collections = dataSource.config.collections;
    this.collectionsLoaded = 0;

    this.objectModel = mobileObjectModel;


    const app = initializeApp(this.dataSource.config.credentials);
    const analytics = getAnalytics(app);
    this.db = getFirestore(app);

    this.start();
  }


  start() {
    
    console.log("Suscribiendo a Firebase events");
    for (let collectionNumber = 0; collectionNumber < this.collections.length; collectionNumber++) {
      if(this.collections[collectionNumber].loadMode == "suscription"){
          this.suscribeToCollection(this.collections[collectionNumber].collection);
      } else {
          this.addCollection(this.collections[collectionNumber].collection);
      }
   }
  }



  suscribeToCollection(_collection){
   
    const myCollection = collection(this.db, _collection);

    onSnapshot(myCollection, (snapshot) => {
      snapshot.docChanges().forEach((change) => {
        const docData = change.doc.data();
        const docId = change.doc.id;
        const collection = _collection;
        const docType = change.doc.type;

        const record = {
          id:docId,
          type: docType,
          position:{
              _lat: 0,
              _long: 0
          },
          fields:docData

         };

         // && docData.status === "active"
        if (change.type === "added" ) {
          console.log("New Document Added:", docId, record, collection);
          this.objectModel.updateOrAddObject(docId, collection, record);
        }

        if (change.type === "modified") {
          console.log("Document Modified:", docId, record);
          
            this.objectModel.updateOrAddObject(docId, collection, record);
         
        }

        if (change.type === "removed") {
          console.log("Document Removed", docId);
          this.objectModel.deleteObject(docId);
        }
      });
    });
  }


  async getDocument(collectionName, documentId) {
    try {
      // Reference to the document
      const docRef = doc(this.db, collectionName, documentId);

      // Get the document data
      const docSnapshot = await getDoc(docRef);

      if (docSnapshot.exists()) {
        // Document exists, you can access its data
        const documentData = docSnapshot.data();
        return documentData;
      } else {
        // Document doesn't exist
        return null;
      }
    } catch (error) {
      console.error("Error getting document:", error);
      throw error;
    }
  }

  addCollection(collectionName){
    this.getCollection(collectionName).then((collection)=>{
      collection.forEach((record)=>{

        const _record = {
          id:record.id,
          type: "",
          position:{
              _lat: 0,
              _long: 0
          },
          fields:record.data

         };

        this.objectModel.updateOrAddObject(record.id, collectionName, _record);
      });
      this.objectModel.setCollectionLoaded(collectionName);
      this.collectionsLoaded = this.collectionsLoaded + 1;
      if(this.collectionsLoaded == this.collections.length){
        this.objectModel.setAllCollectionsLoaded();
      }
    })
  }



  async getCollection(collectionName) {
    try {
        // Reference to the collection
        const collectionRef = collection(this.db, collectionName);

        // Get all documents in the collection
        const querySnapshot = await getDocs(collectionRef);

        // Initialize an array to store the documents
        const documents = [];

        // Iterate through each document snapshot
        querySnapshot.forEach((doc) => {
            // Get the document data
            const documentData = doc.data();
            
            // Construct a document object containing id and fields
            const document = {
                id: doc.id,
                data: documentData
            };

            // Add the document to the array
            documents.push(document);
        });

        return documents;
    } catch (error) {
        console.error("Error getting collection:", error);
        throw error;
    }
}


  
}

export default vi_FirebaseListener;

// Create a new script element
const script = document.createElement('script');
// Set the src attribute to the MQTT library URL
script.src = 'https://unpkg.com/mqtt/dist/mqtt.min.js';
// Append the script element to the document's head
document.head.appendChild(script);

// Function to initialize MQTT client once the MQTT library is loaded
function initMQTTClient() {
  console.log('INICIANDO');
  // Access the mqtt object from the global scope
  const mqtt = window.mqtt;

   
  
  const broker = "wss://e5246e3f23d9429b847455d56bdd93e6.s1.eu.hivemq.cloud:8884/mqtt";
  //const broker = "wss://a1q6zds606s7ll-ats.iot.us-east-1.amazonaws.com:8884/mqtt";


   
 var options = {
   
   username: 'ztef@hotmail.es',
   password: 'whbR7Q9_AyYCM.U'
}



 
  // MQTT topic to subscribe to
  const topic = '#';


  try {
    const client = mqtt.connect(broker, options);

    client.on('connect', function () {
      console.log('Connected');
      // Subscribe to a topic
      client.subscribe(topic, function (err) {
        if (!err) {
          console.log('Subscribed to topic:', topic);
          //client.publish(topic, 'Hello mqtt')
        } else {
          console.log('Subscription failed:', err);
        }
      });
    });

    // Handle error event
    client.on('error', function (err) {
      console.error('Error:', err);
    });

    // Receive messages
    client.on('message', function (topic, message) {
      if (Array.isArray(message) || ArrayBuffer.isView(message)) {



        console.log(message);
        console.log(message.toString());

        // Extract the first byte based on the data type
        const firstByte = message[0];
        const secondByte = message[1];

        // Convert firstByte and secondByte to hexadecimal
        const hexValue1 = firstByte.toString(16);
        const hexValue2 = secondByte.toString(16);

        // Print the first two bytes in hexadecimal format
        console.log('First two bytes in hexadecimal:', hexValue1, hexValue2);


      } else {
        console.log('Unsupported message format');
      }
    });

  } catch (err) {
    console.error('Error creating MQTT client:', err);
  }
}

// Execute the initMQTTClient function once the MQTT library is loaded
script.onload = initMQTTClient;

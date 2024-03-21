//import * as mqtt from 'mqtt';
import { rotateScene } from './code.js';

const host = "ws://m464ee61.emqx.cloud:8083/mqtt" 

const options = {
    // Clean session
    clean: true,
    connectTimeout: 4000,
    // Authentication
    clientId: 'web',
    username: 'webfront',
    password: 'Ehk@3r6RQ7$cSZ6RiNGK',
  }
  

const client = mqtt.connect(host, options);


client.on('connect', function () {
    console.log('Connected to MQTT broker');
    client.subscribe('rotation_data'); // Subscribe to the topic where rotation values are published
});
  
  client.on('message', function (topic, message) {
    // Message received on the subscribed topic
    const data = JSON.parse(message.toString());
    console.log(data);
    if (data.x !== undefined && data.y !== undefined && data.z !== undefined) {
        // Call the rotateScene function with received rotation values
        rotateScene(data.x, data.y, data.z);
    }
});
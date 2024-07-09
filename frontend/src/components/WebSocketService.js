import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';

class WebSocketService {
  constructor() {
    this.client = new Client({
      webSocketFactory: () => new SockJS('http://localhost:8080/ws'),
      reconnectDelay: 5000,
      heartbeatIncoming: 4000,
      heartbeatOutgoing: 4000,
      onConnect: () => {
        console.log('Connected to WebSocket');
      },
      onStompError: (frame) => {
        console.error('Broker reported error:', frame.headers['message']);
        console.error('Additional details:', frame.body);
      },
    });
  }

  connect(onMessageReceived) {
    this.client.onConnect = () => {
      console.log('Connected to WebSocket');
      this.subscribeToPublic(onMessageReceived);
      this.subscribeToPrivate(onMessageReceived);
      this.subscribeToGroup(onMessageReceived);
    };

    this.client.activate();
  }

  disconnect() {
    this.client.deactivate();
    console.log('Disconnected from WebSocket');
  }

  subscribeToPublic(onMessageReceived) {
    this.client.subscribe('/topic/public', (message) => {
      const msg = JSON.parse(message.body);
      console.log('Received public message:', msg);
      onMessageReceived(msg);
    });
  }

  subscribeToPrivate(onMessageReceived) {
    this.client.subscribe('/user/queue/messages', (message) => {
      const msg = JSON.parse(message.body);
      console.log('Received private message:', msg);
      onMessageReceived(msg);
    });
  }

  subscribeToGroup(onMessageReceived) {
    this.client.subscribe('/topic/group', (message) => {
      const msg = JSON.parse(message.body);
      console.log(`Received group message for `, msg);
      onMessageReceived(msg);
    });
    

  }

  sendMessage(destination, message) {
    if (this.client && this.client.connected) {
      this.client.publish({
        destination: destination,
        body: JSON.stringify(message),
      });
      console.log('Message sent:', message);
    } else {
      console.error('WebSocket is not connected. Unable to send message.');
    }
  }
}

const webSocketService = new WebSocketService();
export default webSocketService;

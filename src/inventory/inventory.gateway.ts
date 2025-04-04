import { WebSocketGateway, WebSocketServer, OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
// WebSpcket permet d'etablir un communication avec les clients en temps réel 
@WebSocketGateway({ cors: { origin: '*' } }) 
export class InventoryGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
  // Injection du serveur WebSocket
  @WebSocketServer() server: Server;
  //  méthode afterInit() est appelée une fois que le serveur WebSocket est initialisé
  afterInit() {
    console.log('WebSocket Initialized ');
  }
//  méthode est exécutée lorsqu'un client se connecte.
  handleConnection(client: Socket) {
    console.log(` Client connected : ${client.id}`);
  }
//  méthode est appelée quand un client se déconnecte.
  handleDisconnect(client: Socket) {
    console.log(` Client disconnected : ${client.id}`);
  }
// méthode est utilisée pour notifier tous les clients qu'un nouvel inventaire a été lancé.
  notifyInventoryLaunch() {
    console.log(' Sending inventory launch notification');
    this.server.emit('inventory-launched', { message: 'A new inventory has been launched !' });
  } 
}

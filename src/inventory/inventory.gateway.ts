import { WebSocketGateway, WebSocketServer, OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({ cors: { origin: '*' } }) // Permettre les connexions depuis le frontend
export class InventoryGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer() server: Server;

  afterInit() {
    console.log('WebSocket Initialized 🚀');
  }

  handleConnection(client: Socket) {
    console.log(`🔌 Client connecté : ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    console.log(`⚡ Client déconnecté : ${client.id}`);
  }

  notifyInventoryLaunch() {
    console.log('📢 Envoi de la notification de lancement d\'inventaire');
    this.server.emit('inventory-launched', { message: 'Un nouvel inventaire a été lancé !' });
  }
}

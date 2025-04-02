import { WebSocketGateway, WebSocketServer, OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({ cors: { origin: '*' } }) 
export class InventoryGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer() server: Server;

  afterInit() {
    console.log('WebSocket Initialized ');
  }

  handleConnection(client: Socket) {
    console.log(` Client connected : ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    console.log(` Client disconnected : ${client.id}`);
  }

  notifyInventoryLaunch() {
    console.log(' Sending inventory launch notification');
    this.server.emit('inventory-launched', { message: 'A new inventory has been launched !' });
  }
}

import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class RidesGateway {
  @WebSocketServer()
  server: Server;

  @SubscribeMessage('driver_online')
  handleDriverOnline(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { driverId: string },
  ) {
    client.join('drivers_online');
    console.log(`🚖 Motorista ${data.driverId} entrou na sala de corridas.`);
  }

  // 2. Método chamado pelo RidesService ao criar uma nova corrida
  notifyDriversNewRide(rideData: any) {
    // Dispara a nova corrida para TODOS os motoristas conectados na sala 'drivers_online'
    this.server.to('drivers_online').emit('new_ride_requested', rideData);
  }
  // 1. Ouvir atualização de GPS do motorista e retransmitir
  @SubscribeMessage('driver:updateLocation')
  handleLocationUpdate(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { driverId: string; lat: number; lng: number },
  ) {
    this.server.emit(`driver:location:${data.driverId}`, data);
  }

  // Método auxiliar chamado pelo Service para emitir nova corrida criada
  notifyNewRide(ride: any) {
    this.server.emit('ride:newOffer', ride);
  }

  // Método auxiliar chamado pelo Service para emitir mudança de status
  notifyRideStatusUpdate(rideId: string, ride: any) {
    this.server.emit(`ride:status:${rideId}`, ride);
  }
}

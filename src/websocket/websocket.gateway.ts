import {
  WebSocketGateway,
  WebSocketServer,
  type OnGatewayConnection,
  type OnGatewayDisconnect,
  SubscribeMessage,
} from "@nestjs/websockets";
import { Server, Socket } from "socket.io";
import { JwtService } from "@nestjs/jwt";
import { OrderItemStatus } from "@prisma/client";

@WebSocketGateway({
  cors: {
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
    credentials: true,
  },
})
export class WebsocketGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server: Server;

  private connectedUsers = new Map<string, { socket: Socket; role: string }>();

  constructor(private jwtService: JwtService) {}

  async handleConnection(client: Socket) {
    try {
      const token = client.handshake.auth.token;
      if (!token) {
        client.disconnect();
        return;
      }

      const payload = this.jwtService.verify(token);
      this.connectedUsers.set(client.id, {
        socket: client,
        role: payload.role,
      });

      // Join role-based room
      client.join(`role:${payload.role}`);
      console.log(`Client connected: ${client.id} (${payload.role})`);
    } catch (error) {
      client.disconnect();
    }
  }

  handleDisconnect(client: Socket) {
    this.connectedUsers.delete(client.id);
    console.log(`Client disconnected: ${client.id}`);
  }

  @SubscribeMessage("join:room")
  handleJoinRoom(client: Socket, roomId: string) {
    client.join(`room:${roomId}`);
  }

  @SubscribeMessage("leave:room")
  handleLeaveRoom(client: Socket, roomId: string) {
    client.leave(`room:${roomId}`);
  }

  // Emit events
  emitOrderCreated(order: any) {
    this.server.emit("order:new", order);
  }

  emitOrderUpdated(order: any) {
    this.server.emit("order:updated", order);
    this.server.to(`room:${order.roomId}`).emit("order:room:updated", order);
  }

  emitItemStatusChanged(order: any, itemId: string, status: OrderItemStatus) {
    this.server.emit("order:item:status", { order, itemId, status });
  }

  emitKitchenNew(order: any, item: any) {
    this.server.to("role:CHEF").emit("kitchen:new", { order, item });
  }

  emitKitchenReady(order: any, item: any) {
    this.server.to("role:WAITER").emit("kitchen:ready", { order, item });
  }
}

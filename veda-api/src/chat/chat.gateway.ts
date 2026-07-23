import { 
  WebSocketGateway, SubscribeMessage, MessageBody, WebSocketServer, 
  OnGatewayConnection, OnGatewayDisconnect, ConnectedSocket
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { ChatService } from './chat.service';

@WebSocketGateway({ cors: { origin: '*' } })
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  constructor(private readonly chatService: ChatService) {}

  handleConnection(client: Socket) {}
  handleDisconnect(client: Socket) {}

  // 🚀 1. REGISTER USER & JOIN ROOMS
  @SubscribeMessage('register')
  async handleRegister(@ConnectedSocket() client: Socket, @MessageBody() payload: { userId: string; role: string }) {
    if (!payload.userId) return;

    client.join('GLOBAL');
    client.join(payload.role); 
    client.join(payload.userId); // Their private DM room

    // Send them their secure history
    const history = await this.chatService.getChatHistory(payload.userId, payload.role);
    client.emit('chatHistory', history);
  }

  // 🚀 2. ROUTE NEW MESSAGES
  @SubscribeMessage('sendMessage')
  async handleMessage(@MessageBody() payload: { senderId: string; senderName: string; senderRole: string; text: string; channelId: string }) {
    
    // Save to database
    const savedMsg = await this.chatService.saveMessage(
      payload.senderId, payload.senderName, payload.senderRole, payload.text, payload.channelId
    );

    const messageToSend = {
      _id: savedMsg._id,
      senderId: savedMsg.senderId,
      senderName: savedMsg.senderName,
      senderRole: savedMsg.senderRole,
      text: savedMsg.text,
      channelId: savedMsg.channelId,
      createdAt: (savedMsg as any).createdAt || new Date(),
    };

    // Broadcast to the target (Either a Channel like 'GLOBAL', or a User's Private Room)
    this.server.to(payload.channelId).emit('newMessage', messageToSend);

    // If it's a DM, also bounce it back to the Sender so they can see what they just typed!
    const isDM = !['GLOBAL', 'DOCTOR', 'RECEPTIONIST', 'SUPER_ADMIN', 'ADMIN'].includes(payload.channelId);
    if (isDM && payload.senderId !== payload.channelId) {
      this.server.to(payload.senderId).emit('newMessage', messageToSend);
    }
  }
}
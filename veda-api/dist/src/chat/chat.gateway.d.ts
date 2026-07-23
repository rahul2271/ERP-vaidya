import { OnGatewayConnection, OnGatewayDisconnect } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { ChatService } from './chat.service';
export declare class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
    private readonly chatService;
    server: Server;
    constructor(chatService: ChatService);
    handleConnection(client: Socket): void;
    handleDisconnect(client: Socket): void;
    handleRegister(client: Socket, payload: {
        userId: string;
        role: string;
    }): Promise<void>;
    handleMessage(payload: {
        senderId: string;
        senderName: string;
        senderRole: string;
        text: string;
        channelId: string;
    }): Promise<void>;
}

import { Logger } from '@nestjs/common';
import { MessageBody, OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { UserController } from 'src/controller/user.controller';
import { RequestSignIn, RequestSignUp } from 'src/model/request.model';
import { EventInterface, EventStatus, EventTypes } from 'src/model/socket.io.model';
import { UserService } from 'src/service/user.service';

@WebSocketGateway(8080, { transports: ['websocket'] }
  // { 
  //   namespace: 'chat',
  //   cors: { origin: '*' },
  // }
)

export class EventsGateway  
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer() server: Server;
  private logger: Logger = new Logger('EventsGateway');

  constructor(private userService: UserService) {}

  @SubscribeMessage('message')
  async handleEvent(@MessageBody() data: EventInterface): Promise<EventInterface> {
    this.logger.log(`message : ${data}`);
    return data;
  }

  afterInit(server: Server) {
    this.logger.log('웹소켓 서버 초기화');
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`Client Disconnected : ${client.id}`);
  }

  handleConnection(client: Socket, ...args: any[]) {
    this.logger.log(`Client Connected : ${client.id}`);
  }

  @SubscribeMessage(EventTypes.Socket_Client_SignUp)
  async handleSignup(client: Socket, data: EventInterface): Promise<void> {
    const result = await this.userService.createPlayer(data.data as RequestSignUp);
    client.emit(EventTypes.Socket_Client_SignUp, this.handleResponse(EventTypes.Socket_Client_SignUp, result.status, result.data));
  }

  @SubscribeMessage(EventTypes.Socket_Client_SignIn)
  async handleSignin(client: Socket, data: EventInterface): Promise<void> {
    const result = await this.userService.findPlayer(data.data as RequestSignIn);
    client.emit(EventTypes.Socket_Client_SignIn, this.handleResponse(EventTypes.Socket_Client_SignIn, result.status, result.data));
  }

  handleResponse(event: EventTypes, status: EventStatus, data: {[k: string]: any} = {}) {
    return {
      event,
      data,
      ack: {
        status,
        isError: status === EventStatus.Success ? false : true
      }
    }
  }
}

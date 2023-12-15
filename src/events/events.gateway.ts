import { Logger } from '@nestjs/common';
import { MessageBody, OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { RequestChangeTeam, RequestJoinRoom, RequestSignIn, RequestSignUp } from 'src/model/request.model';
import { EventInterface, EventStatus, EventTypes } from 'src/model/socket.io.model';
import { CommonService } from 'src/service/common.service';
import { RoomService } from 'src/service/room.service';
import { UserService } from 'src/service/user.service';

@WebSocketGateway(8080, 
  { transports: ['websocket'] }
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

  constructor(
    private userService: UserService,
    private roomService: RoomService,
    private commonService: CommonService
  ) {}

  @SubscribeMessage('message')
  async handleEvent(@MessageBody() data: EventInterface): Promise<EventInterface> {
    this.logger.log(`message : ${data}`);
    return data;
  }

  // 초기화 체크용
  afterInit(server: Server) {
    this.logger.log('웹소켓 서버 초기화');
  }

  // 소켓 끊김
  async handleDisconnect(client: Socket) {
    this.logger.log(`Client Disconnected : ${client.id}`);
    
    const result = await this.roomService.leaveRoom(client["playerId"]);
    if (result.status === EventStatus.IsUpdate) {
      // 나간것을 방에 있는 인원들에게 알려줌
      this.server
          .to(result.data.room.roomId)
          .emit(EventTypes.Socket_Server_UpdateRoom, this.handleResponse(EventTypes.Socket_Server_UpdateRoom, EventStatus.Success, result.data));
    }
  }

  // 소켓 연결
  handleConnection(client: Socket, ...args: any[]) {
    this.logger.log(`Client Connected : ${client.id}`);
  }

  // DB 초기화
  @SubscribeMessage(EventTypes.Socket_Client_ClearDatabase)
  async handleClearDatabase(client: Socket, data: EventInterface): Promise<void> {
     const result = await this.commonService.clearDatabase();

     client.emit(EventTypes.Socket_Client_ClearDatabase, this.handleResponse(EventTypes.Socket_Client_ClearDatabase, result.status, result.data));
  }

  // 플레이어 추가
  @SubscribeMessage(EventTypes.Socket_Client_SignUp)
  async handleSignup(client: Socket, data: EventInterface): Promise<void> {
    const result = await this.userService.createPlayer(data.data as RequestSignUp);
    
    client.emit(EventTypes.Socket_Client_SignUp, this.handleResponse(EventTypes.Socket_Client_SignUp, result.status, result.data));
  }

  // 플레이어 접속
  @SubscribeMessage(EventTypes.Socket_Client_SignIn)
  async handleSignin(client: Socket, data: EventInterface): Promise<void> {
    const result = await this.userService.findPlayer(data.data as RequestSignIn);
    client["playerId"] = result.data.playerId;

    client.emit(EventTypes.Socket_Client_SignIn, this.handleResponse(EventTypes.Socket_Client_SignIn, result.status, result.data));
  }

  // 방 생성 후 입장
  @SubscribeMessage(EventTypes.Socket_Client_CreateRoom)
  async handleCreateRoom(client: Socket, data: EventInterface): Promise<void> {
    const result = await this.roomService.createRoom(client["playerId"]);
    
    if (result.status === EventStatus.AlreadyCreated) {
      if (!client.rooms.has(result.data.room.roomId)) { // 이미 들어가있는지 체크
        client.join(result.data.room.roomId);
      }
      client.emit(EventTypes.Socket_Client_JoinRoom, this.handleResponse(EventTypes.Socket_Client_JoinRoom, result.status, result.data));
      
    } else {
      if (result.status === EventStatus.Success) {
        client.join(result.data.room.roomId);
      }
      
      client.emit(EventTypes.Socket_Client_SignIn, this.handleResponse(EventTypes.Socket_Client_SignIn, result.status, result.data));
    }
  }

  // 방에 입장
  @SubscribeMessage(EventTypes.Socket_Client_JoinRoom)
  async handleJoinRoom(client: Socket, data: EventInterface): Promise<void> {
    const result = await this.roomService.joinRoom(client["playerId"], data.data as RequestJoinRoom);
    if (result.status === EventStatus.Success && !client.rooms.has(result.data.room.roomId)) { // 이미 들어가있는지 체크
     
      // 방에 알림
      this.server
      .to(result.data.room.roomId)
      .emit(EventTypes.Socket_Server_UpdateRoom, this.handleResponse(EventTypes.Socket_Server_UpdateRoom, result.status, result.data));

      // 방에 입장
      client.join(result.data.room.roomId);

    }

    client.emit(EventTypes.Socket_Client_JoinRoom, this.handleResponse(EventTypes.Socket_Client_JoinRoom, result.status, result.data));
  }

  // 방에서 나감
  @SubscribeMessage(EventTypes.Socket_Client_LeaveRoom)
  async handleLeaveRoom(client: Socket, data: EventInterface): Promise<void> {
    const result = await this.roomService.leaveRoom(client["playerId"]);
    if (result.status === EventStatus.IsUpdate) {
      // 나간것을 방에 있는 인원들에게 알려줌
      this.server
          .to(result.data.room.roomId)
          .emit(EventTypes.Socket_Server_UpdateRoom, this.handleResponse(EventTypes.Socket_Server_UpdateRoom, EventStatus.Success, result.data));
    }

    client.emit(EventTypes.Socket_Client_LeaveRoom, this.handleResponse(EventTypes.Socket_Client_LeaveRoom, result.status, {}));
  }

  // 팀을 바꿈
  @SubscribeMessage(EventTypes.Socket_Client_ChangeTeam)
  async handleChangeTeam(client: Socket, data: EventInterface): Promise<void> {

    const result = await this.roomService.changeTeam(client["playerId"], data.data as RequestChangeTeam);
    if (result.status === EventStatus.Success) {
      // 방에 있는 사람들에게 변경된 방 전체 내역을 보냄
      this.server
          .to(result.data.room.roomId)
          .emit(EventTypes.Socket_Server_UpdateRoom, this.handleResponse(EventTypes.Socket_Server_UpdateRoom, result.status, result.data));
    } else {

      client.emit(EventTypes.Socket_Client_LeaveRoom, this.handleResponse(EventTypes.Socket_Client_LeaveRoom, result.status, {}));
    }
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

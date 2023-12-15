export interface EventInterface {
  event: EventTypes; // socket.emit()의 1번째 인자인 이벤트 이름입니다.
  data: {    // socket.emit()의 2번째 인자인 Data입니다.
    [k: string]: any;
  };
  ack: {
    status: EventStatus;
    isError: boolean; // socket.emit()의 3번째 인자인 acknowledgement의 response값 입니다.
  };
};

export enum EventTypes {
  Socket_Client_SignUp = 'Socket_Client_SignUp', // 유저 생성
  Socket_Client_SignIn = 'Socket_Client_SignIn', // 유저 접속
  Socket_Client_CreateRoom = 'Socket_Client_CreateRoom', // 방 생성
  Socket_Server_UpdateRoom = 'Socket_Server_UpdateRoom', // 방 정보 갱신
  Socket_Client_JoinRoom = 'Socket_Client_JoinRoom', // 방 접속
  Socket_Client_LeaveRoom = 'Socket_Client_LeaveRoom', // 방 나감
  Socket_Client_ChangeTeam = 'Socket_Client_ChangeTeam', // 팀 변경
};

export enum EventStatus {
    Success = 200,

    InvalidParameter = 401,

    AlreadyCreated = 411,
}
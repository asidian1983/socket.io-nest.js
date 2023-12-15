// 가입하기
export type RequestSignUp = {
  playerId: string;
  passwd: string;
};

// 접속하기
export type RequestSignIn = {
  playerId: string;
  passwd: string;
};

// 룸 만들기
export type RequestCreateRoom = {};

// 룸 입장하기
export type RequestJoinRoom = {
  roomNumber: number;
};

// 룸 나가기
export type RequestLeaveRoom = {};

// 팀 바꾸기
export type RequestChangeTeam = {
  teamId: string;
};

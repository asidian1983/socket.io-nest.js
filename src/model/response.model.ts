export type ResponseRoom = {
  roomId: string;
  roomNumber: number;
  teamList: ResponseTeam[];
};

export type ResponseTeam = {
  teamId: string;
  seatList: ResponseSeat[];
};

export type ResponseSeat = {
  seatId: string;
  teamId: string;
  playerId: string;
};

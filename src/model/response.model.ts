export type Room = {
  roomId: string;
  roomNumber: number;
  teamList: Team[];
};

export type Team = {
  teamId: string;
  seatList: Seat[];
};

export type Seat = {
  seatId: string;
  playerId: string;
};

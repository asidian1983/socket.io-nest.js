export type PlayerData = {
    playerId: string
    seatId: string
    passwd: string
}

export type SeatData = {
    seatId: string
    roomId: string
    playerId: string
}

export type TeamData = {
    teamId: string
    roomId: string
}

export type RoomData = {
    roomId: string
    roomNumber: number
}
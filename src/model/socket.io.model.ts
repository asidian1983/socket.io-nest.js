export type ProtocolInterface = {
    event: string    // socket.emit()의 1번째 인자인 이벤트 이름입니다.
    data: {             // socket.emit()의 2번째 인자인 Data입니다.
        [k: string]: any
    }
    ack: {              // socket.emit()의 3번째 인자인 acknowledgement의 response값 입니다.
        isError: boolean
    }
}

export type Room = {
	roomId: string
	roomNumber: number
	teamList: Team[]
}

export type Team = {
	teamId: string
	seatList: Seat[]
}

export type Seat = {
	seatId: string
	playerId: string
}
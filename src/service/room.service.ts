import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Socket } from 'socket.io';
import { Player, Room, Seat, Team } from 'src/model/db.entity';
import { RequestChangeTeam, RequestJoinRoom, RequestSignIn, RequestSignUp } from 'src/model/request.model';
import { ResponseRoom, ResponseSeat, ResponseTeam } from 'src/model/response.model';
import { ServiceInterface } from 'src/model/service.model';
import { EventStatus, GameConfig } from 'src/model/socket.io.model';
import { Repository } from 'typeorm';

@Injectable()
export class RoomService {
  constructor(
    @InjectRepository(Player) private playerRepository: Repository<Player>,
    @InjectRepository(Seat) private seatRepository: Repository<Seat>,
    @InjectRepository(Team) private teamRepository: Repository<Team>,
    @InjectRepository(Room) private roomRepository: Repository<Room>,
  ) {}

  // 방 생성
  async createRoom(playerId: string): Promise<ServiceInterface> {
    if (!playerId) {
      return {
        status: EventStatus.NotFoundUser,
        data: {}
      }
    }
    // 방에 입장해 있는지 체크한다.
    const seat: Seat = await this.seatRepository.findOneBy({ playerId });
    if (seat && seat.roomId) {
      
      // 방에 입장해 있으면 입장해 있는 방의 정보를 리턴해서 조인을 시킨다.
      const getInfo = await this.getRoomInfoData(seat.playerId);
      if (getInfo.status === EventStatus.Success) {
        return {
          status: EventStatus.AlreadyCreated,
          data: getInfo.room
        }
      }
    } 

    const newRoomId = this.generateRandomString();
    const room = await this.roomRepository.save({roomId: newRoomId });

    const newTeamId1 = this.generateRandomString();
    const newTeamId2 = this.generateRandomString();
    const team1 = await this.teamRepository.save({teamId: newTeamId1, roomId: newRoomId });
    const team2 = await this.teamRepository.save({teamId: newTeamId2, roomId: newRoomId });

    let newSeat = null
    if (!seat) {
      newSeat = await this.seatRepository.save({seatId: playerId, roomId: newRoomId, teamId: newTeamId1, playerId});
    } else {
      newSeat = await this.seatRepository.update({seatId: playerId}, {roomId: newRoomId, teamId: newTeamId1});
    }

    // 생성 서비스 
    return {
      status: EventStatus.Success,
      data: {
        room: {
          roomId: newRoomId,
          roomNumber: room.roomNumber,
          teamList: [{
            ...team1,
            seatList: [newSeat]
          }, {...team2, seatList:[]}]
        }
      }
    }
  }

  // 방 접속
  async joinRoom(playerId: string, data: RequestJoinRoom): Promise<ServiceInterface> {
    if (!playerId || !data.roomNumber) {
      return {
        status: EventStatus.InvalidParameter,
        data: {}
      }
    }

    const room = await this.roomRepository.findOneBy({roomNumber: data.roomNumber});
    if (!room) { // 방이 없다
      return {
        status: EventStatus.NotFoundRoom,
        data: {}
      }
    }

    // 방 정보 가져오기
    const getRoomInfo = await this.getRoomInfoData(room.roomId);
    if (!getRoomInfo.room) {
      return {
        status: EventStatus.NotFoundRoom,
        data: {}
      }
    }
    const roomInfo = getRoomInfo.room as ResponseRoom;

    // 입장 시킬 팀 선정
    let teamId = "";
    let teamCur = 0;
    if (roomInfo.teamList[0].seatList.length > roomInfo.teamList[1].seatList.length) {
      teamId = roomInfo.teamList[1].teamId;
      teamCur = 1;
    } else {
      teamId = roomInfo.teamList[0].teamId;
    }

    const seat = await this.seatRepository.save({seatId: playerId, roomId: room.roomId, teamId, playerId});
    roomInfo.teamList[teamCur].seatList.push({...seat});

    return {
      status: EventStatus.Success,
      data: {
        room: roomInfo
      }
    }
  }

  async leaveRoom(playerId: string): Promise<ServiceInterface> {
    if (!playerId) {
      return {
        status: EventStatus.InvalidParameter,
        data: {}
      }
    }

    const seat: Seat = await this.seatRepository.findOneBy({ playerId });
    if (!seat || !seat.roomId) {
      return {
        status: EventStatus.AlreadyLeaved,
        data: {}
      }
    } 

    await this.seatRepository.delete({playerId});
    const _seatList = await this.seatRepository.findBy({ roomId: seat.roomId });
    if (!_seatList.length) { // 방에 아무도 없어서 팀과 방을 정리한다.
  
      await this.teamRepository.delete({roomId: seat.roomId});
      await this.roomRepository.delete({roomId: seat.roomId});

      return {
        status: EventStatus.Success,
        data: {}
      }
    } else { // 방에 누가 남아있어서 쏴줘야한다.

      return {
        status: EventStatus.IsUpdate,
        data: {
          room: await this.getRoomInfoData(seat.roomId)
        }
      }
    }
  }

  async changeTeam(playerId: string, data: RequestChangeTeam): Promise<ServiceInterface> {
    if (!playerId && !data.teamId) {
      return {
        status: EventStatus.InvalidParameter,
        data: {}
      }
    }

    const _seatList = await this.seatRepository.findBy({teamId: data.teamId});
    if (_seatList.length >= GameConfig.TeamInitMaxValue) {
      return {
        status: EventStatus.TeamIsFull,
        data: {}
      }
    }

    const seat = await this.seatRepository.findOneBy({playerId});
    if (!seat) {
      return {
        status: EventStatus.AlreadyLeaved,
        data: {}
      }
    }

    await this.seatRepository.update({playerId}, {teamId: data.teamId});

    return {
      status: EventStatus.Success,
      data: {
        room: await this.getRoomInfoData(seat.roomId)
      }
    }
  }

  async getRoomInfoData(roomId: string) {
    const _teamList = await this.teamRepository.findBy({ roomId: roomId });      
      const room = await this.roomRepository.findOneBy({ roomId: roomId });
      const _seatList = await this.seatRepository.findBy({ roomId: roomId });
      
      if (_teamList.length && _seatList.length && room) {
        const teamList: ResponseTeam[] = [];
        for (const team of teamList) {
          const seatList = _seatList.filter((seat) => {
            return seat.teamId === team.teamId
          })

          teamList.push({
            teamId: team.teamId,
            seatList
          })
        }

        return {
          status: EventStatus.Success,
          room: {
            roomId: room.roomId,
            roomNumber: room.roomNumber,
            teamList
          } as ResponseRoom
        }
      } else {
        return {
          status: EventStatus.InvalidParameter,
          room: {}
        }
      }
  }

  private generateRandomString(num: number = 40) {
    const characters ='ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
    let result = '';
    const charactersLength = characters.length;
    for (let i = 0; i < num; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
  
    return result;
  }

  // 플레이어 검색
  async findPlayer(data: RequestSignIn): Promise<ServiceInterface> {
    // 파라미터 체크
    if (!data.playerId || !data.passwd) {
      return {
          status: EventStatus.InvalidParameter,
          data: {}
      }
    }
    
    return {
      status: EventStatus.Success,
      data: await this.playerRepository.findOneBy(data)
    }
  }

  //
}

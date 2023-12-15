import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Player, Room, Seat, Team } from 'src/model/db.entity';
import { RequestSignIn, RequestSignUp } from 'src/model/request.model';
import { ServiceInterface } from 'src/model/service.model';
import { EventStatus } from 'src/model/socket.io.model';
import { Repository } from 'typeorm';

@Injectable()
export class RoomService {
  constructor(
    @InjectRepository(Player) private playerRepository: Repository<Player>,
    @InjectRepository(Seat) private seatRepository: Repository<Seat>,
    @InjectRepository(Team) private teamRepository: Repository<Team>,
    @InjectRepository(Room) private roomRepository: Repository<Room>,
  ) {}

  // 플레이어 생성
  async createPlayer(data: RequestSignUp): Promise<ServiceInterface> {
    // 파라미터 체크
    if (!data.playerId || !data.passwd) {
      return {
          status: EventStatus.InvalidParameter,
          data: {}
      }
    }

    // 생성 서비스 
    return {
      status: EventStatus.Success,
      data: await this.playerRepository.save({ ...data })
    }
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

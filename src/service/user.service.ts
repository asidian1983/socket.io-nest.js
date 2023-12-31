import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Player } from 'src/model/db.entity';
import { RequestSignIn, RequestSignUp } from 'src/model/request.model';
import { ServiceInterface } from 'src/model/service.model';
import { EventStatus } from 'src/model/socket.io.model';
import { Repository } from 'typeorm';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(Player) private playerRepository: Repository<Player>,
  ) {}

  async getHello(): Promise<string> {
    const time = new Date().getTime();
    const result = await this.createPlayer({playerId: `test${time}`, passwd: "test"});
    console.log("result", result);
    const result2 = await this.findPlayer({playerId: `test${time}`, passwd: "test"});
    console.log(`result2`, result2)
    return 'Hello World!';
  }

  // 플레이어 생성
  async createPlayer(data: RequestSignUp): Promise<ServiceInterface> {
    // 파라미터 체크
    if (!data.playerId || !data.passwd) {
      return {
          status: EventStatus.InvalidParameter,
          data: {}
      }
    }

    const player = await this.playerRepository.findOneBy({playerId: data.playerId});
    if (player) {
      return {
        status: EventStatus.AlreadyCreated,
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
}

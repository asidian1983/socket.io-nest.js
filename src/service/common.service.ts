import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Player, Room, Seat, Team } from 'src/model/db.entity';
import { ServiceInterface } from 'src/model/service.model';
import { EventStatus } from 'src/model/socket.io.model';
import { Repository } from 'typeorm';

@Injectable()
export class CommonService {
  constructor(
    @InjectRepository(Player) private playerRepository: Repository<Player>,
    @InjectRepository(Seat) private seatRepository: Repository<Seat>,
    @InjectRepository(Team) private teamRepository: Repository<Team>,
    @InjectRepository(Room) private roomRepository: Repository<Room>,
  ) {}

  async clearDatabase(): Promise<ServiceInterface> {
    await this.playerRepository.delete({});
    await this.seatRepository.delete({});
    await this.teamRepository.delete({});
    await this.roomRepository.delete({});
    return {
      status: EventStatus.Success,
      data: {}
    };
  }
}

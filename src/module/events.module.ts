import { Module } from '@nestjs/common';
import { EventsGateway } from '../events/events.gateway';
import { UserController } from 'src/controller/user.controller';
import { UserService } from 'src/service/user.service';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TypeOrmConfigService } from 'src/service/db.config.service';
import { Player, Room, Seat, Team } from 'src/model/db.entity';
import { RoomService } from 'src/service/room.service';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }), // env 설정
    TypeOrmModule.forRootAsync({ useClass: TypeOrmConfigService}), // typeorm 접속 설정
    TypeOrmModule.forFeature([Player, Seat, Team, Room]), // typeorm 사용 entity 주입
    EventsModule // socket.io 
  ],
  controllers: [UserController],
  providers: [EventsGateway, UserService, RoomService],
})
export class EventsModule {}

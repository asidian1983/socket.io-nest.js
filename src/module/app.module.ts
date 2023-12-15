import { Module } from '@nestjs/common';
import { UserService } from '../service/user.service';
import { EventsModule } from './events.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TypeOrmConfigService } from '../service/db.config.service';
import { ConfigModule } from '@nestjs/config';
import { Player } from 'src/model/db.entity';
import { UserController } from 'src/controller/user.controller';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }), // env 설정
    TypeOrmModule.forRootAsync({ useClass: TypeOrmConfigService}), // typeorm 접속 설정
    TypeOrmModule.forFeature([Player]), // typeorm 사용 entity 주입
    EventsModule // socket.io 
  ],
  controllers: [UserController],
  providers: [UserService],
})
export class AppModule {}

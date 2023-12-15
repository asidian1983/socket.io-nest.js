import { Controller, Get } from '@nestjs/common';
import { UserService } from '../service/user.service';
import { EventInterface, EventStatus, EventTypes } from 'src/model/socket.io.model';
import { RequestSignUp } from 'src/model/request.model';
import { ServiceInterface } from 'src/model/service.model';

@Controller()
export class UserController {

  constructor(private readonly userService: UserService) {}

  @Get()
  async getHello(): Promise<string> {
    return await this.userService.getHello();
  }

  // 가입 체크 
  async signup(data: RequestSignUp): Promise<ServiceInterface> {
    console.log('signup start')
    // 파라미터 체크
    if (!data.playerId || !data.passwd) {
      return {
          status: EventStatus.InvalidParameter,
          data: {}
      }
    }

    // 생성 서비스 
    const result = await this.userService.createPlayer(data);
    if (result.status !== EventStatus.Success) {
      return {
        status: EventStatus.AlreadyCreated,
        data: {}
      }
    }

    return {
      status: EventStatus.Success,
      data: {}
    }
  }
}

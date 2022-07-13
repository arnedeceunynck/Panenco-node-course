import { createAccessToken, Representer } from '@panenco/papi';
import { Body, JsonController, Post } from 'routing-controllers';

import { AccessTokenView } from '../../contracts/acces.token.view';
import { LoginBody } from '../../contracts/login.body';
import { login } from './handlers/login.handler';

@JsonController('/auth')
export class AuthController {
  @Post('/tokens')
  @Representer(AccessTokenView)
  async create(@Body() body: LoginBody) {
    return login(body); 
  }
}
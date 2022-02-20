import { Test, TestingModule } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
import { AuthenticationController } from './authentication.controller';
import { AuthenticationService } from '../service/authentication.service';
import { RefreshTokensService } from '../service/refreshTokens.service';
import { LoggerModule, PinoLogger } from 'nestjs-pino';

const resAutenticar = {
  refresh_token: '123',
  data: { access_token: 'aaa.bbb.ccc', id: '12132' },
};
const resValidarUsuario = { id: '111111', usuario: 'usuario' };
const refreshToken = { resfresh_token: '1' };

const mockResponse = (): any => {
  const res: any = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  res.cookie = jest.fn().mockReturnValue(res);
  res.send = jest.fn().mockReturnValue(res);
  return res;
};

const mockRequest = (sessionData, body) => ({
  session: { data: sessionData },
  body,
});

describe('AuthenticationController', () => {
  let controller: AuthenticationController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [LoggerModule.forRoot()],
      controllers: [AuthenticationController],
      providers: [
        {
          provide: AuthenticationService,
          useValue: {
            autenticar: jest.fn(() => resAutenticar),
            validarUsuario: jest.fn(() => resValidarUsuario),
          },
        },
        {
          provide: RefreshTokensService,
          useValue: {
            create: jest.fn(() => refreshToken),
            createAccessToken: jest.fn(() => refreshToken),
          },
        },
        {
          provide: ConfigService,
          useValue: {
            REFRESH_TOKEN_EXPIRES_IN: 100,
          },
        },
        PinoLogger,
      ],
    }).compile();

    controller = module.get<AuthenticationController>(AuthenticationController);
  });

  it('[login] deberia realizar una autenticacion exitosa.', async () => {
    const req = mockRequest({}, { user: 'boss' });
    const res = mockResponse();
    await controller.login(req, res);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.send).toHaveBeenCalledWith({
      datos: resAutenticar?.data,
      finalizado: true,
      mensaje: 'ok',
    });
    // expect(res.cookie).toHaveBeenCalledWith({ username: 'boss' });
  });
});

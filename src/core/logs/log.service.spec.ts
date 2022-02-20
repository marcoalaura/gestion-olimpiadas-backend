import { Test, TestingModule } from '@nestjs/testing';
import { LogService } from './log.service';

describe('LogService', () => {
  let service: LogService;
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [LogService],
    }).compile();

    service = module.get<LogService>(LogService);
  });

  it('Deberia ser implementado como ', () => {
    expect(service).toBeDefined();
  });
  it('streams', () => {
    expect(LogService.getStream().streams).toEqual([]);
  });
  it('Configuracion', () => {
    expect(LogService.getLoggerConfig().pinoHttp).toHaveProperty('name');
    expect(LogService.getLoggerConfig().pinoHttp).toHaveProperty('genReqId');
    expect(LogService.getLoggerConfig().pinoHttp).toHaveProperty('serializers');
    expect(LogService.getLoggerConfig().pinoHttp).toHaveProperty('level');
    expect(LogService.getLoggerConfig().pinoHttp).toHaveProperty('timestamp');
    expect(LogService.getLoggerConfig().pinoHttp).toHaveProperty('prettyPrint');
  });
});

import { Test, TestingModule } from '@nestjs/testing';

import { SorteoPreguntaService } from './sorteoPregunta.service';
import { EtapaAreaGradoService } from './etapaAreaGrado.service';
import { EtapaService } from './etapa.service';
import { PreguntaRepository } from '../repository/pregunta.repository';
import { CalendarioRepository } from '../repository/calendario.repository';
import { EtapaRepository } from '../repository/etapa.repository';
import { OlimpiadaRepository } from '../olimpiada.repository';
import { EtapaAreaGradoRepository } from '../repository/etapaAreaGrado.repository';
import { AreaRepository } from '../repository/area.repository';
import { GradoEscolaridadRepository } from '../repository/gradoEscolaridad.repository';
import { InscripcionRepository } from '../repository/inscripcion.repository';
import { EstudianteExamenRepository } from '../repository/estudianteExamen.repository';
import { MedalleroPosicionRepository } from '../repository/medalleroPosicion.repository';

const idEtapa = '66b7d7aa-ea70-49c7-8263-906a07668fc1';

describe('SorteoPreguntaService', () => {
  let sorteoPreguntaService: SorteoPreguntaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PreguntaRepository,
        OlimpiadaRepository,
        EtapaRepository,
        EtapaAreaGradoRepository,
        AreaRepository,
        GradoEscolaridadRepository,
        CalendarioRepository,
        InscripcionRepository,
        EstudianteExamenRepository,
        MedalleroPosicionRepository,
        SorteoPreguntaService,
        EtapaService,
        EtapaAreaGradoService,
      ],
    }).compile();
    sorteoPreguntaService = module.get<SorteoPreguntaService>(
      SorteoPreguntaService,
    );
  });

  it('[sortearPreguntas] test', async () => {
    expect('test').toEqual('test');
  });
});

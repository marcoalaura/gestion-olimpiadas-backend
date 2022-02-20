import { MigrationInterface, QueryRunner } from 'typeorm';
import { EtapaAreaGrado } from '../../src/application/olimpiada/entity/EtapaAreaGrado.entity';
import { Pregunta } from '../../src/application/olimpiada/entity/Pregunta.entity';
import {
  TipoPregunta,
  TipoRespuesta,
  NivelDificultad,
} from '../../src/common/constants';

export class preguntas1618588591187 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const items = [
      {
        id: 'c9930379-5dc1-556f-847c-802dd9d1d9b6',
        tipo_respuesta: TipoRespuesta.SELECCION_MULTIPLE,
        tipo_pregunta: TipoPregunta.CURRICULA,
        nivel_dificultad: NivelDificultad.MEDIA,
        texto_pregunta: null,
        respuestas: ['b', 'a', 'd'],
        opciones: {
          a: null,
          b: null,
          c: null,
          d: null,
        },
        id_etapa_area_grado: '793e2227-770d-5692-8852-d9efdcc6a4d7',
        imagenPregunta: 'preguntas__1_.jpg',
      },
      {
        id: '954c7fdb-f54d-47ef-97d0-10464b244652',
        tipo_respuesta: TipoRespuesta.SELECCION_SIMPLE,
        tipo_pregunta: TipoPregunta.CURRICULA,
        nivel_dificultad: NivelDificultad.ALTA,
        texto_pregunta: `
            Un recipiente aislado térmicamente contiene 50 [g] de hielo a 0 [°C). Se vierte agua a 70 [°C) y luego de cierto tiempo el sistema alcanza el equilibrio a una temperatura de 20 [°C). ¿Qué cantidad de agua en  [g] se colocó? (Calor de fusión  del hielo 80 [cal/g]
                `,
        respuestas: ['b'],
        opciones: {
          a: '200 l',
          b: '100 l',
          c: '300 l',
          d: 'Ninguna respuesta anterior es correcta.',
        },
        id_etapa_area_grado: '793e2227-770d-5692-8852-d9efdcc6a4d7',
        imagenPregunta: null,
      },
      {
        id: '97974c41-9964-4b2a-989e-1061fdfb22fd',
        tipo_respuesta: TipoRespuesta.SELECCION_MULTIPLE,
        tipo_pregunta: TipoPregunta.CURRICULA,
        nivel_dificultad: NivelDificultad.ALTA,
        texto_pregunta: `
                En la electrización por frotamiento: 
                `,
        respuestas: ['a', 'b'],
        opciones: {
          a: 'Los cuerpos se cargan con diferente tipo de carga',
          b: 'Los cuerpos se cargan con misma cantidad',
          c:
            'Los 2 cuerpos se cargan con igual tipo de carga pero distinta cantidad',
          d: 'Ninguna respuesta anterior es correcta.',
        },
        id_etapa_area_grado: '793e2227-770d-5692-8852-d9efdcc6a4d7',
        imagenPregunta: null,
      },
      {
        id: '87974c41-9964-4b2a-989e-1061fdfb22f1',
        tipo_respuesta: TipoRespuesta.SELECCION_SIMPLE,
        tipo_pregunta: TipoPregunta.CURRICULA,
        nivel_dificultad: NivelDificultad.BAJA,
        texto_pregunta: `
                Un cañón dispara un proyectil con una velocidad inicial de 400 m/seg que forma un ángulo de 30° con la horizontal. Calcular:
                Las ecuaciones del movimiento y la ecuación de la trayectoria.
                La altura máxima y el alcance.
                El ángulo qué forma la velocidad horizontal al pasar por la posición xx ( figura adjunta)
                tiro parábolico
                `,
        respuestas: ['a'],
        opciones: {
          a: '30 grados',
          b: '70 grados',
          c: '45 grados',
          d: 'Ninguna respuesta anterior es correcta.',
        },
        id_etapa_area_grado: '793e2227-770d-5692-8852-d9efdcc6a4d7',
        imagenPregunta: null,
      },
      {
        id: '87984c41-9964-4b2a-989e-1061fdfb22f1',
        tipo_respuesta: TipoRespuesta.SELECCION_MULTIPLE,
        tipo_pregunta: TipoPregunta.CURRICULA,
        nivel_dificultad: NivelDificultad.ALTA,
        texto_pregunta: `
              Afirmacion(es) sobre energía potencial y mecánica:
                `,
        respuestas: ['a', 'b', 'c'],
        opciones: {
          a:
            'La energía mecánica del cuerpo permanece constante durante toda la caída',
          b: 'La energía potencial varía linealmente con la altura',
          c:
            ' Supuesto el suelo como nivel de energía potencial nula, la energía potencial iguala a la cinética a la mitad del camino entre el nivel inicial y el suelo ',
          d: 'Ninguna respuesta anterior es correcta.',
        },
        id_etapa_area_grado: '793e2227-770d-5692-8852-d9efdcc6a4d7',
        imagenPregunta: null,
      },

      // matematica
      {
        id: '87984c41-9964-4b2a-989e-1001fdfb22f1',
        tipo_respuesta: TipoRespuesta.SELECCION_SIMPLE,
        tipo_pregunta: TipoPregunta.CURRICULA,
        nivel_dificultad: NivelDificultad.BAJA,
        texto_pregunta: `
          En un sistema de coordenadas rectangulares, un círculo con su centro en el origen pasa a través del punto (4√2 , 5√2).

          ¿Cuál es la longitud del arco S?
                `,
        respuestas: ['a'],
        opciones: {
          a: 'R θ = √ (4√2)2 + (5√2)2 arctan(5 / 4)',
          b: 'R θ = √ (4√2)2 + (5√2)2 arctan(5 / 8)',
          c: 'R θ = √ (4√2)2 + (5√2)2 cos(5 / 8)',
          d: 'Ninguna respuesta anterior es correcta.',
        },
        id_etapa_area_grado: 'c9930379-5dc1-556f-847c-802dd9d1d9b6',
        imagenPregunta: null,
      },
      {
        id: '87984c41-9964-4b2a-989e-2071fdfb22f1',
        tipo_respuesta: TipoRespuesta.SELECCION_SIMPLE,
        tipo_pregunta: TipoPregunta.CURRICULA,
        nivel_dificultad: NivelDificultad.MEDIA,
        texto_pregunta: `
              La longitud de los minutos en un reloj es de 4.5 cm. Encuentre la longitud del arco trazada al final de la manecilla de minutos entre 11:10 pm e 11:50 pm.
                `,
        respuestas: ['b'],
        opciones: {
          a: 'R θ = 4.5 cm 250 × π / 110',
          b: 'R θ = 4.5 cm 240 × π / 180',
          c: 'R θ = 4.5 cm 240 × π / 180',
          d: 'R θ = 4.5 cm 260 × π / 130',
        },
        id_etapa_area_grado: 'c9930379-5dc1-556f-847c-802dd9d1d9b6',
        imagenPregunta: null,
      },
      {
        id: '87984c41-9964-4b2a-989e-2081fdfb22f1',
        tipo_respuesta: TipoRespuesta.FALSO_VERDADERO,
        tipo_pregunta: TipoPregunta.CURRICULA,
        nivel_dificultad: NivelDificultad.MEDIA,
        texto_pregunta: `
                Si el limx→∞f(x)=∞ylimx→∞g(x)=−∞ entonces limx→∞[f(x)+g(x)]=0
                `,
        respuestas: ['FALSO'],
        opciones: null,
        id_etapa_area_grado: 'c9930379-5dc1-556f-847c-802dd9d1d9b6',
      },
      {
        id: '87984c41-9964-4b2a-989e-2091fdfb22f1',
        tipo_respuesta: TipoRespuesta.SELECCION_MULTIPLE,
        tipo_pregunta: TipoPregunta.CURRICULA,
        nivel_dificultad: NivelDificultad.ALTA,
        texto_pregunta: `
                Sea f definida en un intervalo I que contiene al punto c. Si f(c) es un valor extremo,entonces c debe ser un punto crítico; es decir,c es alguno o varios de los siguientes:
                `,
        respuestas: ['a', 'b'],
        opciones: {
          a: 'Un punto fronterizo de I',
          b:
            'Un punto singular de f; esto es, un punto en donde la derivada f(c) no existe',
          c: 'No es un punto fronterizo de I',
          d: 'No es punto singular ni fronterizo de I',
        },
        id_etapa_area_grado: 'c9930379-5dc1-556f-847c-802dd9d1d9b6',
      },
      {
        id: '87984c41-9964-4b2a-989e-2101fdfb22f1',
        tipo_respuesta: TipoRespuesta.SELECCION_SIMPLE,
        tipo_pregunta: TipoPregunta.CURRICULA,
        nivel_dificultad: NivelDificultad.ALTA,
        texto_pregunta: null,
        respuestas: ['c'],
        opciones: {
          a: '',
          b: '',
          c: '',
        },
        id_etapa_area_grado: 'c9930379-5dc1-556f-847c-802dd9d1d9b6',
        imagenPregunta: null,
      },
    ];
    const data = items.map((item) => {
      const e = new Pregunta();
      e.id = item.id;
      e.tipoRespuesta = item.tipo_respuesta;
      e.tipoPregunta = item.tipo_pregunta;
      e.nivelDificultad = item.nivel_dificultad;
      e.textoPregunta = item.texto_pregunta;
      e.respuestas = item.respuestas;
      e.opciones = item.opciones;
      const etapaAreaGrado = new EtapaAreaGrado();
      etapaAreaGrado.id = item.id_etapa_area_grado;
      e.etapaAreaGrado = etapaAreaGrado;
      e.imagenPregunta = item.imagenPregunta;
      e.usuarioCreacion = 'seeders';
      return e;
    });
    await queryRunner.manager.save(data);
  }

  public async down(queryRunner: QueryRunner): Promise<void> { }
}

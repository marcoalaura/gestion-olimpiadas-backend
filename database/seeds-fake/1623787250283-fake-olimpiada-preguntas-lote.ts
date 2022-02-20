import LOGO2020 from 'src/application/olimpiada/templates_carbon/logo2020';
import {MigrationInterface, QueryRunner} from "typeorm";
import { v4 } from 'uuid';

import { Olimpiada } from '../../src/application/olimpiada/entity/Olimpiada.entity';
import { Etapa } from '../../src/application/olimpiada/entity/Etapa.entity';
import { Area } from '../../src/application/olimpiada/entity/Area.entity';
import { GradoEscolaridad } from '../../src/application/olimpiada/entity/GradoEscolaridad.entity';
import { EtapaAreaGrado } from '../../src/application/olimpiada/entity/EtapaAreaGrado.entity';
import { Calendario } from '../../src/application/olimpiada/entity/Calendario.entity';
import { MedalleroPosicion } from '../../src/application/olimpiada/entity/MedalleroPosicion.entity'
import { MedalleroPosicionRural } from '../../src/application/olimpiada/entity/MedalleroPosicionRural.entity'

import { tiposEtapa } from '../../src/common/constants';

export class fakeOlimpiada1623787250283 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const fecha = new Date()

    /**
     * Olimpiadas
     */
    const olimpiadasRaw = [
      {
        id: v4(),
        nombre: `Olimpiada para probar subir preguntas`,
        gestion: 2021,
        sigla: `OPPSPPL`,
        fechaInicio: new Date('2021-01-01 00:00'),
        fechaFin: new Date('2021-12-31 00:00'),
        fechaCreacion: new Date('2021-01-01 00:00'),
        usuarioCreacion: 'seeders-fake-2000',
        leyenda: 'leyenda',
        logo: LOGO2020,
        estado: 'ACTIVO',
      },
    ];
    const olimpiadas = olimpiadasRaw.map((item) => {
      const o = new Olimpiada();
      Object.assign(o, item);
      return o;
    });
    await queryRunner.manager.save(olimpiadas);

    /**
     * Etapas
     */
    const etapasRaw = [
      {
        id: v4(),
        nombre: 'Etapa 1 para subir preguntas por lote',
        tipo: tiposEtapa.NACIONAL,
        jerarquia: 3,
        comiteDesempate: true,
        fechaInicio: new Date(),
        fechaFin: new Date(Date.now() + 7*24*3600*1000),
        fechaInicioImpugnacion: new Date(Date.now() + 34*24*3600*1000),
        fechaFinImpugnacion: new Date(Date.now() + 36*24*3600*1000),
        usuarioCreacion: 'seeders-fake',
      },
      {
        id: v4(),
        nombre: 'Etapa 2 para subir preguntas por lote',
        tipo: tiposEtapa.NACIONAL,
        jerarquia: 3,
        comiteDesempate: true,
        fechaInicio: new Date(),
        fechaFin: new Date(),
        fechaInicioImpugnacion: new Date(Date.now() + 34*24*3600*1000),
        fechaFinImpugnacion: new Date(Date.now() + 36*24*3600*1000),
        usuarioCreacion: 'seeders-fake',
      },
    ];
    const etapas = etapasRaw.map((item) => {
      const e = new Etapa();
      Object.assign(e, item);
      e.olimpiada = new Olimpiada();
      e.olimpiada.id = olimpiadas[0].id;
      return e;
    });
    await queryRunner.manager.save(etapas);

    /**
     * Areas
     */
    const areasRaw = ['BIOLOGÍA', 'FÍSICA'];
    const areas = []
    for (let n of areasRaw) {
      let aa = await queryRunner.query(`SELECT * FROM area WHERE nombre = '${n}';`);
      let a = new Area();
      if (aa.length > 0) {
        a = aa[0];
      } else {
        a.id = v4();
        a.nombre = n;
        a.fechaCreacion = new Date();
        a.usuarioCreacion = '1';
        await queryRunner.manager.save([a]);
      }
      areas.push(a);
    }

    /**
     * Etapa Area Grado
     */
    const grados = await queryRunner.query('SELECT * FROM grado_escolaridad;');
    const eags = [];
    const puntajeTotal = 100;
    for (let ie in etapas) {
      for (let ia in areas) {
        for (let ig in grados) {
          const eag = new EtapaAreaGrado();
          eag.id = v4();
          eag.duracionMinutos = parseInt(`${Math.random() * 30}`) + 1;

          eag.totalPreguntas = parseInt(`${Math.random() * 21}`) + 10;
          eag.preguntasOlimpiada = parseInt(`${Math.random() * (eag.totalPreguntas + 1)}`);
          eag.preguntasCurricula = eag.totalPreguntas - eag.preguntasOlimpiada;

          if (eag.preguntasOlimpiada && eag.preguntasCurricula) {
            eag.puntosPreguntaOlimpiada = parseInt(`${Math.random() * (puntajeTotal + 1)}`);
            eag.puntosPreguntaCurricula = puntajeTotal - eag.puntosPreguntaOlimpiada;
          } else {
            if (eag.preguntasOlimpiada) {
              eag.puntosPreguntaOlimpiada = puntajeTotal;
              eag.puntosPreguntaCurricula = 0;
            } else {
              eag.puntosPreguntaOlimpiada = 0;
              eag.puntosPreguntaCurricula = puntajeTotal;
            }
          }

          // Calcular cantidad de preguntas y puntajes
          eag.preguntasOlimpiadaBaja = parseInt(`${Math.random() * (eag.preguntasOlimpiada + 1)}`);
          eag.preguntasOlimpiadaMedia = parseInt(`${Math.random() * (eag.preguntasOlimpiada - eag.preguntasOlimpiadaBaja + 1)}`);
          eag.preguntasOlimpiadaAlta = eag.preguntasOlimpiada - eag.preguntasOlimpiadaBaja - eag.preguntasOlimpiadaMedia;

          let pOb = parseInt(`${Math.random() * (eag.puntosPreguntaOlimpiada + 1)}`);
          let pOm = parseInt(`${Math.random() * (eag.puntosPreguntaOlimpiada - pOb + 1)}`);
          let pOa = eag.puntosPreguntaOlimpiada - pOb - pOm;
          if (!eag.preguntasOlimpiadaBaja)
            if (!eag.preguntasOlimpiadaMedia) pOa += pOb;
            else pOm += pOb;
          if (!eag.preguntasOlimpiadaMedia)
            if (!eag.preguntasOlimpiadaAlta) pOb += pOm;
            else pOa += pOm;
          if (!eag.preguntasOlimpiadaAlta)
            if (!eag.preguntasOlimpiadaBaja) pOm += pOa;
            else pOb += pOa;
          eag.puntajeOlimpiadaBaja = eag.preguntasOlimpiadaBaja ? pOb / eag.preguntasOlimpiadaBaja : 0;
          eag.puntajeOlimpiadaMedia = eag.preguntasOlimpiadaMedia ? pOm / eag.preguntasOlimpiadaMedia : 0;
          eag.puntajeOlimpiadaAlta = eag.preguntasOlimpiadaAlta ? pOa / eag.preguntasOlimpiadaAlta : 0;

          eag.usuarioCreacion = `${pOb} - ${pOm} - ${pOa}`;

          // Calcular cantidad de preguntas y puntajes
          eag.preguntasCurriculaBaja = parseInt(`${Math.random() * (eag.preguntasCurricula + 1)}`);
          eag.preguntasCurriculaMedia = parseInt(`${Math.random() * (eag.preguntasCurricula - eag.preguntasCurriculaBaja + 1)}`);
          eag.preguntasCurriculaAlta = eag.preguntasCurricula - eag.preguntasCurriculaBaja - eag.preguntasCurriculaMedia;

          let pCb = parseInt(`${Math.random() * (eag.puntosPreguntaCurricula + 1)}`);
          let pCm = parseInt(`${Math.random() * (eag.puntosPreguntaCurricula - pCb + 1)}`);
          let pCa = eag.puntosPreguntaCurricula - pCb - pCm;
          if (!eag.preguntasCurriculaBaja)
            if (!eag.preguntasCurriculaMedia) pCa += pCb;
            else pCm += pCb;
          if (!eag.preguntasCurriculaMedia)
            if (!eag.preguntasCurriculaAlta) pCb += pCm;
            else pCa += pCm;
          if (!eag.preguntasCurriculaAlta)
            if (!eag.preguntasCurriculaBaja) pCm += pCa;
            else pCb += pCa;
          eag.puntajeCurriculaBaja = eag.preguntasCurriculaBaja ? pCb / eag.preguntasCurriculaBaja : 0;
          eag.puntajeCurriculaMedia = eag.preguntasCurriculaMedia ? pCm / eag.preguntasCurriculaMedia : 0;
          eag.puntajeCurriculaAlta = eag.preguntasCurriculaAlta ? pCa / eag.preguntasCurriculaAlta : 0;

          eag.usuarioActualizacion = `${pCb} - ${pCm} - ${pCa}`;

          eag.nroPosicionesTotal = parseInt(`${Math.random() * 5}`);
          eag.puntajeMinimoClasificacion = parseInt(`${Math.random() * 50}`) + 25;
          eag.color = '#3b4d61';
          eag.cantidadMaximaClasificados = 5;
          eag.criterioCalificacion = false;
          eag.nroPosicionesRural = parseInt(`${Math.random()*2}`);
          // eag.usuarioCreacion = '1';
          eag.etapa = new Etapa();
          eag.etapa.id = etapas[ie].id;
          eag.area = new Area();
          eag.area.id = areas[ia].id;
          eag.gradoEscolar = new GradoEscolaridad();
          eag.gradoEscolar.id = grados[ig].id;
          eag.puntajeMinimoMedallero = 1;
          await queryRunner.manager.save([eag]);
          eags.push(eag);

          const ini = new Date();
          const fin = new Date();
          fin.setMinutes(fin.getMinutes() + parseInt(`${Math.random()*60}`) + 5);;
          const cal = new Calendario();
          cal.id = v4();
          cal.tipoPrueba = Math.random() < 0.2 ? 'OFFLINE' : 'ONLINE';
          cal.fechaHoraInicio = ini;
          cal.fechaHoraFin = fin;
          cal.usuarioCreacion = 'seeders-fake';
          cal.tipoPlanificacion = 'CRONOGRAMA';
          cal.etapaAreaGrado = eag;
          await queryRunner.manager.save([cal]);

          const medal = new MedalleroPosicion();
          medal.id = v4();
          medal.ordenGalardon = 1;
          medal.subGrupo = 'PLATA';
          medal.denominativo = 'Medallero prueba 1';
          medal.etapaAreaGrado = eag;
          medal.usuarioCreacion = 'seeders-fake';
          await queryRunner.manager.save(medal);

          const medalRural = new MedalleroPosicionRural;
          medalRural.id = v4();
          medalRural.orden = 1;
          medalRural.posicionMinima = 2;
          medalRural.posicionMaxima = 3;
          medalRural.notaMinima = 20;
          medalRural.etapaAreaGrado = eag;
          medalRural.usuarioCreacion = 'seeders-fake';
          await queryRunner.manager.save(medalRural);
        }
      }
    }

    // Insertar usuario de carga para la olimpiada
    const persona = await queryRunner.query(`
    INSERT INTO persona (id,nombres,nro_documento,fecha_nacimiento,usuario_creacion) VALUES (DEFAULT,'FRANCISCO','1020364','1960-05-12','fake') RETURNING id;
    `);

    const usuario = await queryRunner.query(`
    INSERT INTO usuario (id,usuario,contrasena,id_persona,estado,usuario_creacion) VALUES
    (DEFAULT,'COMITE_DOCENTE_CARGA1','$2b$10$dx4z9.MjH2jGcX2XtCLCNuf7y8mBS8tHRVz8go8ORvw0.5badk.X2','${persona[0].id}','ACTIVO','${persona[0].id}') RETURNING id ;
    `);

    const usuarioRol = await queryRunner.query(`
    INSERT INTO usuario_rol (id,id_olimpiada,id_rol,id_usuario,usuario_creacion) VALUES
    (DEFAULT,'${olimpiadas[0].id}','9ff20145-dd96-53e1-bbf9-c96cbe6a6e04','${usuario[0].id}','fake');
    `);

    // const casbin1 = await queryRunner.query(`SELECT id,ptype,v0,v1,v2,v3 FROM casbin_rule WHERE v0='COMITE_DOCENTE_CARGA';`);
    // if (!casbin1.find((rule) => { return rule.v1 == '/banco-preguntas'})) {
    //   const casbin = await queryRunner.query(`
    //   INSERT INTO casbin_rule (id,ptype,v0,v1,v2,v3) VALUES
    //   (DEFAULT,'p','COMITE_DOCENTE_CARGA','/banco-preguntas','create|read|update|delete|GET|POST|PUT|PATCH|DELETE','frontend');
    //   `);
    // }
    // if (!casbin1.find((rule) => { return rule.v1 == '/competencias'})) {
    //   const casbin = await queryRunner.query(`
    //   INSERT INTO casbin_rule (id,ptype,v0,v1,v2,v3) VALUES
    //   (DEFAULT,'p','COMITE_DOCENTE_CARGA','/competencias','create|read|update|delete|GET|POST|PUT|PATCH|DELETE','frontend');
    //   `);
    // }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
  }
}

import { MigrationInterface, QueryRunner } from 'typeorm';

export class functionDimamycPivot1629894597901 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE OR REPLACE FUNCTION  dynamic_pivot(central_query text, headers_query text, temporary_table text)
      RETURNS void AS
      $$
      DECLARE
        left_column text;
        header_column text;
        value_column text;
        h_value text;
        headers_clause text;
        query text;
        j json;
        r record;
        curs refcursor;
        i int:=1;
      BEGIN
        -- find the column names of the source query
        EXECUTE 'select row_to_json(_r.*) from (' ||  central_query || ') AS _r' into j;
        FOR r in SELECT * FROM json_each_text(j)
        LOOP
          IF (i=1) THEN left_column := r.key;
            ELSEIF (i=2) THEN header_column := r.key;
            ELSEIF (i=3) THEN value_column := r.key;
          END IF;
          i := i+1;
        END LOOP;
        --  build the dynamic transposition query (based on the canonical model)
        FOR h_value in EXECUTE headers_query
        LOOP
          headers_clause := concat(headers_clause,
          format(chr(10)||',min(case when %I=%L then %I::text end) as %I',
                header_column,
          h_value,
          value_column,
          h_value ));
        END LOOP;
        query := format('create temporary table ' || temporary_table || ' as SELECT %I %s FROM (select *,row_number() over() as rn from (%s) AS _c) as _d GROUP BY %I order by min(rn)',
                left_column,
          headers_clause,
          central_query,
          left_column);
        -- open the cursor so the caller can FETCH right away
        execute query;
      END 
      $$ LANGUAGE plpgsql
      ;
   `);
  }
  /* eslint-disable */
  public async down(queryRunner: QueryRunner): Promise<void> {}
}

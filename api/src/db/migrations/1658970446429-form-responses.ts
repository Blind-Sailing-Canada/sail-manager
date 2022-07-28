/* eslint-disable max-len */
import {
  MigrationInterface, QueryRunner
} from 'typeorm';

export class formResponses1658970446429 implements MigrationInterface {
  name = 'formResponses1658970446429';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('CREATE TABLE "form_responses" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "email" character varying NOT NULL, "name" character varying NOT NULL, "profile_id" uuid, "form_name" character varying NOT NULL, "form_id" character varying NOT NULL, "response" character varying NOT NULL, CONSTRAINT "PK_36a512e5574d0a366b40b26874e" PRIMARY KEY ("id"))');
    await queryRunner.query('CREATE INDEX "IDX_2b3663e38f4e08bbdfc380980d" ON "form_responses" ("email") ');
    await queryRunner.query('CREATE INDEX "IDX_79987546f762b40c0814f108f8" ON "form_responses" ("name") ');
    await queryRunner.query('CREATE INDEX "IDX_a95c711c9ee71c9d7aff7b56aa" ON "form_responses" ("profile_id") ');
    await queryRunner.query('CREATE INDEX "IDX_0975837d28b9aa643ca4c5bdbc" ON "form_responses" ("form_name") ');
    await queryRunner.query('ALTER TABLE "form_responses" ADD CONSTRAINT "FK_a95c711c9ee71c9d7aff7b56aa2" FOREIGN KEY ("profile_id") REFERENCES "profiles"("id") ON DELETE NO ACTION ON UPDATE NO ACTION');
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('ALTER TABLE "form_responses" DROP CONSTRAINT "FK_a95c711c9ee71c9d7aff7b56aa2"');
    await queryRunner.query('DROP INDEX "public"."IDX_0975837d28b9aa643ca4c5bdbc"');
    await queryRunner.query('DROP INDEX "public"."IDX_a95c711c9ee71c9d7aff7b56aa"');
    await queryRunner.query('DROP INDEX "public"."IDX_79987546f762b40c0814f108f8"');
    await queryRunner.query('DROP INDEX "public"."IDX_2b3663e38f4e08bbdfc380980d"');
    await queryRunner.query('DROP TABLE "form_responses"');
  }

}

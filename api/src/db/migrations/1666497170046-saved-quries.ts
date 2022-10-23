/* eslint-disable max-len */
import {
  MigrationInterface, QueryRunner
} from 'typeorm';

export class savedQuries1666497170046 implements MigrationInterface {
  name = 'savedQuries1666497170046';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('CREATE TABLE "saved-queries" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "name" character varying(200) NOT NULL DEFAULT \'\', "query" character varying NOT NULL, "created_by_id" uuid NOT NULL, "deleted_at" TIMESTAMP, CONSTRAINT "PK_67e7b426a9d4f0efcfa313dab44" PRIMARY KEY ("id"))');
    await queryRunner.query('CREATE UNIQUE INDEX "saved_query_name" ON "saved-queries" ("name") WHERE deleted_at IS NULL');
    await queryRunner.query('CREATE INDEX "IDX_67e7b426a9d4f0efcfa313dab4" ON "saved-queries" ("id") ');
    await queryRunner.query('ALTER TABLE "saved-queries" ADD CONSTRAINT "FK_6844e6b42f2dc2cb3037a29fb94" FOREIGN KEY ("created_by_id") REFERENCES "profiles"("id") ON DELETE NO ACTION ON UPDATE NO ACTION');
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('ALTER TABLE "saved-queries" DROP CONSTRAINT "FK_6844e6b42f2dc2cb3037a29fb94"');
    await queryRunner.query('DROP INDEX "public"."IDX_67e7b426a9d4f0efcfa313dab4"');
    await queryRunner.query('DROP INDEX "public"."saved_query_name"');
    await queryRunner.query('DROP TABLE "saved-queries"');
  }

}

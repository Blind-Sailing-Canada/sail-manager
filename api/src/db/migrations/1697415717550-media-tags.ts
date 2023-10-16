/* eslint-disable max-len */
import {
  MigrationInterface, QueryRunner
} from 'typeorm';

export class mediaTags1697415717550 implements MigrationInterface {
  name = 'mediaTags1697415717550';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('CREATE TABLE "media-tag" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "profile_id" uuid NOT NULL, "media_id" uuid NOT NULL, "x1" integer NOT NULL DEFAULT \'0\', "x2" integer NOT NULL DEFAULT \'0\', "y1" integer NOT NULL DEFAULT \'0\', "y2" integer NOT NULL DEFAULT \'0\', CONSTRAINT "media_id_profile_id" UNIQUE ("profile_id", "media_id"), CONSTRAINT "PK_5123af1065aa3eb9c6f3c7fc3cd" PRIMARY KEY ("id"))');
    await queryRunner.query('ALTER TABLE "media-tag" ADD CONSTRAINT "FK_25d283e439496a40ea60108b507" FOREIGN KEY ("profile_id") REFERENCES "profiles"("id") ON DELETE CASCADE ON UPDATE NO ACTION');
    await queryRunner.query('ALTER TABLE "media-tag" ADD CONSTRAINT "FK_20d6f694531b85b7486588362b4" FOREIGN KEY ("media_id") REFERENCES "media"("id") ON DELETE CASCADE ON UPDATE NO ACTION');
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('ALTER TABLE "media-tag" DROP CONSTRAINT "FK_20d6f694531b85b7486588362b4"');
    await queryRunner.query('ALTER TABLE "media-tag" DROP CONSTRAINT "FK_25d283e439496a40ea60108b507"');
    await queryRunner.query('DROP TABLE "media-tag"');
  }

}

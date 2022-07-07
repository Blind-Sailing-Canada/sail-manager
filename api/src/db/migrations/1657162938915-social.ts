/* eslint-disable max-len */
import {
  MigrationInterface, QueryRunner
} from 'typeorm';

export class social1657162938915 implements MigrationInterface {
  name = 'social1657162938915';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('CREATE TABLE "social_manifests" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "social_id" uuid NOT NULL, "profile_id" uuid, "person_name" character varying NOT NULL, "attended" boolean NOT NULL DEFAULT false, "guest_of_id" uuid, CONSTRAINT "PK_450b492ae47dc31ff8cfb2d4a72" PRIMARY KEY ("id"))');
    await queryRunner.query('CREATE INDEX "IDX_35d80f8634f5ac669a5fdaaa7d" ON "social_manifests" ("social_id") ');
    await queryRunner.query('CREATE INDEX "IDX_a87752644fc9e27fe4320df00a" ON "social_manifests" ("profile_id") ');
    await queryRunner.query('CREATE INDEX "IDX_a68cf7f7f580920af668ecc73d" ON "social_manifests" ("person_name") ');
    await queryRunner.query('CREATE UNIQUE INDEX "social-profile-index" ON "social_manifests" ("social_id", "profile_id") ');
    await queryRunner.query('CREATE TABLE "socials" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "entity_number" integer, "name" character varying(100) NOT NULL DEFAULT \'\', "address" character varying(500) DEFAULT \'\', "calendar_id" character varying, "calendar_link" character varying, "description" character varying(500), "status" "public"."socials_status_enum" NOT NULL DEFAULT \'new\', "start_at" TIMESTAMP WITH TIME ZONE NOT NULL, "end_at" TIMESTAMP WITH TIME ZONE NOT NULL, "max_attendants" integer NOT NULL DEFAULT \'-1\', "cancel_reason" character varying, "cancelled_by_id" uuid, "entity_type" character varying NOT NULL DEFAULT \'SocialEntity\', "cancelled_at" TIMESTAMP WITH TIME ZONE, CONSTRAINT "UQ_220e8da5befcd36cfacbbdf12eb" UNIQUE ("entity_number"), CONSTRAINT "PK_5e3ee018e1b66c619ae3d3b3309" PRIMARY KEY ("id"))');
    await queryRunner.query('CREATE INDEX "IDX_8c1347766cbb0fe419f404c0d6" ON "socials" ("name") ');
    await queryRunner.query('CREATE INDEX "IDX_b03d4fc665ce2e9366da85ccc9" ON "socials" ("address") ');
    await queryRunner.query('CREATE INDEX "IDX_5c077c2fcbcf7a69a75755b9de" ON "socials" ("status") ');
    await queryRunner.query('CREATE INDEX "IDX_08e68815e1fb092b45cdda3539" ON "socials" ("start_at") ');
    await queryRunner.query('CREATE INDEX "IDX_d07697af6a977a451f6e133c72" ON "socials" ("end_at") ');
    await queryRunner.query('CREATE INDEX "IDX_69770580b7cbe9641c51db6f7b" ON "socials" ("entity_type") ');
    await queryRunner.query('CREATE INDEX "IDX_b0beb8d03d8b3c1dba2ea40db0" ON "socials" ("id", "entity_type") ');
    await queryRunner.query('ALTER TABLE "social_manifests" ADD CONSTRAINT "FK_35d80f8634f5ac669a5fdaaa7d5" FOREIGN KEY ("social_id") REFERENCES "socials"("id") ON DELETE NO ACTION ON UPDATE NO ACTION');
    await queryRunner.query('ALTER TABLE "social_manifests" ADD CONSTRAINT "FK_1b563279aeb34260eb3e1b2864b" FOREIGN KEY ("guest_of_id") REFERENCES "profiles"("id") ON DELETE NO ACTION ON UPDATE NO ACTION');
    await queryRunner.query('ALTER TABLE "social_manifests" ADD CONSTRAINT "FK_a87752644fc9e27fe4320df00ab" FOREIGN KEY ("profile_id") REFERENCES "profiles"("id") ON DELETE NO ACTION ON UPDATE NO ACTION');
    await queryRunner.query('ALTER TABLE "socials" ADD CONSTRAINT "FK_9bed224bac3ea7ba76d02490544" FOREIGN KEY ("cancelled_by_id") REFERENCES "profiles"("id") ON DELETE NO ACTION ON UPDATE NO ACTION');
    await queryRunner.query('ALTER TABLE "media" ADD CONSTRAINT "FK_35b167a659eab9729ba721f0b15" FOREIGN KEY ("posted_by_id") REFERENCES "profiles"("id") ON DELETE NO ACTION ON UPDATE NO ACTION');
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('ALTER TABLE "media" DROP CONSTRAINT "FK_35b167a659eab9729ba721f0b15"');
    await queryRunner.query('ALTER TABLE "socials" DROP CONSTRAINT "FK_9bed224bac3ea7ba76d02490544"');
    await queryRunner.query('ALTER TABLE "social_manifests" DROP CONSTRAINT "FK_a87752644fc9e27fe4320df00ab"');
    await queryRunner.query('ALTER TABLE "social_manifests" DROP CONSTRAINT "FK_1b563279aeb34260eb3e1b2864b"');
    await queryRunner.query('ALTER TABLE "social_manifests" DROP CONSTRAINT "FK_35d80f8634f5ac669a5fdaaa7d5"');
    await queryRunner.query('DROP INDEX "public"."IDX_b0beb8d03d8b3c1dba2ea40db0"');
    await queryRunner.query('DROP INDEX "public"."IDX_69770580b7cbe9641c51db6f7b"');
    await queryRunner.query('DROP INDEX "public"."IDX_d07697af6a977a451f6e133c72"');
    await queryRunner.query('DROP INDEX "public"."IDX_08e68815e1fb092b45cdda3539"');
    await queryRunner.query('DROP INDEX "public"."IDX_5c077c2fcbcf7a69a75755b9de"');
    await queryRunner.query('DROP INDEX "public"."IDX_b03d4fc665ce2e9366da85ccc9"');
    await queryRunner.query('DROP INDEX "public"."IDX_8c1347766cbb0fe419f404c0d6"');
    await queryRunner.query('DROP TABLE "socials"');
    await queryRunner.query('DROP INDEX "public"."social-profile-index"');
    await queryRunner.query('DROP INDEX "public"."IDX_a68cf7f7f580920af668ecc73d"');
    await queryRunner.query('DROP INDEX "public"."IDX_a87752644fc9e27fe4320df00a"');
    await queryRunner.query('DROP INDEX "public"."IDX_35d80f8634f5ac669a5fdaaa7d"');
    await queryRunner.query('DROP TABLE "social_manifests"');
  }

}

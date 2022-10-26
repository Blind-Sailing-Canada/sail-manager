/* eslint-disable max-len */
import {
  MigrationInterface, QueryRunner
} from 'typeorm';

export class sailWaitingList1666750751720 implements MigrationInterface {
  name = 'sailWaitingList1666750751720';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('CREATE TYPE "public"."sail_waiting_lists_status_enum" AS ENUM(\'open\', \'closed\')');
    await queryRunner.query('CREATE TABLE "sail_waiting_lists" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "profile_id" uuid NOT NULL, "sail_id" uuid NOT NULL, "status" "public"."sail_waiting_lists_status_enum" NOT NULL DEFAULT \'open\', "deleted_at" TIMESTAMP, CONSTRAINT "PK_7ee84261b21518b1bf59ac29aec" PRIMARY KEY ("id"))');
    await queryRunner.query('CREATE INDEX "IDX_aace6424a6d2f89187a6cc7537" ON "sail_waiting_lists" ("profile_id") ');
    await queryRunner.query('CREATE INDEX "IDX_d0b0fd45b52290e85880cc8183" ON "sail_waiting_lists" ("sail_id") ');
    await queryRunner.query('CREATE INDEX "IDX_334c9b3b1fb347572c60e4f3c3" ON "sail_waiting_lists" ("status") ');
    await queryRunner.query('ALTER TABLE "sail_waiting_lists" ADD CONSTRAINT "FK_aace6424a6d2f89187a6cc7537c" FOREIGN KEY ("profile_id") REFERENCES "profiles"("id") ON DELETE NO ACTION ON UPDATE NO ACTION');
    await queryRunner.query('ALTER TABLE "sail_waiting_lists" ADD CONSTRAINT "FK_d0b0fd45b52290e85880cc81838" FOREIGN KEY ("sail_id") REFERENCES "sails"("id") ON DELETE NO ACTION ON UPDATE NO ACTION');
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('ALTER TABLE "sail_waiting_lists" DROP CONSTRAINT "FK_d0b0fd45b52290e85880cc81838"');
    await queryRunner.query('ALTER TABLE "sail_waiting_lists" DROP CONSTRAINT "FK_aace6424a6d2f89187a6cc7537c"');
    await queryRunner.query('DROP INDEX "public"."IDX_334c9b3b1fb347572c60e4f3c3"');
    await queryRunner.query('DROP INDEX "public"."IDX_d0b0fd45b52290e85880cc8183"');
    await queryRunner.query('DROP INDEX "public"."IDX_aace6424a6d2f89187a6cc7537"');
    await queryRunner.query('DROP TABLE "sail_waiting_lists"');
    await queryRunner.query('DROP TYPE "public"."sail_waiting_lists_status_enum"');
  }

}

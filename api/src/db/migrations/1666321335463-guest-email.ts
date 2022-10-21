import {
  MigrationInterface, QueryRunner
} from 'typeorm';

export class guestEmail1666321335463 implements MigrationInterface {
  name = 'guestEmail1666321335463';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('ALTER TABLE "sail_manifests" ADD "guest_email" character varying(500)');
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('ALTER TABLE "sail_manifests" DROP COLUMN "guest_email"');
  }

}

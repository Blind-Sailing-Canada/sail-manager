import {
  MigrationInterface, QueryRunner
} from 'typeorm';

export class createdBy1682995751204 implements MigrationInterface {
  name = 'createdBy1682995751204';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('ALTER TABLE "sails" ADD "created_by_id" uuid');
    await queryRunner.query('ALTER TABLE "socials" ADD "created_by_id" uuid');
    await queryRunner.query('ALTER TABLE "challenges" ADD "created_by_id" uuid');
    await queryRunner.query('ALTER TABLE "clinics" ADD "created_by_id" uuid');
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('ALTER TABLE "sails" DROP COLUMN "created_by_id"');
    await queryRunner.query('ALTER TABLE "socials" DROP COLUMN "created_by_id"');
    await queryRunner.query('ALTER TABLE "challenges" DROP COLUMN "created_by_id"');
    await queryRunner.query('ALTER TABLE "clinics" DROP COLUMN "created_by_id"');
  }

}

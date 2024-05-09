import {
  MigrationInterface, QueryRunner
} from 'typeorm';

export class privateSail1715229377016 implements MigrationInterface {
  name = 'privateSail1715229377016';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('ALTER TABLE "sails" ADD "is_private" boolean DEFAULT false');
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('ALTER TABLE "sails" DROP COLUMN "is_private"');
  }

}

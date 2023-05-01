/* eslint-disable max-len */
import {
  MigrationInterface, QueryRunner
} from 'typeorm';

export class updateColumnTypes1682912620857 implements MigrationInterface {
  name = 'updateColumnTypes1682912620857';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('ALTER TABLE "sails" ALTER "sail_request_id" SET DATA TYPE uuid USING sail_request_id::uuid');
    await queryRunner.query('ALTER TABLE "required_actions" ALTER "actionable_id" SET DATA TYPE uuid USING actionable_id::uuid');
    await queryRunner.query('ALTER TABLE "achievements" ALTER "achievement_id" SET DATA TYPE uuid USING achievement_id::uuid');
    await queryRunner.query('ALTER TABLE "tokens" ALTER "user_id" SET DATA TYPE uuid USING user_id::uuid');
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('ALTER TABLE "sails" ALTER "sail_request_id" SET DATA TYPE varchar USING sail_request_id::varchar');
    await queryRunner.query('ALTER TABLE "required_actions" ALTER "actionable_id" SET DATA TYPE varchar USING actionable_id::varchar');
    await queryRunner.query('ALTER TABLE "achievements" ALTER "achievement_id" SET DATA TYPE varchar USING achievement_id::varchar');
    await queryRunner.query('ALTER TABLE "tokens" ALTER "user_id" SET DATA TYPE varchar USING user_id::varchar');
  }

}

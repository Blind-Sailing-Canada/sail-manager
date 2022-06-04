import {
  MigrationInterface, QueryRunner
} from 'typeorm';

export class profileDelete1654315290452 implements MigrationInterface {

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'ALTER TABLE profiles ALTER COLUMN email TYPE varchar(500);'
    );

    await queryRunner.query(
      'ALTER TABLE profiles ADD COLUMN delete_at timestamptz;'
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'ALTER TABLE profiles DROP COLUMN delete_at'
    );
  }

}

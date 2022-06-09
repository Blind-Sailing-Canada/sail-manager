import {
  MigrationInterface, QueryRunner
} from 'typeorm';

export class updateDeleteProfileEmail1654327570720 implements MigrationInterface {

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `
      UPDATE profiles SET email=CONCAT(email, ':deleted:', to_char(now()::timestamp at time zone 'UTC', 'YYYY-MM-DD"T"HH24:MI:SS"Z"'))
      WHERE deleted_at IS NOT NULL;
      `
    );
  }

  public async down(): Promise<void> {
    return Promise.resolve();
  }

}

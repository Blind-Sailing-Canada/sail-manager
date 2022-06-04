import {
  MigrationInterface, QueryRunner
} from 'typeorm';

export class userOriginalProfileId1654323357240 implements MigrationInterface {

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'ALTER TABLE users ALTER COLUMN original_profile_id TYPE uuid USING original_profile_id::uuid;'
    );
  }

  public async down(): Promise<void> {
    return Promise.resolve();
  }

}

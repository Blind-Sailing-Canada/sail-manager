import {
  MigrationInterface, QueryRunner
} from 'typeorm';

export class deleteLinkedAccounts1654323524673 implements MigrationInterface {

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'UPDATE profiles SET deleted_at=NOW() WHERE id IN (SELECT original_profile_id FROM users WHERE profile_id != original_profile_id);'
    );
  }

  public async down(): Promise<void> {
    return Promise.resolve();
  }

}

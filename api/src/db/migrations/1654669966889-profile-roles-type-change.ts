import {
  MigrationInterface, QueryRunner
} from 'typeorm';

export class profileRolesTypeChange1654669966889 implements MigrationInterface {

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'ALTER TABLE profiles ADD COLUMN roles2 _text NOT NULL DEFAULT \'{}\'::text[];'
    );

    await queryRunner.query(
      'UPDATE profiles SET roles2 = ARRAY(SELECT jsonb_array_elements_text(roles))::text[];'
    );

    await queryRunner.query(
      'ALTER TABLE profiles DROP COLUMN roles;'
    );

    await queryRunner.query(
      'ALTER TABLE profiles RENAME COLUMN roles2 to roles;'
    );
  }

  public async down(): Promise<void> {
    return Promise.resolve();
  }

}

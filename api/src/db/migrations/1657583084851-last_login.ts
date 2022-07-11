import {
  MigrationInterface, QueryRunner
} from 'typeorm';

export class lastLogin1657583084851 implements MigrationInterface {
  name = 'lastLogin1657583084851';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('ALTER TABLE "profiles" ADD "last_login" TIMESTAMP WITH TIME ZONE');
    await queryRunner.query('CREATE INDEX "IDX_ff8c895944f0162808b752a522" ON "profiles" ("last_login") ');
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('DROP INDEX "public"."IDX_ff8c895944f0162808b752a522"');
    await queryRunner.query('ALTER TABLE "profiles" DROP COLUMN "last_login"');
  }

}

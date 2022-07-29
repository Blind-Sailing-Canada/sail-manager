import {
  MigrationInterface, QueryRunner
} from 'typeorm';

export class profileNameUniqueIndex1659067196715 implements MigrationInterface {
  name = 'profileNameUniqueIndex1659067196715';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('DROP INDEX "public"."profile_email"');
    await queryRunner.query('DROP INDEX "public"."profile_name"');
    await queryRunner.query('ALTER TABLE "tokens" RENAME COLUMN "profile_id" TO "user_id"');
    await queryRunner.query('ALTER TABLE "profiles" DROP CONSTRAINT "UQ_5b49bd22c967ce2829ca8f17720"');
    await queryRunner.query('ALTER TABLE "users" ALTER COLUMN "profile_id" DROP NOT NULL');
    await queryRunner.query('ALTER TABLE "users" ALTER COLUMN "original_profile_id" DROP NOT NULL');
    await queryRunner.query('CREATE UNIQUE INDEX "profile_name" ON "profiles" ("name") WHERE deleted_at IS NULL');
    await queryRunner.query('CREATE UNIQUE INDEX "profile_email" ON "profiles" ("email") WHERE deleted_at IS NULL');
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('DROP INDEX "public"."profile_email"');
    await queryRunner.query('DROP INDEX "public"."profile_name"');
    await queryRunner.query('ALTER TABLE "users" ALTER COLUMN "original_profile_id" SET NOT NULL');
    await queryRunner.query('ALTER TABLE "users" ALTER COLUMN "profile_id" SET NOT NULL');
    await queryRunner.query('ALTER TABLE "profiles" ADD CONSTRAINT "UQ_5b49bd22c967ce2829ca8f17720" UNIQUE ("email")');
    await queryRunner.query('ALTER TABLE "tokens" RENAME COLUMN "user_id" TO "profile_id"');
    await queryRunner.query('CREATE INDEX "profile_name" ON "profiles" ("name") ');
    await queryRunner.query('CREATE INDEX "profile_email" ON "profiles" ("email") ');
  }

}

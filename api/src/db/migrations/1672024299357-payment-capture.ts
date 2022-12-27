/* eslint-disable max-len */
import {
  MigrationInterface, QueryRunner
} from 'typeorm';

export class paymentCapture1672024299357 implements MigrationInterface {
  name = 'paymentCapture1672024299357';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('CREATE TYPE "public"."payment_captures_product_type_enum" AS ENUM(\'guest_sail\', \'membership\', \'sail_package\', \'single_sail\', \'donation\', \'unknown\')');
    await queryRunner.query('CREATE TABLE "payment_captures" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "customer_email" character varying(500) NOT NULL, "customer_name" character varying(500) NOT NULL, "data" jsonb NOT NULL, "payment_processor" character varying(100) NOT NULL, "product_name" character varying(150) NOT NULL, "product_quantity" integer NOT NULL DEFAULT \'1\', "product_type" "public"."payment_captures_product_type_enum" NOT NULL, "profile_id" uuid, "deleted_at" TIMESTAMP, CONSTRAINT "PK_f92b4e658e01f50dc9699c6acf9" PRIMARY KEY ("id"))');
    await queryRunner.query('CREATE TYPE "public"."product_purchases_product_type_enum" AS ENUM(\'guest_sail\', \'membership\', \'sail_package\', \'single_sail\', \'donation\', \'unknown\')');
    await queryRunner.query('CREATE TABLE "product_purchases" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "credited_by_id" uuid, "is_exhausted" boolean NOT NULL DEFAULT false, "is_unlimited_sails" boolean NOT NULL DEFAULT false, "is_manual_credit" boolean NOT NULL DEFAULT false, "note" character varying(500), "number_of_sails_included" integer NOT NULL DEFAULT \'0\', "number_of_sails_used" integer NOT NULL DEFAULT \'0\', "number_of_guest_sails_included" integer NOT NULL DEFAULT \'0\', "number_of_guest_sails_used" integer NOT NULL DEFAULT \'0\', "payment_capture_id" uuid NOT NULL, "product_name" character varying(150) NOT NULL, "product_type" "public"."product_purchases_product_type_enum" NOT NULL, "profile_id" uuid, "valid_until" TIMESTAMP WITH TIME ZONE, "deleted_at" TIMESTAMP, CONSTRAINT "PK_f28cf8bf29b23ab794dfc91f45c" PRIMARY KEY ("id"))');
    await queryRunner.query('CREATE TABLE "sail_payment_claims" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "product_purchase_id" uuid, "sail_id" uuid NOT NULL, "guest_name" character varying(150), "guest_email" character varying(150), "profile_id" uuid, "deleted_at" TIMESTAMP, CONSTRAINT "PK_8ae505905e42a116b20c736001f" PRIMARY KEY ("id"))');
    await queryRunner.query('ALTER TABLE "sails" ADD "is_payment_free" boolean DEFAULT false');
    await queryRunner.query('ALTER TABLE "payment_captures" ADD CONSTRAINT "FK_410cc01658339cc0e2fb1b20840" FOREIGN KEY ("profile_id") REFERENCES "profiles"("id") ON DELETE NO ACTION ON UPDATE NO ACTION');
    await queryRunner.query('ALTER TABLE "product_purchases" ADD CONSTRAINT "FK_6554f8ca1045db8ef08e000e127" FOREIGN KEY ("credited_by_id") REFERENCES "profiles"("id") ON DELETE NO ACTION ON UPDATE NO ACTION');
    await queryRunner.query('ALTER TABLE "product_purchases" ADD CONSTRAINT "FK_123aba8e3d8bcb773aa0029583f" FOREIGN KEY ("profile_id") REFERENCES "profiles"("id") ON DELETE NO ACTION ON UPDATE NO ACTION');
    await queryRunner.query('ALTER TABLE "sail_payment_claims" ADD CONSTRAINT "FK_126eb63c36388a98872df642a52" FOREIGN KEY ("product_purchase_id") REFERENCES "product_purchases"("id") ON DELETE NO ACTION ON UPDATE NO ACTION');
    await queryRunner.query('ALTER TABLE "sail_payment_claims" ADD CONSTRAINT "FK_70107b39d9d67204e45bcd5cd72" FOREIGN KEY ("sail_id") REFERENCES "sails"("id") ON DELETE NO ACTION ON UPDATE NO ACTION');
    await queryRunner.query('ALTER TABLE "sail_payment_claims" ADD CONSTRAINT "FK_7248d9827570bac8d394390f85c" FOREIGN KEY ("profile_id") REFERENCES "profiles"("id") ON DELETE NO ACTION ON UPDATE NO ACTION');
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('ALTER TABLE "sail_payment_claims" DROP CONSTRAINT "FK_7248d9827570bac8d394390f85c"');
    await queryRunner.query('ALTER TABLE "sail_payment_claims" DROP CONSTRAINT "FK_70107b39d9d67204e45bcd5cd72"');
    await queryRunner.query('ALTER TABLE "sail_payment_claims" DROP CONSTRAINT "FK_126eb63c36388a98872df642a52"');
    await queryRunner.query('ALTER TABLE "product_purchases" DROP CONSTRAINT "FK_123aba8e3d8bcb773aa0029583f"');
    await queryRunner.query('ALTER TABLE "product_purchases" DROP CONSTRAINT "FK_6554f8ca1045db8ef08e000e127"');
    await queryRunner.query('ALTER TABLE "payment_captures" DROP CONSTRAINT "FK_410cc01658339cc0e2fb1b20840"');
    await queryRunner.query('ALTER TABLE "sails" DROP COLUMN "is_payment_free"');
    await queryRunner.query('DROP TABLE "sail_payment_claims"');
    await queryRunner.query('DROP TABLE "product_purchases"');
    await queryRunner.query('DROP TYPE "public"."product_purchases_product_type_enum"');
    await queryRunner.query('DROP TABLE "payment_captures"');
    await queryRunner.query('DROP TYPE "public"."payment_captures_product_type_enum"');
  }

}

import { MigrationInterface, QueryRunner } from "typeorm";

export class maintenanceSail1740267205763 implements MigrationInterface {
    name = 'maintenanceSail1740267205763'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "sails" ADD "maintenance_id" uuid`);
        await queryRunner.query(`ALTER TABLE "boat_maintenances" ADD "maintenance_sail_id" uuid`);
        await queryRunner.query(`CREATE INDEX "IDX_984b33aabe49e6ac21d0009419" ON "sails" ("maintenance_id") `);
        await queryRunner.query(`CREATE INDEX "IDX_42f5083ecedb4f6b12bb42d954" ON "boat_maintenances" ("maintenance_sail_id") `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX "public"."IDX_42f5083ecedb4f6b12bb42d954"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_984b33aabe49e6ac21d0009419"`);
        await queryRunner.query(`ALTER TABLE "boat_maintenances" DROP COLUMN "maintenance_sail_id"`);
        await queryRunner.query(`ALTER TABLE "sails" DROP COLUMN "maintenance_id"`);
    }

}

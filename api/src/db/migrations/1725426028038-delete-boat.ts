import { MigrationInterface, QueryRunner } from "typeorm";

export class deleteBoat1725426028038 implements MigrationInterface {
    name = 'deleteBoat1725426028038'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "boats" ADD "deleted_at" TIMESTAMP`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "boats" DROP COLUMN "deleted_at"`);
    }

}

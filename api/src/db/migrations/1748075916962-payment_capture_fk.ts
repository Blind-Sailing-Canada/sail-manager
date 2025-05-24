import { MigrationInterface, QueryRunner } from "typeorm";

export class paymentCaptureFk1748075916962 implements MigrationInterface {
    name = 'paymentCaptureFk1748075916962'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "payment_captures" DROP CONSTRAINT "FK_f92b4e658e01f50dc9699c6acf9"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "payment_captures" ADD CONSTRAINT "FK_f92b4e658e01f50dc9699c6acf9" FOREIGN KEY ("id") REFERENCES "product_purchases"("payment_capture_id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}

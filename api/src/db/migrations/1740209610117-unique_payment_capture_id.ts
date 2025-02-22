import { MigrationInterface, QueryRunner } from 'typeorm';

export class uniquePaymentCaptureId1740209610117 implements MigrationInterface {
    name = 'uniquePaymentCaptureId1740209610117';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "product_purchases" ADD CONSTRAINT "UQ_3d9315a60934fa4ee406a4e51cd" UNIQUE ("payment_capture_id")`);
        await queryRunner.query(`ALTER TABLE "payment_captures" ADD CONSTRAINT "UQ_f92b4e658e01f50dc9699c6acf9" UNIQUE ("id")`);
        await queryRunner.query(`ALTER TABLE "payment_captures" ADD CONSTRAINT "FK_f92b4e658e01f50dc9699c6acf9" FOREIGN KEY ("id") REFERENCES "product_purchases"("payment_capture_id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "payment_captures" DROP CONSTRAINT "FK_f92b4e658e01f50dc9699c6acf9"`);
        await queryRunner.query(`ALTER TABLE "payment_captures" DROP CONSTRAINT "UQ_f92b4e658e01f50dc9699c6acf9"`);
        await queryRunner.query(`ALTER TABLE "product_purchases" DROP CONSTRAINT "UQ_3d9315a60934fa4ee406a4e51cd"`);
    }

}

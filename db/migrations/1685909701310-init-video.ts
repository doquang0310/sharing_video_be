import { MigrationInterface, QueryRunner } from "typeorm";

export class InitVideo1685909701310 implements MigrationInterface {
    name = 'InitVideo1685909701310'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "user_entity" ("id" SERIAL NOT NULL, "email" character varying NOT NULL, "password" character varying NOT NULL, "createdDate" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_415c35b9b3b6fe45a3b065030f5" UNIQUE ("email"), CONSTRAINT "PK_b54f8ea623b17094db7667d8206" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "video_entity" ("id" SERIAL NOT NULL, "url" character varying NOT NULL, "title" character varying NOT NULL, "description" character varying NOT NULL, "up_vote" integer NOT NULL, "down_vote" integer NOT NULL, "createdDate" TIMESTAMP NOT NULL DEFAULT now(), "publishedById" integer, CONSTRAINT "PK_a86a8f20977e8900f5f6dc4add6" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "video_entity" ADD CONSTRAINT "FK_0832567e753e8973cb4fe79e6c1" FOREIGN KEY ("publishedById") REFERENCES "user_entity"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "video_entity" DROP CONSTRAINT "FK_0832567e753e8973cb4fe79e6c1"`);
        await queryRunner.query(`DROP TABLE "video_entity"`);
        await queryRunner.query(`DROP TABLE "user_entity"`);
    }

}

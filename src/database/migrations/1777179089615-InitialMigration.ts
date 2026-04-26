import { MigrationInterface, QueryRunner } from "typeorm";

export class InitialMigration1777179089615 implements MigrationInterface {
    name = 'InitialMigration1777179089615'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "lovers" ("id" SERIAL NOT NULL, "uuid" uuid NOT NULL DEFAULT gen_random_uuid(), "profileImg" character varying NOT NULL, "coverImg" character varying NOT NULL, CONSTRAINT "UQ_db627ae9ff4d87f0832489b69c4" UNIQUE ("uuid"), CONSTRAINT "PK_c36df7b26beedb054b34ea70f14" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_db627ae9ff4d87f0832489b69c" ON "lovers" ("uuid") `);
        await queryRunner.query(`CREATE TABLE "assets" ("id" SERIAL NOT NULL, "uuid" uuid NOT NULL DEFAULT gen_random_uuid(), "banner" character varying NOT NULL, "profile1" character varying NOT NULL, "profile2" character varying NOT NULL, "albumn" character varying NOT NULL, "song" character varying NOT NULL, "favorite" character varying NOT NULL, CONSTRAINT "UQ_6bd9c512d7bb9e6d63fc403a77b" UNIQUE ("uuid"), CONSTRAINT "PK_da96729a8b113377cfb6a62439c" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_6bd9c512d7bb9e6d63fc403a77" ON "assets" ("uuid") `);
        await queryRunner.query(`CREATE TABLE "profileInfo" ("id" SERIAL NOT NULL, "uuid" uuid NOT NULL DEFAULT gen_random_uuid(), "name" character varying NOT NULL, "phrase" character varying NOT NULL, "nationality" character varying NOT NULL, "job" character varying NOT NULL, "race" character varying NOT NULL, CONSTRAINT "UQ_7515ab6f2c83bfaab30264f2ac4" UNIQUE ("uuid"), CONSTRAINT "PK_688aa26843826a1c6f9527027fa" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_7515ab6f2c83bfaab30264f2ac" ON "profileInfo" ("uuid") `);
        await queryRunner.query(`CREATE TABLE "profiles" ("id" SERIAL NOT NULL, "uuid" uuid NOT NULL DEFAULT gen_random_uuid(), "assetsId" integer, "loverId" integer, "profileInfoId" integer, "user_id" bigint NOT NULL, CONSTRAINT "UQ_2c0c7196c89bdcc9b04f29f3fe6" UNIQUE ("uuid"), CONSTRAINT "REL_7ee70b7952b0764c03bd09dd6a" UNIQUE ("assetsId"), CONSTRAINT "REL_a7649199f17113f421f2d421de" UNIQUE ("loverId"), CONSTRAINT "REL_c26f5dbba73fc9431d7188b65c" UNIQUE ("profileInfoId"), CONSTRAINT "PK_8e520eb4da7dc01d0e190447c8e" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_2c0c7196c89bdcc9b04f29f3fe" ON "profiles" ("uuid") `);
        await queryRunner.query(`ALTER TABLE "permissions" ADD "uuid" uuid NOT NULL DEFAULT gen_random_uuid()`);
        await queryRunner.query(`ALTER TABLE "permissions" ADD CONSTRAINT "UQ_82c4b329177eba3db6338f732c5" UNIQUE ("uuid")`);
        await queryRunner.query(`ALTER TABLE "roles" ADD "uuid" uuid NOT NULL DEFAULT gen_random_uuid()`);
        await queryRunner.query(`ALTER TABLE "roles" ADD CONSTRAINT "UQ_cdc7776894e484eaed828ca0616" UNIQUE ("uuid")`);
        await queryRunner.query(`ALTER TABLE "control_groups" ADD "uuid" uuid NOT NULL DEFAULT gen_random_uuid()`);
        await queryRunner.query(`ALTER TABLE "control_groups" ADD CONSTRAINT "UQ_f2e754b035daf6351ec3ef1dc78" UNIQUE ("uuid")`);
        await queryRunner.query(`ALTER TABLE "permissions" DROP CONSTRAINT "UQ_56583ae1f32a17a0925f4a5f893"`);
        await queryRunner.query(`ALTER TABLE "permissions" DROP CONSTRAINT "UQ_8b634526cdd01f2adba6c7ac07b"`);
        await queryRunner.query(`ALTER TABLE "users" ALTER COLUMN "uuid" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "users" ALTER COLUMN "uuid" SET DEFAULT gen_random_uuid()`);
        await queryRunner.query(`CREATE INDEX "IDX_82c4b329177eba3db6338f732c" ON "permissions" ("uuid") `);
        await queryRunner.query(`CREATE INDEX "IDX_cdc7776894e484eaed828ca061" ON "roles" ("uuid") `);
        await queryRunner.query(`CREATE INDEX "IDX_f2e754b035daf6351ec3ef1dc7" ON "control_groups" ("uuid") `);
        await queryRunner.query(`ALTER TABLE "permissions" ADD CONSTRAINT "UQ_80d877a2282ab710f5bae696731" UNIQUE ("rol_id", "module")`);
        await queryRunner.query(`ALTER TABLE "profiles" ADD CONSTRAINT "FK_7ee70b7952b0764c03bd09dd6a3" FOREIGN KEY ("assetsId") REFERENCES "assets"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "profiles" ADD CONSTRAINT "FK_a7649199f17113f421f2d421dec" FOREIGN KEY ("loverId") REFERENCES "lovers"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "profiles" ADD CONSTRAINT "FK_c26f5dbba73fc9431d7188b65c2" FOREIGN KEY ("profileInfoId") REFERENCES "profileInfo"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "profiles" ADD CONSTRAINT "FK_9e432b7df0d182f8d292902d1a2" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "profiles" DROP CONSTRAINT "FK_9e432b7df0d182f8d292902d1a2"`);
        await queryRunner.query(`ALTER TABLE "profiles" DROP CONSTRAINT "FK_c26f5dbba73fc9431d7188b65c2"`);
        await queryRunner.query(`ALTER TABLE "profiles" DROP CONSTRAINT "FK_a7649199f17113f421f2d421dec"`);
        await queryRunner.query(`ALTER TABLE "profiles" DROP CONSTRAINT "FK_7ee70b7952b0764c03bd09dd6a3"`);
        await queryRunner.query(`ALTER TABLE "permissions" DROP CONSTRAINT "UQ_80d877a2282ab710f5bae696731"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_f2e754b035daf6351ec3ef1dc7"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_cdc7776894e484eaed828ca061"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_82c4b329177eba3db6338f732c"`);
        await queryRunner.query(`ALTER TABLE "users" ALTER COLUMN "uuid" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "users" ALTER COLUMN "uuid" SET DEFAULT uuid_generate_v4()`);
        await queryRunner.query(`ALTER TABLE "permissions" ADD CONSTRAINT "UQ_8b634526cdd01f2adba6c7ac07b" UNIQUE ("module")`);
        await queryRunner.query(`ALTER TABLE "permissions" ADD CONSTRAINT "UQ_56583ae1f32a17a0925f4a5f893" UNIQUE ("permissionName")`);
        await queryRunner.query(`ALTER TABLE "control_groups" DROP CONSTRAINT "UQ_f2e754b035daf6351ec3ef1dc78"`);
        await queryRunner.query(`ALTER TABLE "control_groups" DROP COLUMN "uuid"`);
        await queryRunner.query(`ALTER TABLE "roles" DROP CONSTRAINT "UQ_cdc7776894e484eaed828ca0616"`);
        await queryRunner.query(`ALTER TABLE "roles" DROP COLUMN "uuid"`);
        await queryRunner.query(`ALTER TABLE "permissions" DROP CONSTRAINT "UQ_82c4b329177eba3db6338f732c5"`);
        await queryRunner.query(`ALTER TABLE "permissions" DROP COLUMN "uuid"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_2c0c7196c89bdcc9b04f29f3fe"`);
        await queryRunner.query(`DROP TABLE "profiles"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_7515ab6f2c83bfaab30264f2ac"`);
        await queryRunner.query(`DROP TABLE "profileInfo"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_6bd9c512d7bb9e6d63fc403a77"`);
        await queryRunner.query(`DROP TABLE "assets"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_db627ae9ff4d87f0832489b69c"`);
        await queryRunner.query(`DROP TABLE "lovers"`);
    }

}

import {MigrationInterface, QueryRunner} from "typeorm";

export class Version1653384340473 implements MigrationInterface {
    name = 'Version1653384340473'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "users" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "created_by" uuid, "updated_by" uuid, "firstName" character varying NOT NULL, "lastName" character varying NOT NULL, "userName" character varying NOT NULL, "password" character varying NOT NULL, "email" character varying NOT NULL, "salt" character varying NOT NULL, "phoneNumber" character varying NOT NULL, "isEmailVerified" boolean NOT NULL DEFAULT false, "gmailId" character varying, "facebookId" character varying, CONSTRAINT "UQ_7b71590b41481d02c4fb4dbed13" UNIQUE ("userName", "email"), CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."profiles_roles_enum" AS ENUM('ADMIN', 'USER')`);
        await queryRunner.query(`CREATE TABLE "profiles" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "created_by" uuid, "updated_by" uuid, "firstName" character varying NOT NULL, "lastName" character varying NOT NULL, "gender" character varying, "age" integer, "country" character varying, "city" character varying, "address" character varying, "email" character varying, "phoneNumber" character varying, "image" character varying, "roles" "public"."profiles_roles_enum" NOT NULL DEFAULT 'USER', "userId" uuid, CONSTRAINT "UQ_8197446e07563b8f4c34f69881f" UNIQUE ("phoneNumber"), CONSTRAINT "PK_8e520eb4da7dc01d0e190447c8e" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "verified-email" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "created_by" uuid, "updated_by" uuid, "email" character varying NOT NULL, "emailToken" character varying NOT NULL, "timestamp" TIMESTAMP NOT NULL, CONSTRAINT "UQ_109c9441c9b9d878fbde79d2be0" UNIQUE ("email", "emailToken"), CONSTRAINT "PK_df12d3d5bb0146de5eba14129fb" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "profiles" ADD CONSTRAINT "FK_315ecd98bd1a42dcf2ec4e2e985" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "profiles" DROP CONSTRAINT "FK_315ecd98bd1a42dcf2ec4e2e985"`);
        await queryRunner.query(`DROP TABLE "verified-email"`);
        await queryRunner.query(`DROP TABLE "profiles"`);
        await queryRunner.query(`DROP TYPE "public"."profiles_roles_enum"`);
        await queryRunner.query(`DROP TABLE "users"`);
    }

}

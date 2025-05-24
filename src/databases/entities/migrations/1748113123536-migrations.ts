import { MigrationInterface, QueryRunner } from "typeorm";

export class Migrations1748113123536 implements MigrationInterface {
    name = 'Migrations1748113123536'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`registrations\` (\`teacher_id\` int NOT NULL, \`student_id\` int NOT NULL, PRIMARY KEY (\`teacher_id\`, \`student_id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`students\` (\`id\` int NOT NULL AUTO_INCREMENT, \`email\` varchar(255) NOT NULL, \`suspended\` tinyint NOT NULL DEFAULT 0, UNIQUE INDEX \`IDX_25985d58c714a4a427ced57507\` (\`email\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`teachers\` (\`id\` int NOT NULL AUTO_INCREMENT, \`email\` varchar(255) NOT NULL, UNIQUE INDEX \`IDX_7568c49a630907119e4a665c60\` (\`email\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE INDEX \`IDX_c89c2dcd0118321123cc11360c\` ON \`registrations\` (\`teacher_id\`)`);
        await queryRunner.query(`CREATE INDEX \`IDX_a42df5f11116b3a8db20c0c639\` ON \`registrations\` (\`student_id\`)`);
        await queryRunner.query(`ALTER TABLE \`registrations\` ADD CONSTRAINT \`FK_c89c2dcd0118321123cc11360cb\` FOREIGN KEY (\`teacher_id\`) REFERENCES \`teachers\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`registrations\` ADD CONSTRAINT \`FK_a42df5f11116b3a8db20c0c6392\` FOREIGN KEY (\`student_id\`) REFERENCES \`students\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`registrations\` DROP FOREIGN KEY \`FK_a42df5f11116b3a8db20c0c6392\``);
        await queryRunner.query(`ALTER TABLE \`registrations\` DROP FOREIGN KEY \`FK_c89c2dcd0118321123cc11360cb\``);
        await queryRunner.query(`DROP INDEX \`IDX_a42df5f11116b3a8db20c0c639\` ON \`registrations\``);
        await queryRunner.query(`DROP INDEX \`IDX_c89c2dcd0118321123cc11360c\` ON \`registrations\``);
        await queryRunner.query(`DROP INDEX \`IDX_7568c49a630907119e4a665c60\` ON \`teachers\``);
        await queryRunner.query(`DROP TABLE \`teachers\``);
        await queryRunner.query(`DROP INDEX \`IDX_25985d58c714a4a427ced57507\` ON \`students\``);
        await queryRunner.query(`DROP TABLE \`students\``);
        await queryRunner.query(`DROP TABLE \`registrations\``);
    }

}

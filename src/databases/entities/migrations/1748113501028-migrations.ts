import { MigrationInterface, QueryRunner } from "typeorm";

export class Migrations1748113501028 implements MigrationInterface {
    name = 'Migrations1748113501028'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`registrations\` DROP FOREIGN KEY \`FK_a42df5f11116b3a8db20c0c6392\``);
        await queryRunner.query(`ALTER TABLE \`registrations\` DROP FOREIGN KEY \`FK_c89c2dcd0118321123cc11360cb\``);
        await queryRunner.query(`DROP INDEX \`IDX_a42df5f11116b3a8db20c0c639\` ON \`registrations\``);
        await queryRunner.query(`DROP INDEX \`IDX_c89c2dcd0118321123cc11360c\` ON \`registrations\``);
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
        await queryRunner.query(`CREATE INDEX \`IDX_c89c2dcd0118321123cc11360c\` ON \`registrations\` (\`teacher_id\`)`);
        await queryRunner.query(`CREATE INDEX \`IDX_a42df5f11116b3a8db20c0c639\` ON \`registrations\` (\`student_id\`)`);
        await queryRunner.query(`ALTER TABLE \`registrations\` ADD CONSTRAINT \`FK_c89c2dcd0118321123cc11360cb\` FOREIGN KEY (\`teacher_id\`) REFERENCES \`teachers\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`registrations\` ADD CONSTRAINT \`FK_a42df5f11116b3a8db20c0c6392\` FOREIGN KEY (\`student_id\`) REFERENCES \`students\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

}

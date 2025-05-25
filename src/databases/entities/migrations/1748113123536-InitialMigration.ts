import { MigrationInterface, QueryRunner } from 'typeorm';

export class InitialMigration implements MigrationInterface {
  name = 'InitialMigration';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            CREATE TABLE teachers (
                id INT NOT NULL AUTO_INCREMENT,
                email VARCHAR(255) NOT NULL,
                UNIQUE INDEX IDX_teachers_email (email),
                PRIMARY KEY (id)
            ) ENGINE=InnoDB
        `);

    await queryRunner.query(`
            CREATE TABLE students (
                id INT NOT NULL AUTO_INCREMENT,
                email VARCHAR(255) NOT NULL,
                suspended BOOLEAN NOT NULL DEFAULT false,
                UNIQUE INDEX IDX_students_email (email),
                PRIMARY KEY (id)
            ) ENGINE=InnoDB
        `);

    await queryRunner.query(`
            CREATE TABLE registrations (
                teacher_id INT NOT NULL,
                student_id INT NOT NULL,
                PRIMARY KEY (teacher_id, student_id),
                FOREIGN KEY (teacher_id) REFERENCES teachers(id) ON DELETE CASCADE,
                FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE
            ) ENGINE=InnoDB
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE registrations`);
    await queryRunner.query(`DROP TABLE students`);
    await queryRunner.query(`DROP TABLE teachers`);
  }
}

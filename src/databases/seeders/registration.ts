// src/databases/seeders/registration.seed.ts
import { connectionSource } from '@/utils/common-typeorm-config';
import { Registration } from '../entities/registration.entity';
import { Teacher } from '../entities/teacher.entity';
import { Student } from '../entities/student.entity';

export async function seedRegistrations() {
  if (!connectionSource.isInitialized) {
    await connectionSource.initialize();
  }

  const regRepo = connectionSource.getRepository(Registration);
  const teacherRepo = connectionSource.getRepository(Teacher);
  const studentRepo = connectionSource.getRepository(Student);

  const teacherKen = await teacherRepo.findOneBy({
    email: 'teacherken@gmail.com',
  });
  const teacher1 = await teacherRepo.findOneBy({
    email: 'teacher1@example.com',
  });
  const teacher2 = await teacherRepo.findOneBy({
    email: 'teacher2@example.com',
  });

  const common1 = await studentRepo.findOneBy({
    email: 'commonstudent1@gmail.com',
  });
  const common2 = await studentRepo.findOneBy({
    email: 'commonstudent2@gmail.com',
  });
  const exclusive = await studentRepo.findOneBy({
    email: 'studentonly@example.com',
  });

  const toSeed: { teacherId: number; studentId: number }[] = [];

  for (const teacher of [teacherKen, teacher1, teacher2]) {
    if (!teacher) continue;
    if (common1) toSeed.push({ teacherId: teacher.id, studentId: common1.id });
    if (common2) toSeed.push({ teacherId: teacher.id, studentId: common2.id });
  }

  if (teacherKen && exclusive) {
    toSeed.push({ teacherId: teacherKen.id, studentId: exclusive.id });
  }

  let inserted = 0;
  for (const data of toSeed) {
    const exists = await regRepo.findOneBy(data);
    if (!exists) {
      await regRepo.save(regRepo.create(data));
      inserted++;
    }
  }

  console.log(`✔ Inserted ${inserted} registrations`);
  await connectionSource.destroy();
}

if (require.main === module) {
  seedRegistrations().catch((err) => {
    console.error(err);
    process.exit(1);
  });
}

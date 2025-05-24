import { connectionSource } from '@/utils/common-typeorm-config';
import { Student } from '../entities/student.entity';

export async function seedStudents() {
  if (!connectionSource.isInitialized) {
    await connectionSource.initialize();
  }
  const repo = connectionSource.getRepository(Student);

  const students = [
    { email: 'commonstudent1@gmail.com' },
    { email: 'commonstudent2@gmail.com' },
    { email: 'studentonly@example.com' },
  ];

  for (const s of students) {
    const entity = repo.create(s);
    await repo.save(entity);
  }

  console.log(`✔ Inserted ${students.length} students`);
  await connectionSource.destroy();
}

if (require.main === module) {
  seedStudents().catch((err) => {
    console.error(err);
    process.exit(1);
  });
}

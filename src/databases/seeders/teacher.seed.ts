import { connectionSource } from '@/utils/common-typeorm-config';
import { Teacher } from '../entities/teacher.entity';

export async function seedTeachers() {
  if (!connectionSource.isInitialized) {
    await connectionSource.initialize();
  }
  const repo = connectionSource.getRepository(Teacher);

  const teachers = [
    { email: 'teacher1@example.com' },
    { email: 'teacher2@example.com' },
    { email: 'teacherken@gmail.com' },
  ];

  for (const t of teachers) {
    const entity = repo.create(t);
    await repo.save(entity);
  }

  console.log(`✔ Inserted ${teachers.length} teachers`);
  await connectionSource.destroy();
}

if (require.main === module) {
  seedTeachers().catch((err) => {
    console.error(err);
    process.exit(1);
  });
}

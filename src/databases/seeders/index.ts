import { seedRegistrations } from './registration';
import { seedTeachers } from './student.seed';
import { seedStudents } from './teacher.seed';

async function runAll() {
  await seedTeachers();
  await seedStudents();
  await seedRegistrations();
  process.exit(0);
}

runAll().catch((err) => {
  console.error(err);
  process.exit(1);
});

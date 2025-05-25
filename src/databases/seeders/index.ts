import { seedRegistrations } from './registration';
import { seedTeachers } from './teacher.seed';
import { seedStudents } from './student.seed';

async function runAll() {
  // First seed teachers
  await seedTeachers();
  // Then seed students
  await seedStudents();
  // Finally create registrations
  await seedRegistrations();
  process.exit(0);
}

runAll().catch((err) => {
  console.error('Error running seeds:', err);
  process.exit(1);
});

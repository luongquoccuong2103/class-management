import { validate } from 'class-validator';
import { RegisterDto } from './register.dto';

describe('RegisterDto', () => {
  it('should pass validation with valid data', async () => {
    const dto = new RegisterDto();
    dto.teacher = 'teacher@example.com';
    dto.students = ['student1@example.com', 'student2@example.com'];

    const errors = await validate(dto);
    expect(errors.length).toBe(0);
  });

  it('should fail validation with invalid teacher email', async () => {
    const dto = new RegisterDto();
    dto.teacher = 'invalid-email';
    dto.students = ['student1@example.com'];

    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].constraints).toHaveProperty('isEmail');
  });

  it('should fail validation with empty students array', async () => {
    const dto = new RegisterDto();
    dto.teacher = 'teacher@example.com';
    dto.students = [];

    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].constraints).toHaveProperty('arrayNotEmpty');
  });

  it('should fail validation with invalid student emails', async () => {
    const dto = new RegisterDto();
    dto.teacher = 'teacher@example.com';
    dto.students = ['invalid-email', 'student@example.com'];

    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].constraints).toHaveProperty('isEmail');
  });

  it('should fail validation with duplicate student emails', async () => {
    const dto = new RegisterDto();
    dto.teacher = 'teacher@example.com';
    dto.students = ['student@example.com', 'student@example.com'];

    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].constraints).toHaveProperty('arrayUnique');
  });
});

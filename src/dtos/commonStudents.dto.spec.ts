import { validate } from 'class-validator';
import { plainToInstance } from 'class-transformer';
import { CommonStudentsDto } from './commonStudents.dto';

describe('CommonStudentsDto', () => {
  it('should pass validation with valid single teacher email', async () => {
    const dto = plainToInstance(CommonStudentsDto, {
      teacher: 'teacher@example.com',
    });

    const errors = await validate(dto);
    expect(errors.length).toBe(0);
  });

  it('should pass validation with valid multiple teacher emails', async () => {
    const dto = plainToInstance(CommonStudentsDto, {
      teacher: ['teacher1@example.com', 'teacher2@example.com'],
    });

    const errors = await validate(dto);
    expect(errors.length).toBe(0);
  });

  it('should fail validation with empty array', async () => {
    const dto = plainToInstance(CommonStudentsDto, {
      teacher: [],
    });

    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].constraints).toHaveProperty('arrayNotEmpty');
  });

  it('should fail validation with invalid email in array', async () => {
    const dto = plainToInstance(CommonStudentsDto, {
      teacher: ['teacher1@example.com', 'invalid-email'],
    });

    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].constraints).toHaveProperty('isEmail');
  });

  it('should transform single string to array', async () => {
    const dto = plainToInstance(CommonStudentsDto, {
      teacher: 'teacher@example.com',
    });

    expect(Array.isArray(dto.teacher)).toBe(true);
    expect(dto.teacher).toEqual(['teacher@example.com']);
  });
});

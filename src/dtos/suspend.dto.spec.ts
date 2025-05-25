import { validate } from 'class-validator';
import { SuspendDto } from './suspend.dto';

describe('SuspendDto', () => {
  it('should pass validation with valid email', async () => {
    const dto = new SuspendDto();
    dto.student = 'student@example.com';

    const errors = await validate(dto);
    expect(errors.length).toBe(0);
  });

  it('should fail validation with invalid email', async () => {
    const dto = new SuspendDto();
    dto.student = 'invalid-email';

    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].constraints).toHaveProperty('isEmail');
  });

  it('should fail validation with empty email', async () => {
    const dto = new SuspendDto();
    dto.student = '';

    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].constraints).toHaveProperty('isNotEmpty');
  });

  it('should fail validation with missing email', async () => {
    const dto = new SuspendDto();

    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].constraints).toHaveProperty('isNotEmpty');
  });
});

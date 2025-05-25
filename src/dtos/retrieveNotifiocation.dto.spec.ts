import { validate } from 'class-validator';
import { RetrieveNotificationDto } from './retrieveNotifiocation.dto';

describe('RetrieveNotificationDto', () => {
  it('should pass validation with valid data', async () => {
    const dto = new RetrieveNotificationDto();
    dto.teacher = 'teacher@example.com';
    dto.notification = 'Hello @student1@example.com';

    const errors = await validate(dto);
    expect(errors.length).toBe(0);
  });

  it('should fail validation with invalid teacher email', async () => {
    const dto = new RetrieveNotificationDto();
    dto.teacher = 'invalid-email';
    dto.notification = 'Hello @student1@example.com';

    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].constraints).toHaveProperty('isEmail');
  });

  it('should fail validation with empty teacher email', async () => {
    const dto = new RetrieveNotificationDto();
    dto.teacher = '';
    dto.notification = 'Hello @student1@example.com';

    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].constraints).toHaveProperty('isNotEmpty');
  });

  it('should fail validation with empty notification', async () => {
    const dto = new RetrieveNotificationDto();
    dto.teacher = 'teacher@example.com';
    dto.notification = '';

    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].constraints).toHaveProperty('isNotEmpty');
  });

  it('should fail validation with missing notification', async () => {
    const dto = new RetrieveNotificationDto();
    dto.teacher = 'teacher@example.com';

    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].constraints).toHaveProperty('isNotEmpty');
  });

  it('should pass validation with notification containing multiple mentions', async () => {
    const dto = new RetrieveNotificationDto();
    dto.teacher = 'teacher@example.com';
    dto.notification = 'Hello @student1@example.com @student2@example.com';

    const errors = await validate(dto);
    expect(errors.length).toBe(0);
  });
});

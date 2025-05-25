# Class Management API

A RESTful API service for teachers to perform administrative functions for their students. Built with NestJS, TypeScript, and MySQL.

## Features

- Register students to a teacher
- Retrieve common students between teachers
- Suspend a student
- Retrieve notifications recipients

## Prerequisites

- Node.js (v18 or higher)
- MySQL (v8.0 or higher)
- Docker (optional, for containerized database)

## Local Setup

1. Clone the repository:
```bash
git clone <repository-url>
cd class-management
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
Create a `.env` file in the root directory with the following content:
```env
DB_TYPE=mysql
DB_HOST=localhost
DB_PORT=3306
DB_USERNAME=your_username
DB_PASSWORD=your_password
DB_DATABASE=class_management
PORT=3000
```

4. Start MySQL database:
   - Using Docker:
   ```bash
   npm run docker-start
   ```
   - Or use your local MySQL instance

5. Run database migrations:
```bash
npm run db-migration-run
```

6. Start the application:
```bash
# Development
npm run start:dev

# Production
npm run build
npm run start:prod
```

The API will be available at `http://localhost:3000`

## API Documentation

### 1. Register Students to Teacher
- **Endpoint**: POST /api/register
- **Description**: Register one or more students to a teacher
- **Request Body**:
```json
{
  "teacher": "teacherken@gmail.com",
  "students": [
    "studentjon@gmail.com",
    "studenthon@gmail.com"
  ]
}
```
- **Response**: 204 No Content

### 2. Get Common Students
- **Endpoint**: GET /api/commonstudents
- **Description**: Retrieve students common to a given list of teachers
- **Query Parameters**: teacher (can appear multiple times)
- **Example**: GET /api/commonstudents?teacher=teacherken%40gmail.com&teacher=teacherjoe%40gmail.com
- **Response**:
```json
{
  "students": [
    "commonstudent1@gmail.com",
    "commonstudent2@gmail.com"
  ]
}
```

### 3. Suspend Student
- **Endpoint**: POST /api/suspend
- **Description**: Suspend a specified student
- **Request Body**:
```json
{
  "student": "studentmary@gmail.com"
}
```
- **Response**: 204 No Content

### 4. Retrieve Notifications Recipients
- **Endpoint**: POST /api/retrievefornotifications
- **Description**: Retrieve a list of students who can receive a notification
- **Request Body**:
```json
{
  "teacher": "teacherken@gmail.com",
  "notification": "Hello students! @studentagnes@gmail.com @studentmiche@gmail.com"
}
```
- **Response**:
```json
{
  "recipients": [
    "studentbob@gmail.com",
    "studentagnes@gmail.com",
    "studentmiche@gmail.com"
  ]
}
```

## Testing

The project includes comprehensive unit tests for all components. To run the tests:

```bash
# Run unit tests
npm test

# Run tests with coverage
npm run test:cov

# Run tests in watch mode
npm run test:watch

# Run e2e tests
npm run test:e2e
```

## Project Structure

```
src/
├── modules/
│   └── teacher/
│       ├── teacher.controller.ts
│       ├── teacher.service.ts
│       └── teacher.module.ts
├── databases/
│   └── entities/
│       ├── teacher.entity.ts
│       ├── student.entity.ts
│       └── registration.entity.ts
├── dtos/
│   ├── register.dto.ts
│   ├── suspend.dto.ts
│   └── retrieveNotification.dto.ts
└── main.ts
```

## Database Schema

The application uses three main tables:

1. **teachers**
   - id (PK)
   - email (unique)

2. **students**
   - id (PK)
   - email (unique)
   - suspended (boolean)

3. **registrations**
   - teacher_id (PK, FK)
   - student_id (PK, FK)

## API Documentation

Swagger documentation is available at `http://localhost:3000/api-docs` when running the application locally.

## Error Handling

The API implements proper error handling with appropriate HTTP status codes:

- 204: Successful operation with no content to return
- 200: Successful operation with content
- 400: Bad Request (invalid input)
- 404: Not Found (resource doesn't exist)
- 500: Internal Server Error

## Security Considerations

- Input validation using class-validator
- SQL injection prevention using TypeORM
- Rate limiting (to be implemented)
- Request validation
- Error message sanitization

## Future Improvements

1. Add rate limiting
2. Implement caching
3. Add authentication/authorization
4. Add API versioning
5. Implement logging service
6. Add more comprehensive error handling
7. Add request/response compression

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a new Pull Request

## License

This project is licensed under the [UNLICENSED License](LICENSE).

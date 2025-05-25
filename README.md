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
- **Sequence Diagram**:
![Register student API](https://github.com/user-attachments/assets/9c663aad-cffe-45e5-886c-d617a508a1f7)

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
- **Sequence Diagram**:
![Common student](https://github.com/user-attachments/assets/db5fc2eb-772c-4d33-87c0-8a663fa6b7d9)

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
- **Sequence Diagram**:
![Suspend Student](https://github.com/user-attachments/assets/fcaeede0-ef81-40d2-a3fd-55870993804f)

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
- **Sequence Diagram**:
![Retrieve notification recipients](https://github.com/user-attachments/assets/140da7f9-2aef-4557-8151-2c403a6e9d1d)

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

## Testing with Postman

A Postman collection has been provided to help test the API endpoints. To use it:

1. Import the `class-management-api.postman_collection.json` file into Postman
2. The collection uses a variable `{{base_url}}` which is set to `http://localhost:3000` by default
3. Make sure your API server is running before testing
4. The collection includes all 4 API endpoints with example requests and documentation:
   - Register Students (`POST /api/register`)
   - Get Common Students (`GET /api/commonstudents`)
   - Suspend Student (`POST /api/suspend`)
   - Retrieve Notifications (`POST /api/retrievefornotifications`)

Each endpoint in the collection includes:
- Example request body (where applicable)
- Description of the endpoint's purpose
- Expected responses
- Validation rules

### API Endpoints Documentation

#### 1. Register Students
- **Method**: POST
- **Endpoint**: `/api/register`
- **Purpose**: Register one or more students to a specified teacher
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
- **Response**: 204 No Content (Success)

#### 2. Get Common Students
- **Method**: GET
- **Endpoint**: `/api/commonstudents`
- **Purpose**: Retrieve students who are registered to ALL specified teachers
- **Query Parameters**: `teacher` (can be specified multiple times)
- **Example**: `/api/commonstudents?teacher=teacherken@gmail.com&teacher=teacherjoe@gmail.com`
- **Response**:
  ```json
  {
    "students": [
      "commonstudent1@gmail.com",
      "commonstudent2@gmail.com"
    ]
  }
  ```

#### 3. Suspend Student
- **Method**: POST
- **Endpoint**: `/api/suspend`
- **Purpose**: Suspend a specified student
- **Request Body**:
  ```json
  {
    "student": "studentmary@gmail.com"
  }
  ```
- **Response**: 204 No Content (Success)

#### 4. Retrieve Notifications
- **Method**: POST
- **Endpoint**: `/api/retrievefornotifications`
- **Purpose**: Get a list of students who can receive a notification
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
      "studentagnes@gmail.com",
      "studentmiche@gmail.com",
      "studentjon@gmail.com"
    ]
  }
  ```

### Error Responses

All endpoints may return the following error responses:

- **400 Bad Request**: When the input data is invalid
- **404 Not Found**: When a referenced teacher or student doesn't exist
- **500 Internal Server Error**: For unexpected server errors

Each error response includes a message explaining the error:
```json
{
  "message": "Error description here"
}
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

## API Documentation Tools

Swagger documentation is available at `http://localhost:3000/api-docs` when running the application locally.

## Error Handling

The API implements proper error handling with appropriate HTTP status codes:

- 204: Successful operation with no content to return
- 200: Successful operation with content
- 400: Bad Request (invalid input)
- 404: Not Found (resource doesn't exist)
- 500: Internal Server Error



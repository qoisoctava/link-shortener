<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

  <p align="center">A progressive <a href="http://nodejs.org" target="_blank">Node.js</a> framework for building efficient and scalable server-side applications.</p>
    <p align="center">
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/v/@nestjs/core.svg" alt="NPM Version" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/l/@nestjs/core.svg" alt="Package License" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/dm/@nestjs/common.svg" alt="NPM Downloads" /></a>
<a href="https://circleci.com/gh/nestjs/nest" target="_blank"><img src="https://img.shields.io/circleci/build/github/nestjs/nest/master" alt="CircleCI" /></a>
<a href="https://discord.gg/G7Qnnhy" target="_blank"><img src="https://img.shields.io/badge/discord-online-brightgreen.svg" alt="Discord"/></a>
<a href="https://opencollective.com/nest#backer" target="_blank"><img src="https://opencollective.com/nest/backers/badge.svg" alt="Backers on Open Collective" /></a>
<a href="https://opencollective.com/nest#sponsor" target="_blank"><img src="https://opencollective.com/nest/sponsors/badge.svg" alt="Sponsors on Open Collective" /></a>
  <a href="https://paypal.me/kamilmysliwiec" target="_blank"><img src="https://img.shields.io/badge/Donate-PayPal-ff3f59.svg" alt="Donate us"/></a>
    <a href="https://opencollective.com/nest#sponsor"  target="_blank"><img src="https://img.shields.io/badge/Support%20us-Open%20Collective-41B883.svg" alt="Support us"></a>
  <a href="https://twitter.com/nestframework" target="_blank"><img src="https://img.shields.io/twitter/follow/nestframework.svg?style=social&label=Follow" alt="Follow us on Twitter"></a>
</p>
  <!--[![Backers on Open Collective](https://opencollective.com/nest/backers/badge.svg)](https://opencollective.com/nest#backer)
  [![Sponsors on Open Collective](https://opencollective.com/nest/sponsors/badge.svg)](https://opencollective.com/nest#sponsor)-->

## Description

[Nest](https://github.com/nestjs/nest) framework TypeScript starter repository.

## Project setup

```bash
$ npm install
```

## Compile and run the project

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Run tests

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## Deployment

When you're ready to deploy your NestJS application to production, there are some key steps you can take to ensure it runs as efficiently as possible. Check out the [deployment documentation](https://docs.nestjs.com/deployment) for more information.

If you are looking for a cloud-based platform to deploy your NestJS application, check out [Mau](https://mau.nestjs.com), our official platform for deploying NestJS applications on AWS. Mau makes deployment straightforward and fast, requiring just a few simple steps:

```bash
$ npm install -g @nestjs/mau
$ mau deploy
```

With Mau, you can deploy your application in just a few clicks, allowing you to focus on building features rather than managing infrastructure.

## Resources

Check out a few resources that may come in handy when working with NestJS:

- Visit the [NestJS Documentation](https://docs.nestjs.com) to learn more about the framework.
- For questions and support, please visit our [Discord channel](https://discord.gg/G7Qnnhy).
- To dive deeper and get more hands-on experience, check out our official video [courses](https://courses.nestjs.com/).
- Deploy your application to AWS with the help of [NestJS Mau](https://mau.nestjs.com) in just a few clicks.
- Visualize your application graph and interact with the NestJS application in real-time using [NestJS Devtools](https://devtools.nestjs.com).
- Need help with your project (part-time to full-time)? Check out our official [enterprise support](https://enterprise.nestjs.com).
- To stay in the loop and get updates, follow us on [X](https://x.com/nestframework) and [LinkedIn](https://linkedin.com/company/nestjs).
- Looking for a job, or have a job to offer? Check out our official [Jobs board](https://jobs.nestjs.com).

## Support

Nest is an MIT-licensed open source project. It can grow thanks to the sponsors and support by the amazing backers. If you'd like to join them, please [read more here](https://docs.nestjs.com/support).

## Stay in touch

- Author - [Kamil Myśliwiec](https://twitter.com/kammysliwiec)
- Website - [https://nestjs.com](https://nestjs.com/)
- Twitter - [@nestframework](https://twitter.com/nestframework)

## License

Nest is [MIT licensed](https://github.com/nestjs/nest/blob/master/LICENSE).

# Link Shortener API Documentation

## Overview

This document provides comprehensive documentation for the Link Shortener API built with NestJS, TypeORM, and MySQL. This API allows users to create, manage, and track short links.

## Base URL

Development: `http://localhost:3000`  
Production: Configure via `BASE_URL` environment variable

## Authentication

The API uses JWT (JSON Web Token) authentication for protected endpoints.

### Token Format

Include the token in the Authorization header for protected endpoints:

```
Authorization: Bearer <your_jwt_token>
```

### Authentication Endpoints

#### Register a New User

```
POST /auth/register
```

Creates a new user account.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "securepassword"
}
```

**Response (201 Created):**
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "email": "user@example.com"
  }
}
```

**Error Responses:**
- `400 Bad Request`: Invalid input
- `409 Conflict`: Email already in use

#### User Login

```
POST /auth/login
```

Authenticates a user and returns a JWT token.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "securepassword"
}
```

**Response (200 OK):**
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "email": "user@example.com"
  }
}
```

**Error Responses:**
- `400 Bad Request`: Invalid input
- `401 Unauthorized`: Invalid credentials

## Link Management

### Create a Short Link

```
POST /links
```

Creates a new short link. Requires authentication.

**Request Body:**
```json
{
  "originalUrl": "https://example.com/very/long/url/that/needs/shortening",
  "customShortCode": "mylink"  // Optional: custom short code
}
```

**Response (201 Created):**
```json
{
  "id": 1,
  "originalUrl": "https://example.com/very/long/url/that/needs/shortening",
  "shortCode": "mylink",  // Or auto-generated if not provided
  "clickCount": 0,
  "createdAt": "2025-05-12T10:30:00.000Z",
  "updatedAt": "2025-05-12T10:30:00.000Z",
  "fullShortUrl": "http://localhost:3000/mylink"
}
```

**Error Responses:**
- `400 Bad Request`: Invalid input
- `401 Unauthorized`: Missing or invalid token
- `409 Conflict`: Custom short code already exists

### Get All User Links

```
GET /links
```

Retrieves all links created by the authenticated user. Requires authentication.

**Response (200 OK):**
```json
[
  {
    "id": 1,
    "originalUrl": "https://example.com/page1",
    "shortCode": "abc123",
    "clickCount": 5,
    "createdAt": "2025-05-12T10:30:00.000Z",
    "updatedAt": "2025-05-12T10:30:00.000Z"
  },
  {
    "id": 2,
    "originalUrl": "https://example.com/page2",
    "shortCode": "def456",
    "clickCount": 2,
    "createdAt": "2025-05-12T11:30:00.000Z",
    "updatedAt": "2025-05-12T11:30:00.000Z"
  }
]
```

**Error Response:**
- `401 Unauthorized`: Missing or invalid token

### Get Link Statistics

```
GET /links/:id/stats
```

Retrieves statistics for a specific link. Requires authentication.

**Response (200 OK):**
```json
{
  "id": 1,
  "originalUrl": "https://example.com/page1",
  "shortCode": "abc123",
  "clickCount": 5,
  "createdAt": "2025-05-12T10:30:00.000Z",
  "updatedAt": "2025-05-12T10:30:00.000Z"
}
```

**Error Responses:**
- `401 Unauthorized`: Missing or invalid token
- `403 Forbidden`: Link belongs to another user
- `404 Not Found`: Link not found

### Update Link

```
PUT /links/:id
```

Updates an existing link. Requires authentication.

**Request Body:**
```json
{
  "originalUrl": "https://updated-example.com",  // Optional
  "customShortCode": "newcode"  // Optional
}
```

**Response (200 OK):**
```json
{
  "id": 1,
  "originalUrl": "https://updated-example.com",
  "shortCode": "newcode",
  "clickCount": 5,
  "createdAt": "2025-05-12T10:30:00.000Z",
  "updatedAt": "2025-05-12T12:30:00.000Z"
}
```

**Error Responses:**
- `400 Bad Request`: Invalid input
- `401 Unauthorized`: Missing or invalid token
- `403 Forbidden`: Link belongs to another user
- `404 Not Found`: Link not found
- `409 Conflict`: Custom short code already exists

### Delete Link

```
DELETE /links/:id
```

Deletes a link. Requires authentication.

**Response (204 No Content)**

**Error Responses:**
- `401 Unauthorized`: Missing or invalid token
- `403 Forbidden`: Link belongs to another user
- `404 Not Found`: Link not found

## Link Redirection

### Direct Access (Primary Method)

```
GET /:shortCode
```

Redirects to the original URL associated with the short code.

**Example:**
```
GET /abc123
```

**Response:**
- `301 Moved Permanently`: Redirects to original URL
- `404 Not Found`: Short code not found

### API Access (Fallback Method)

```
GET /links/:shortCode/redirect
```

Alternative redirect endpoint - primarily for API testing.

**Example:**
```
GET /links/abc123/redirect
```

**Response:**
- `301 Moved Permanently`: Redirects to original URL
- `404 Not Found`: Short code not found

## Error Handling

The API returns standard HTTP status codes and error responses:

### Common Error Response Format

```json
{
  "statusCode": 400,
  "message": ["error message details"],
  "error": "Error Type"
}
```

### Status Codes

- `200`: OK - Request succeeded
- `201`: Created - Resource created successfully
- `204`: No Content - Request succeeded, no content returned
- `400`: Bad Request - Invalid input
- `401`: Unauthorized - Authentication required
- `403`: Forbidden - Insufficient permissions
- `404`: Not Found - Resource not found
- `409`: Conflict - Resource conflict (e.g., duplicate short code)
- `500`: Internal Server Error - Server-side error

## Data Models

### User

| Field | Type | Description |
|-------|------|-------------|
| id | number | Unique identifier |
| email | string | User email (unique) |
| password | string | Hashed password |
| createdAt | Date | Account creation timestamp |
| updatedAt | Date | Account update timestamp |

### Link

| Field | Type | Description |
|-------|------|-------------|
| id | number | Unique identifier |
| originalUrl | string | Original URL to redirect to |
| shortCode | string | Unique short code for URL |
| clickCount | number | Number of times link was accessed |
| user | User | Reference to owner |
| createdAt | Date | Link creation timestamp |
| updatedAt | Date | Link update timestamp |

## API Usage Examples

### cURL Examples

#### Register a User

```bash
curl -X POST http://localhost:3000/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'
```

#### Login

```bash
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'
```

#### Create a Short Link

```bash
curl -X POST http://localhost:3000/links \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -d '{"originalUrl":"https://example.com/long/url"}'
```

#### Create a Custom Short Link

```bash
curl -X POST http://localhost:3000/links \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -d '{"originalUrl":"https://example.com/long/url","customShortCode":"mylink"}'
```

#### Get All Links

```bash
curl -X GET http://localhost:3000/links \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

#### Update a Link

```bash
curl -X PUT http://localhost:3000/links/1 \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -d '{"originalUrl":"https://updated-example.com"}'
```

#### Delete a Link

```bash
curl -X DELETE http://localhost:3000/links/1 \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

#### Get Link Statistics

```bash
curl -X GET http://localhost:3000/links/1/stats \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

#### Access a Short Link

```bash
curl -L http://localhost:3000/abc123
```

## Security Considerations

The API implements several security measures:

1. **Password Hashing**: User passwords are securely hashed using bcrypt.
2. **JWT Authentication**: Secure, stateless authentication for protected routes.
3. **Input Validation**: Comprehensive validation of all input data.
4. **Resource Ownership**: Users can only modify their own resources.
5. **Rate Limiting**: Consider implementing rate limiting for production use.

## Development and Testing

### Environment Variables

Create a `.env` file in the project root:

```env
# Database
DB_HOST=localhost
DB_PORT=3306
DB_USERNAME=root
DB_PASSWORD=yourpassword
DB_NAME=link_shortener

# JWT
JWT_SECRET=your-super-secret-jwt-key

# App
PORT=3000
BASE_URL=http://localhost:3000
```

### Running Tests

```bash
# Unit tests
npm run test

# Test coverage
npm run test:cov

# E2E tests
npm run test:e2e
```

## Production Considerations

For production deployment:

1. Set secure environment variables
2. Set `synchronize: false` in TypeORM config
3. Use migrations for database changes
4. Set up proper CORS configuration
5. Implement rate limiting
6. Use HTTPS for all endpoints
7. Consider adding monitoring and logging

## Support and Contact

For API support or questions, please contact the development team.

---

This API documentation provides a comprehensive reference for developers integrating with the Link Shortener service. The clear organization of endpoints, authentication methods, and examples facilitates easy implementation and testing.
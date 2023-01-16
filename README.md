# CRUD API
Simple CRUD API with an in-memory database and a load balancer.

## Stack:
- Node.js
- TypeScript
- ESLint /Prettier
- Jest / supertest
- nodemon / dotenv / cross-env

## Usage
```
# Install dependencies
npm install

# Run in develpment
npm run start:dev

# Run in production
npm run start:prod

# Run in cluster mode
npm run start:multi

# Run tests
npm run test

# Run ESLint
npm run lint
```

## Routes
```
GET      /api/users
POST     /api/users
GET      /api/users/:id
PUT      /api/users/:id
DELETE   /api/users/:id
```

## User interface:
```
{
  id: string (uuid);
  username: string;  
  age: number;       
  hobbies: string[];  
}
```

## Load balancer
This app supports horizontal scaling for application. It utilizes load balancer based on the Node.js `Cluster` API (Round-robin algorithm).
For example: host machine has 4 cores, `PORT` is 4000. On run `npm run start:multi` it works following way
- On `localhost:4000/api` load balancer is listening for requests
- On `localhost:4001/api`, `localhost:4002/api`, `localhost:4003/api`, `localhost:4004/api` workers are listening for requests from load balancer
- When user sends request to `localhost:4000/api`, load balancer sends this request to `localhost:4001/api`, next user request is sent to `localhost:4002/api` and so on.
- After sending request to `localhost:4004/api` load balancer starts from the first worker again (sends request to `localhost:4001/api`)
- State of db should be consistent between different workers, for example:
    1. First `POST` request addressed to `localhost:4001/api` creates user
    2. Second `GET` request addressed to `localhost:4002/api` should return created user
    3. Third `DELETE` request addressed to `localhost:4003/api` deletes created user
    4. Fourth `GET` request addressed to `localhost:4004/api` should return **404** status code for created user

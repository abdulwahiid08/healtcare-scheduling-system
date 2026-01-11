# Healthcare Scheduling System

Backend microservice-based system for managing healthcare consultation schedules between doctors and customers.

## Services

- Auth Service (3001)
- Schedule Service (3002)

## Run Project

```bash
docker compose up --build
```

# List environtment variables

```sh
# AUTH ENV
NODE_ENV=
APP_PORT=3001
JWT_SECRET='your_secret_key'
JWT_EXPIRES_IN=7d
DATABASE_URL=postgresql://user:pass@host:5432/db_auth_healthcare

#SCHEDULE ENV
NODE_ENV=
APP_PORT=3002
AUTH_SERVICE_URL=http://auth-service:3001
DATABASE_URL=postgresql://user:pass@host:5432/db_schedule_healthcare
REDIS_HOST=
REDIS_PORT=
REDIS_PASSWORD=

#NOTIFICATION ENV
NODE_ENV=
APP_PORT=3003
SMTP_HOST=smtp.gmail.com
SMTP_FROM=from
SMTP_PORT=465
SMTP_SECURE=true
SMTP_USER=user
SMTP_PASS=pass
REDIS_HOST=
REDIS_PORT=
REDIS_PASSWORD=

```

## GraphQL queris/mutations

```sh
# Mutation
mutation CreateCustomer {
    createCustomer(
        createCustomerInput: { name: "Abdul Wahid", email: "abdulwahid@gmail.com" }
    ) {
        success
        message
        data {
            id
            name
            email
            createdAt
            updatedAt
        }
    }
}
```

```sh
# Queries
query Customer {
    customer(id: "2af3f6a4-49cf-48ac-bcff-df1bbbce378c") {
        name
        email
        createdAt
        updatedAt
        id
    }
}
```

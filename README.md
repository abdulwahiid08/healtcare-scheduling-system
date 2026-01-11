# Healthcare Scheduling System

Backend microservice-based system for managing healthcare consultation schedules between doctors and customers.

## Services

- Auth Service (3001)
- Schedule Service (3002)

## Run Project

```bash
docker compose up --build
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

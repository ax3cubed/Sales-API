Sales API is a RESTful API designed to manage sales operations, including order processing, product management, and user authentication. The project is built using Node.js and TypeScript and follows modern best practices, including strict type-checking, comprehensive logging, and security features.

## Table of Contents

1. [Project Structure](notion://www.notion.so/Sales-API-53e13422c50f4c30a221f033d206003b?showMoveTo=true&saveParent=true#project-structure)
2. [Installation](notion://www.notion.so/Sales-API-53e13422c50f4c30a221f033d206003b?showMoveTo=true&saveParent=true#installation)
3. [NPM Scripts and Configuration](notion://www.notion.so/Sales-API-53e13422c50f4c30a221f033d206003b?showMoveTo=true&saveParent=true#npm-scripts-and-configuration)
4. [Biome Configuration](notion://www.notion.so/Sales-API-53e13422c50f4c30a221f033d206003b?showMoveTo=true&saveParent=true#biome-configuration)
5. [Implementation Process](notion://www.notion.so/Sales-API-53e13422c50f4c30a221f033d206003b?showMoveTo=true&saveParent=true#implementation-process)
6. [Contributing](notion://www.notion.so/Sales-API-53e13422c50f4c30a221f033d206003b?showMoveTo=true&saveParent=true#contributing)
7. [License](notion://www.notion.so/Sales-API-53e13422c50f4c30a221f033d206003b?showMoveTo=true&saveParent=true#license)
8. [Assignments]
## Project Structure

The project follows a well-organized directory structure, making it easy to navigate and maintain:

```

src/
│
├── api/
│   ├── controller/
│   ├── models/
│   │   ├── order.model.ts
│   │   ├── product.model.ts
│   │   ├── sales.model.ts
│   │   └── user.model.ts
│   ├── repositories/
│   ├── routes/
│   │   └── health-check.router.ts
│   └── services/
│
├── api-docs/
│   ├── openAPIDocumentGenerator.ts
│   ├── openAPIResponseBuilders.ts
│   └── openAPIRouter.ts
│
├── common/
│   ├── config/
│   │   ├── db/
│   │   ├── env/
│   │   │   └── index.ts
│   │   └── logger/
│   ├── dtos/
│   │   └── service-response.dto.ts
│   ├── middleware/
│   └── utils/
│       ├── common-validations.ts
│       └── http-handlers.ts
│
├── index.ts
└── server.ts

```

### Key Directories and Files

- **`api/`**: Contains the core API logic, including controllers, models, repositories, routes, and services.
- **`api-docs/`**: Manages API documentation generation using OpenAPI standards.
- **`common/`**: Holds shared utilities, configurations, DTOs, and middleware.
- **`index.ts`**: The entry point of the application.
- **`server.ts`**: Configures and starts the Express server.

## Installation

To set up the project locally, follow these steps:

1. **Clone the repository**:
    
    ```bash
    
    git clone https://github.com/ax3cubed/Sales-API.git
    cd Sales-API
    
    ```
    
2. **Install dependencies**:
    
    ```bash
    
    npm install
    
    ```
    
3. **Set up environment variables**:
Create a `.env` file in the root directory and add your environment-specific variables (refer to the `src/common/config/env/index.ts` for required variables).
4. **Run the development server**:
    
    ```bash
    
    npm run dev
    
    ```
    

## NPM Scripts and Configuration

This project uses various NPM scripts for development, testing, and production. Below is a summary of these scripts:

### Scripts

- **`dev`**: Start the development server with hot-reloading.
    
    ```bash
    
    npm run dev
    
    ```
    
- **`build`**: Compile TypeScript code to JavaScript.
    
    ```bash
    
    npm run build
    
    ```
    
- **`start`**: Run the compiled production build.
    
    ```bash
    
    npm run start
    
    ```
    
- **`clean`**: Remove generated files.
    
    ```bash
    
    npm run clean
    
    ```
    
- **`lint`**: Run the linter to check for code issues.
    
    ```bash
    
    npm run lint
    
    ```
    
- **`lint:fix`**: Automatically fix linting issues.
    
    ```bash
    
    npm run lint:fix
    
    ```
    
- **`format`**: Format the codebase.
    
    ```bash
    
    npm run format
    
    ```
    
- **`test`**: Run the test suite.
    
    ```bash
    
    npm run test
    
    ```
    
- **`prepare`**: Set up Git hooks using Husky.
    
    ```bash
    
    npm run prepare
    
    ```
    

### Dependencies

### Production Dependencies

- **`@asteasolutions/zod-to-openapi`**: Convert Zod schemas to OpenAPI documentation.
- **`cors`**: Middleware to enable Cross-Origin Resource Sharing.
- **`dotenv`**: Load environment variables from a `.env` file.
- **`envalid`**: Validate environment variables.
- **`express`**: Web framework for Node.js.
- **`express-rate-limit`**: Middleware to rate-limit requests.
- **`helmet`**: Security middleware for setting HTTP headers.
- **`http-status-codes`**: Constants for HTTP status codes.
- **`pino`**: High-performance logging library.
- **`pino-http`**: HTTP logger for Express apps, built on top of `pino`.
- **`swagger-ui-express`**: Serve auto-generated Swagger UI from Express.
- **`zod`**: TypeScript-first schema declaration and validation library.

### Development Dependencies

- **`@biomejs/biome`**: All-in-one tool for formatting, linting, and more.
- **`@types/cors`**: TypeScript type definitions for `cors`.
- **`@types/express`**: TypeScript type definitions for `express`.
- **`@types/supertest`**: TypeScript type definitions for `supertest`.
- **`@types/swagger-ui-express`**: TypeScript type definitions for `swagger-ui-express`.
- **`husky`**: Git hooks manager.
- **`lint-staged`**: Run linters on staged Git files.
- **`pino-pretty`**: Formatter for `pino` logs.
- **`rimraf`**: Cross-platform tool to remove directories.
- **`supertest`**: HTTP assertions made easy via `superagent`.
- **`tsup`**: TypeScript bundler.
- **`tsx`**: Runtime for TypeScript and JSX, without compiling.
- **`typescript`**: TypeScript language support.
- **`vite-tsconfig-paths`**: Vite plugin to support TypeScript paths mapping.
- **`vitest`**: Fast unit test framework for Vite projects.

## Biome Configuration

Biome is configured to enforce coding standards, automatically format code, and organize imports. Below is a detailed breakdown of the Biome configuration:

```json

{
  "$schema": "https://biomejs.dev/schemas/1.8.3/schema.json",
  "formatter": {
    "indentStyle": "space",
    "lineWidth": 120
  },
  "organizeImports": { "enabled": true },
  "linter": {
    "enabled": true,
    "rules": {
      "recommended": true,
      "suspicious": {
        "noExplicitAny": "off",
        "noConfusingVoidType": "off"
      },
      "style": {
        "noUselessElse": "off",
        "noNonNullAssertion": "off"
      },
      "complexity": {
        "noForEach": "off"
      }
    }
  }
}

```

### Key Settings

- **Formatter**:
    - Indentation is set to spaces.
    - The maximum line width is set to 120 characters for better readability.
- **Organize Imports**:
    - Automatically organizes imports to keep the codebase clean.
- **Linter**:
    - Enabled with recommended rules and specific overrides for flexibility in certain situations.

### Running Biome

- **Check for Issues**:
    
    ```bash
    
    npm run lint
    
    ```
    
- **Fix Issues**:
    
    ```bash
    
    npm run lint:fix
    
    ```
    
- **Format Code**:
    
    ```bash
    
    npm run format
    
    ```
    

## Implementation Process

To implement new features or fix bugs in the Sales API, follow the steps below:

1. **Fork and Clone** the repository:
    
    ```bash
    
    git clone https://github.com/ax3cubed/Sales-API.git
    
    ```
    
2. **Create a new branch** for your feature or bugfix:
    
    ```bash
    
    git checkout -b feature/my-new-feature
    
    ```
    
3. **Write and test your code**:
    - Add or modify files in the appropriate directories (e.g., `src/api/controllers/`, `src/api/models/`).
    - Make sure to include unit tests using `vitest`.
    - Run the test suite:
        
        ```bash
        npm run test
        
        ```
        
4. **Commit your changes** following the commit message guidelines.
5. **Push your branch** to GitHub:
    
    ```bash
    
    git push origin feature/my-new-feature
    
    ```
    
6. **Create a Pull Request** from your branch to the main branch.

### Explanation of `server.ts`

This file is responsible for setting up the Express server, applying middleware, and defining the API routes.

```tsx
typescriptCopy code
import cors from "cors";
import express, { type Express } from "express";
import helmet from "helmet";
import { pino } from "pino";

import { openAPIRouter } from "@/api-docs/openAPIRouter";
import { healthCheckRouter } from "@/api/routes/health-check.router";

```

- **Imports**:
    - `cors`: To handle Cross-Origin Resource Sharing.
    - `express`: The main framework for building the server.
    - `helmet`: Helps secure the app by setting various HTTP headers.
    - `pino`: A high-performance logging library.
    - `openAPIRouter`: Manages the API documentation.
    - `healthCheckRouter`: A simple route for health-checking the API.

```tsx
typescriptCopy code
const logger = pino({ name: "server start" });
const app: Express = express();

```

- **Logger**: Initializes `pino` for logging server activity, with a log name `"server start"`.
- **App Initialization**: An Express app instance is created.

```tsx
typescriptCopy code
app.set("trust proxy", true);

```

- **Trust Proxy**: Informs Express to trust the reverse proxy (useful if deploying behind a load balancer or reverse proxy).

```tsx
typescriptCopy code
// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(helmet());

```

- **Middlewares**:
    - `express.json()`: Parses incoming requests with JSON payloads.
    - `express.urlencoded({ extended: true })`: Parses incoming requests with URL-encoded payloads.
    - `helmet()`: Applies security best practices by setting HTTP headers.

```tsx
typescriptCopy code
// Routes
app.use("/health-check", healthCheckRouter);

// Swagger UI
app.use(openAPIRouter);

```

- **Routes**:
    - **Health Check**: Sets up the `/health-check` route using `healthCheckRouter`.
    - **Swagger UI**: Exposes API documentation using the OpenAPI router (`openAPIRouter`).

```tsx
typescriptCopy code
export { app, logger };

```

- **Exporting**: Exports the `app` and `logger` instances for use in other parts of the application (e.g., in the `index.ts` to start the server).

### Considerations for Future Enhancements

1. **CORS Middleware**: You imported `cors` but didn’t use it in the code. If your API needs to handle cross-origin requests, you can enable it by adding:
    
    ```tsx
    typescriptCopy code
    app.use(cors());
    
    ```
    
2. **Error Handling Middleware**: Consider adding centralized error handling middleware to manage errors more effectively.
3. **Environment-based Logging**: Adjust logging configurations (like log level) based on the environment (development, production, etc.).

### Explanation of `index.ts`

This file ties together your server setup and environment configuration, managing server startup and shutdown in a clean and robust manner.

```tsx
typescriptCopy code
import { PORT, NODE_ENV, HOST } from "@/common/config/env/index";
import { app, logger } from "@/server";

```

- **Environment Variables**:
    - `PORT`: The port number where the server will listen for requests.
    - `NODE_ENV`: The environment in which the application is running (e.g., development, production).
    - `HOST`: The host address for the server.
- **App and Logger**:
    - `app`: The Express app instance imported from your `server.ts` file.
    - `logger`: The logging instance also imported from `server.ts`.

```tsx
typescriptCopy code
const server = app.listen(PORT, () => {
  logger.info(`Server (${NODE_ENV}) running on http://${HOST}:${PORT}`);
});

```

- **Starting the Server**:
    - The server listens on the specified `PORT`.
    - Once the server is up, it logs a message with the current environment (`NODE_ENV`) and the server's URL (`http://${HOST}:${PORT}`).

```tsx
typescriptCopy code
const onCloseSignal = () => {
  logger.info("SIGINT received, shutting down");
  server.close(() => {
    logger.info("server closed");
    process.exit();
  });
  setTimeout(() => process.exit(1), 10000).unref();
};

```

- **Graceful Shutdown**:
    - **onCloseSignal**: A function that handles shutdown signals.
        - Logs that a shutdown signal (`SIGINT`) has been received.
        - Initiates the server shutdown with `server.close()`.
        - Logs when the server is closed and exits the process.
        - A fallback timeout is set to forcefully exit the process after 10 seconds if the server hasn't closed.

```tsx
typescriptCopy code
process.on("SIGINT", onCloseSignal);
process.on("SIGTERM", onCloseSignal);

```

- **Signal Handling**:
    - The server listens for `SIGINT` (e.g., when you press `Ctrl+C`) and `SIGTERM` (used by some systems to signal termination) to trigger the `onCloseSignal` function, ensuring a graceful shutdown.

### Considerations for Future Enhancements

1. **Graceful Shutdown for Ongoing Requests**: You could track ongoing requests and ensure they are completed before shutting down, preventing data loss or inconsistencies.
2. **Extended Signal Handling**: In addition to `SIGINT` and `SIGTERM`, consider handling other signals (like `SIGHUP` or `SIGUSR2`) depending on your deployment environment.
3. **Clustered Environments**: If you plan to run the API in a clustered environment (multiple instances), ensure each instance handles shutdown signals independently.
4. **Handling Shutdown of External Resources**: If your API interacts with databases or other services, you might want to add logic to close those connections gracefully before shutting down the server.

### Explanation of `env/index.ts`

```tsx
typescriptCopy code
import dotenv, { config } from "dotenv";
config({
  path: `.env.${process.env.NODE_ENV || "development"}.local`,
});

```

- **`dotenv`**: Used to load environment variables from a `.env` file into `process.env`.
- **`config`**: Loads the appropriate environment file based on the `NODE_ENV` value. If `NODE_ENV` is not set, it defaults to `"development"`.
    - `.env.${process.env.NODE_ENV || "development"}.local`: This allows different environment files for different environments (e.g., `.env.development.local`, `.env.production.local`).

```tsx
typescriptCopy code
import { cleanEnv, host, num, port, str, testOnly } from "envalid";

```

- **`envalid`**: A library for validating and managing environment variables. It provides utilities to define expected environment variables and their constraints.

```tsx
typescriptCopy code
export const {
  PORT,
  COMMON_RATE_LIMIT_MAX_REQUESTS,
  COMMON_RATE_LIMIT_WINDOW_MS,
  CORS_ORIGIN,
  HOST,
  NODE_ENV,
} = cleanEnv(process.env, {
  NODE_ENV: str({
    devDefault: testOnly("test"),
    choices: ["development", "production", "test"],
  }),
  HOST: host({ devDefault: testOnly("localhost") }),
  PORT: port({ devDefault: testOnly(3000) }),
  CORS_ORIGIN: str({ devDefault: testOnly("http://localhost:3000") }),
  COMMON_RATE_LIMIT_MAX_REQUESTS: num({ devDefault: testOnly(1000) }),
  COMMON_RATE_LIMIT_WINDOW_MS: num({ devDefault: testOnly(1000) }),
});

```

- **`cleanEnv`**: Validates environment variables and sets default values where necessary.
    - **`NODE_ENV`**: Environment type, with default to `"test"` if in a test environment.
    - **`HOST`**: Host address, defaults to `"localhost"`.
    - **`PORT`**: Port number for the server, defaults to `3000`.
    - **`CORS_ORIGIN`**: CORS allowed origin, defaults to `"http://localhost:3000"`.
    - **`COMMON_RATE_LIMIT_MAX_REQUESTS`**: Maximum number of requests allowed, defaults to `1000`.
    - **`COMMON_RATE_LIMIT_WINDOW_MS`**: Time window for rate limiting, defaults to `1000` milliseconds.

```tsx
typescriptCopy code
export const envs = {
  ...process.env,
  ...dotenv.config().parsed,
};

```

- **`envs`**: Combines `process.env` with parsed environment variables from `dotenv` configuration. This allows for additional access to environment variables if needed elsewhere.

### Best Practices and Considerations

1. **Default Values**:
    - Ensure default values provided are sensible and fit your application's needs.
2. **Environment-Specific Files**:
    - Maintain separate `.env` files for different environments (e.g., development, production) to manage environment-specific configurations easily.
3. **Validation**:
    - Use `envalid` to enforce required environment variables and their types. This helps in catching configuration issues early.
4. **Secure Storage**:
    - Ensure `.env` files are not included in version control. Use `.gitignore` to exclude them and manage sensitive information securely.
5. **Error Handling**:
    - Handle cases where required environment variables are missing or invalid to prevent runtime errors.


    # 8. Assignments: Order and Product Management

## Objectives

1. **Order Model**: Track the payment status and various states of an order.
2. **Order Service**: Implement functionalities to manage orders.
3. **Product Model**: Define a model for products and implement service methods.

---

## Order Model

### Requirements

- **Payment Status**: Determine if an order has been paid for.
- **Order Status**: Track the current status of an order. The statuses include:
  - Created
  - Pending Delivery
  - Delivered
  - Returned

## Order Service
Methods
Get All Orders

Retrieves a list of all orders.
Create an Order

When creating an order, also create a sales entry.
Note: There should only be one sales entry in the database. If a sales entry exists, update the existing entry's quantity and total price by adding the current order's price and quantity.
Update an Order

Orders cannot be updated after 15 minutes of creation.
Delete an Order

Orders should never be deleted. Consider using soft deletes.
Find by Order ID

Retrieve an order by its ID.
Product Model
Requirements
Define a model to represent products.
Implement service methods to manage products.
Model

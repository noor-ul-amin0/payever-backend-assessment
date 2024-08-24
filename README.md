# NestJS TypeScript Starter

A starter repository for building applications with the [NestJS](https://github.com/nestjs/nest) framework using TypeScript.

## Project Setup

First, install the necessary dependencies:

```bash
$ npm install
```

## Docker Setup

To run MongoDB and RabbitMQ services using Docker, follow these steps:

1. **Build and Start Docker Containers**

   Ensure you have Docker installed and running. Then, execute the following command to build and start the containers:

   ```bash
   $ docker-compose up -d
   ```

   This command uses the `docker-compose.yml` file to start MongoDB and RabbitMQ services in detached mode.

2. **Check Container Status**

   Verify that the containers are running with:

   ```bash
   $ docker ps
   ```

   You should see MongoDB and RabbitMQ listed among the running containers.

## Compile and Run the Project

You have several options for running the project:

- **Development Mode**

  ```bash
  $ npm run start
  ```

- **Watch Mode**

  ```bash
  $ npm run start:dev
  ```

- **Production Mode**

  ```bash
  $ npm run start:prod
  ```

## Run Tests

Execute the following commands to run tests:

- **Unit Tests**

  ```bash
  $ npm run test
  ```

- **End-to-End Tests**

  ```bash
  $ npm run test:e2e
  ```

- **Test Coverage**

  ```bash
  $ npm run test:cov
  ```

## Resources

- Visit the [NestJS Documentation](https://docs.nestjs.com) for more information about the framework.
- Join our [Discord channel](https://discord.gg/G7Qnnhy) for questions and support.
- Explore our official [video courses](https://courses.nestjs.com/) for in-depth learning.
- Use [NestJS Devtools](https://devtools.nestjs.com) to visualize and interact with your application.
- Check out our [enterprise support](https://enterprise.nestjs.com) for project assistance.
- Follow us on [X](https://x.com/nestframework) and [LinkedIn](https://linkedin.com/company/nestjs) for updates.
- Visit our [Jobs board](https://jobs.nestjs.com) for job opportunities.

## Support

Nest is an MIT-licensed open source project. We appreciate the support of our sponsors and backers. If you'd like to contribute, please [read more here](https://docs.nestjs.com/support).

## Stay in Touch

- **Author** - [Kamil Myśliwiec](https://twitter.com/kammysliwiec)
- **Website** - [nestjs.com](https://nestjs.com/)
- **Twitter** - [@nestframework](https://twitter.com/nestframework)

## License

Nest is [MIT licensed](https://github.com/nestjs/nest/blob/master/LICENSE).

# Photogram

Photogram is a social media app for sharing photos with friends. It is built with the [T3 Stack](https://create.t3.gg/), a fullstack framework that combines Next.js, Prisma, and tRPC.

Key features of Photogram:

- Authentication is handled by NextAuth.js.
- Styling is done using Tailwind CSS.
- The database is powered by Prisma with PostgreSQL hosted on AWS RDS.
- Images are stored using AWS S3.
- The API is built with tRPC.
- The frontend is developed with Next.js.
- TypeScript is the main programming language used.

## Getting Started

To get started with Photogram, you will need the following prerequisites:

- An AWS account. If you don't have one, you can create one [here](https://aws.amazon.com/free/).
- Terraform installed. You can find the installation instructions [here](https://learn.hashicorp.com/tutorials/terraform/install-cli).
- Node.js and yarn installed. You can find the installation instructions [here](https://nodejs.org/en/download/) and [here](https://classic.yarnpkg.com/en/docs/install).

Once you have these prerequisites, you can proceed with the setup and deployment of Photogram.

### Getting the code

First, clone the repository:

```bash
git clone ...
```

Then, install the dependencies with yarn (I recommend using yarn, but you can use npm as well):

```bash
yarn install
```

### Setting up the environment

First, you need to take care of used auth providers. This app uses Google and Discord as providers. For each provider, you need to create an app in developer console, and obtain `CLIENT_ID` and `CLIENT_SECRET`. Then, you need to set up the callback URLs. For Google, it is `http://localhost:3000/api/auth/callback/google`. For Discord, it is `http://localhost:3000/api/auth/callback/discord`. If you'd like to use other providers, you need to add them to the `server/auth.ts` file. List of all providers can be found [here](https://next-auth.js.org/providers/).

Then, you need to take care of the AWS. This app uses multiple tools from Amazon, like S3, Rekognition and RDS. To set up the environment, you need to create an AWS account and get `AWS_KEY_ID`, `AWS_SECRET` and `AWS_REGION_KEY` from the AWS console. Documentation about obtaining the keys can be found [here](https://docs.aws.amazon.com/IAM/latest/UserGuide/id_credentials_access-keys.html#Using_CreateAccessKey)

Then, create a `.env` file based on the `.env.example` The `.env.example` file contains all the necessary variables, so you can just copy it and fill in the values. `DATABASE_URL` is going to be filled after terraforming is done.

Having all the necessary values in `.env`, you need to initialize all the services. In the repository there is a Terraform `main.tf` file, which contains all the necessary configuration. To initialize the services, you need to run the following commands:

```bash
terraform init
terraform apply
```

After configuration is done, terraform will output couple, values, but the most important one is an url to the postgres database, which needs to be added to the `.env` file as well.

### Running the app

Having all the necessary values in `.env`, you can run the app with the following command:

```bash
yarn db:push
yarn dev
```

The `yarn db:push` command will run the migrations and seed the database with some data. The `yarn dev` command will start the development server.

If you want to run the app in production mode, you need to build the app first:

```bash
yarn build
yarn start
```

## Deploying the app

The best way to deploy the app is to use [Vercel](https://vercel.com), the creators of the NextJS framework. It is very easy to deploy the app with Vercel, you just need to connect your GitHub account and select the repository. Vercel will take care of the rest. They also handle CI/CD, so every time you push to the repository, the app will be automatically deployed.
Instructions on how to deploy the app can be found [here](https://vercel.com/docs/deployments/overview).

## Learn More

- [T3 Stack](https://create.t3.gg/)
- [Next.js](https://nextjs.org)
- [NextAuth.js](https://next-auth.js.org)
- [Prisma](https://prisma.io)
- [Tailwind CSS](https://tailwindcss.com)
- [tRPC](https://trpc.io)
- [TypeScript](https://www.typescriptlang.org)
- [Terraform](https://www.terraform.io)
- [PostgreSQL](https://www.postgresql.org)
- [AWS](https://aws.amazon.com)
- [Rekognition](https://aws.amazon.com/rekognition/)
- [S3](https://aws.amazon.com/s3/)
- [RDS](https://aws.amazon.com/rds/)

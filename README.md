# todo-app

A basic todo app built with React, Express, and Tanstack Query.

## Installation

To install the project dependencies, run the following command in the root of the project:

```bash
yarn install
```

you will need to create a .env.local file in the /apps/frontend directory of the project with the following variables:

```
VITE_API_URL=http://localhost:3000/api
```

Then run the following command in the root of the project:

```bash
yarn dev
```

## To do list

[x] Create yarn workspace
[x] Create apps/frontend
[x] Create apps/backend
[x] Create flat file DB
[x] Create shared types
[x] Install dependencies express, vite, typescript, tailwindcss and  tanstack-query
[x] Build out basic CRUD routes on the backend
[x] Build grid for todos
[x] Fetch todos from backend using Tanstack Query
[] Install Vitest
[] Add unit tests
[] Deploy to production

Future todos:
[] Add postcss to not load all tailwindcss
[] Debounce inputs
[] Improve optimistic updates
[] Build out design system for components and look into Shadcn UI for quicker development
[] Add delete button to UI
[] Configure .env to be at the root of the project

# GitHub Repository Lines of Code Calculator

Simplify GitHub repository analysis with our Lines of Code Calculator. Quickly input the owner and repository name to obtain total lines of code, providing valuable insights for developers and project managers. Effortlessly streamline codebase assessments for enhanced efficiency.

## Demo

You can check out a live demo [here](https://ghloc.netlify.app/).

## Prerequisites

Make sure you have the following software installed on your machine:

- [Node.js](https://nodejs.org/) (version 14 or higher)
- [npm](https://www.npmjs.com/) (comes with Node.js)
- [Git](https://git-scm.com/) (optional but recommended)

## Recommended IDE Setup

[VSCode](https://code.visualstudio.com/) + [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar) (and disable Vetur) + [TypeScript Vue Plugin (Volar)](https://marketplace.visualstudio.com/items?itemName=Vue.vscode-typescript-vue-plugin).

## Getting Started

1. **Clone the Repository:**

   ```sh
   git clone https://github.com/mhamid49/GitHub-Repository-Lines-of-Code-Calculator.git
   ```

2. **Navigate to the Project Directory:**

   ```sh
   cd GitHub-Repository-Lines-of-Code-Calculator
   ```

3. **Configure Environment Variables:**

   Create a .env file in the root of the project and set the following variables:

   ```env
   VITE_BASE_URL=http://127.0.0.1:5173
   VITE_GITHUB_ACCESS_TOKEN=your-github-access-token
   ```

## Project Setup

1. **Install Dependencies:**

   ```sh
   npm install
   ```

2. **Run the Application:**

- Compile and Hot-Reload for Development:

  ```sh
  npm run dev
  ```

- Compile and Minify for Production:

  ```sh
  npm run build
  ```

- Lint with [ESLint](https://eslint.org/):

  ```sh
  npm run lint
  ```

## Customize configuration

See [Vite Configuration Reference](https://vitejs.dev/config/).

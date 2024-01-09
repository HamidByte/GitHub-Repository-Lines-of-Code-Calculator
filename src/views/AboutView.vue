<template>
  <div class="main">
    <h1 class="title">GitHub Repository Line of Code Calculator</h1>

    <div class="container">
      <p>Simplify GitHub repository analysis with our Line of Code Calculator. Quickly input the owner and repository name to obtain total lines of code, providing valuable insights for developers and project managers. Effortlessly streamline codebase assessments for enhanced efficiency.</p>
    </div>
  </div>
</template>

<style scoped>
.title {
  margin: 2em 0;
  text-align: center;
  font-size: 1.5em;
  font-weight: 400;
  text-transform: uppercase;
  word-spacing: 1px;
  letter-spacing: 1.5px;
  color: var(--color-dark-subtle);
}

.dark .title {
  color: var(--color-light-subtle);
}

.main {
  max-width: 48rem;
  margin: 0 auto;
}

.container {
  max-width: 36rem;
  width: 100%;
  margin: 0 auto;
}
</style>

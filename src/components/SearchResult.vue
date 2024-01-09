<template>
  <div class="main">
    <h1 class="title">GitHub Repository Line of Code Calculator</h1>

    <div class="container">
      <div class="error-bad-request" v-if="errorFetchingData">
        <h2>No results. Please enter a valid search query.</h2>
      </div>
      <div v-else>
        <div v-if="totalLines" class="result-list">
          <h2>Total Lines of Code: {{ totalLines }}</h2>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { api } from '@/api'

export default {
  // Add logic to fetch GitHub data using Axios based on the user and repo params
  data() {
    return {
      user: null,
      repo: null,
      branch: null,
      filePaths: [],
      filesContent: [],
      totalLines: 0,
      errorFetchingData: false
    }
  },
  created() {
    this.user = this.$route.params.user
    this.repo = this.$route.params.repo
    this.branch = this.$route.query.branch || 'master' // Use the specified branch or default to 'master'

    // Make a request to the GitHub API
    // Fetch GitHub data based on user, repo, and branch
    this.getRepositoryData(this.user, this.repo, this.branch)
  },
  methods: {
    async getRepositoryData(user, repo, branch) {
      try {
        const repositoryInfo = await api.getRepositoryInformation(user, repo)
        const { repositoryTree, repositoryContents } = await this.fetchRepositoryData(user, repo, branch)

        console.log(repositoryInfo)

        // We are not using filePaths at the moment
        // Extract file paths
        // item.type === 'blob' for file
        // item.type === 'tree' for directory
        this.filePaths = repositoryTree
          .filter(item => item.type === 'blob') // Only include blobs (files), not trees (directories)
          .map(item => item.path)

        // Extract repository file path, name and contents
        this.filesContent = repositoryContents
          .filter(item => !item.length) // Only include files, not directories
          .map(item => ({
            fileName: item.path,
            fileContent: this.decodeBase64Content(item.content)
          }))

        // Calculate total number of lines
        this.totalLines = this.filesContent.reduce((total, file) => {
          // Check if fileContent is not null before splitting lines
          return total + (file.fileContent ? file.fileContent.split('\n').length : 0)
        }, 0)
        this.errorFetchingData = false
      } catch (error) {
        this.totalLines = 0
        this.errorFetchingData = true
        // eslint-disable-next-line no-console
        console.error('Error fetching repository data:', error)
      }
    },

    async fetchRepositoryData(user, repo, branch) {
      try {
        const repositoryTree = await api.getRepositoryTree(user, repo, branch)

        const repositoryContents = await Promise.all(repositoryTree.map(item => api.getRepositoryContents(user, repo, item.path)))

        return { repositoryTree, repositoryContents }
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error('Error fetching repository data:', error)
        throw error
      }
    },

    // Utility function to safely decode Base64
    safeBase64Decode(content) {
      try {
        return atob(content)
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error('Error decoding Base64 content:', error)
        return null
      }
    },
    // Utility function to decode Base64 content with newline handling
    decodeBase64Content(content) {
      try {
        // Split by newline characters, decode each line, and join them back
        return content
          .split('\n')
          .map(line => this.safeBase64Decode(line))
          .join('\n')
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error('Error decoding Base64 content with newline handling:', error)
        return null
      }
    }
  }
}
</script>

<style scoped>
@import '../assets/base.css';

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

.error-bad-request h2 {
  color: var(--color-dark-subtle);
  margin: 1rem;
  font-size: 1.125rem;
  font-weight: 500;
  line-height: 1.75rem;
  text-align: center;
}

.dark .error-bad-request h2 {
  color: var(--color-light-accent-2);
}

.result-list {
  max-height: 36rem;
  margin-top: 0.5rem;
  text-align: center;
  border: 2px solid var(--color-light-subtle);
  border-radius: 0.375rem;
  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
  overflow-y: auto;
}

.dark .result-list {
  border: 2px solid var(--color-border-dark-normal);
  color: var(--color-light-subtle);
}
</style>

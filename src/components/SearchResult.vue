<template>
  <div>
    <h1 class="title">GitHub Repository Lines of Code Calculator</h1>

    <div class="container">
      <div class="message" v-if="errorFetchingData">
        <h2>No results. Please enter a valid search query.</h2>
      </div>
      <div v-else>
        <div v-if="totalLines" class="result-list">
          <!-- Display results -->
          <table class="result-table">
            <thead>
              <tr>
                <th>Files</th>
                <th>Comments</th>
                <th>Blanks</th>
                <th>Lines of Code</th>
                <th>Total Lines</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>{{ totalFiles }}</td>
                <td>{{ totalComments }}</td>
                <td>{{ totalBlanks }}</td>
                <td>{{ totalLinesOfCode }}</td>
                <td>{{ totalLines }}</td>
              </tr>
            </tbody>
          </table>
          <!-- Display meme type icons -->
          <div class="file-icons-container">
            <div class="file-icons-list" v-for="fileIcon in fileIcons" :key="fileIcon.extension">
              <img class="file-icon" :src="fileIcon.icon.src" :alt="`${fileIcon.extension}_icon`" />
              <span class="file-extension">{{ linesByFileExtension[fileIcon.extension] }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { useDark } from '@vueuse/core'
import { Base64 } from 'js-base64'
import { FileIcon } from '@aslamhus/fileicon'
import { api } from '@/api'
import { detectComments } from '@/utils/commentDetection'
import { shouldIgnoreFile } from '@/utils/definitions/ignoreFiles'
import { ignoreCommentsExtensions } from '@/utils/definitions/ignoreCommentsExtensions'

export default {
  setup() {
    const isDark = useDark()
    return { isDark }
  },
  data() {
    return {
      user: null,
      repo: null,
      branch: null,
      filePaths: [],
      filesContent: [],
      linesByFileExtension: {},
      fileIcons: [],
      totalFiles: 0,
      totalComments: 0,
      totalBlanks: 0,
      totalLinesOfCode: 0,
      totalLines: 0,
      repositoryLanguages: {},
      errorFetchingData: false
    }
  },
  created() {
    this.user = this.$route.params.user
    this.repo = this.$route.params.repo
    this.branch = this.$route.query.branch

    if (this.branch) {
      // If the user provides a branch
      this.processRepositoryData(this.user, this.repo, this.branch)
    } else {
      // Get 'default_branch' from GitHub API
      this.getARepositoryInfo(this.user, this.repo)
    }
  },
  watch: {
    isDark() {
      this.updateFileIconsColors(this.linesByFileExtension)
    }
  },
  computed: {
    currentColors() {
      if (this.isDark) {
        return {
          bg: 'transparent',
          iconBg: '#a8a29e',
          text: '#ffffff'
        }
      }
      return {
        bg: 'transparent',
        iconBg: '#6b7280',
        text: '#181a1b'
      }
    }
  },
  methods: {
    async getARepositoryInfo(user, repo) {
      try {
        const repoInfo = await api.fetchARepository(user, repo)

        this.branch = repoInfo.default_branch

        // Fetch Tree and Content
        this.processRepositoryData(user, repo, this.branch)
      } catch (error) {
        this.totalLines = 0
        this.errorFetchingData = true
        // eslint-disable-next-line no-console
        console.error('Error fetching a repository information:', error)
      }
    },

    async processRepositoryData(user, repo, branch) {
      try {
        const { repositoryTree, repositoryContent, repositoryLanguages } = await this.getRepositoryTreeAndContent(user, repo, branch)

        // We are not using filePaths at the moment
        // Extract file paths
        // item.type === 'blob' for file
        // item.type === 'tree' for directory
        this.filePaths = repositoryTree
          .filter(item => item.type === 'blob') // Only include blobs (files), not trees (directories)
          .map(item => item.path)

        // Extract repository file path, name and content
        this.filesContent = repositoryContent
          .filter(item => !item.length) // Only include files, not directories
          .map(item => ({
            fileName: item.path,
            fileContent: this.decodeBase64Content(item.content)
          }))

        // Initialize an object to store lines based on file extensions
        const linesByFileExtension = {}

        // // Calculate total number of lines
        // this.totalLines = this.filesContent.reduce((total, file) => {
        //   // Check if fileContent is not null before splitting lines
        //   return total + (file.fileContent ? file.fileContent.split('\n').length : 0)
        // }, 0)

        // Calculate total number of lines and create lines by file extension object
        this.filesContent.forEach(file => {
          const fileName = file.fileName
          const extension = fileName.split('.').pop()

          // Check if the filename should be ignored
          if (shouldIgnoreFile(fileName)) {
            return // Skip processing this file
          }

          const lines = file.fileContent ? file.fileContent.split('\n') : []

          // Update lines by file extension
          linesByFileExtension[extension] = (linesByFileExtension[extension] || 0) + lines.length

          // Update total files
          this.totalFiles = this.totalFiles + 1

          // Detect comments and update total comments
          // Check if the extension is in the list for excluding comments
          if (!ignoreCommentsExtensions.includes(extension)) {
            const comments = detectComments(file.fileContent, extension)
            this.totalComments += comments.length
          }

          // Update total blanks (newlines)
          this.totalBlanks += lines.filter(line => line.trim() === '').length

          // Update total lines
          this.totalLines += lines.length
        })

        this.totalLinesOfCode = this.totalLines - (this.totalComments + this.totalBlanks)

        // Store lines by extension in your component's data
        this.linesByFileExtension = linesByFileExtension

        // Create array of icons for each file extension
        this.updateFileIconsColors(linesByFileExtension)

        this.repositoryLanguages = repositoryLanguages

        this.errorFetchingData = false
      } catch (error) {
        this.totalLines = 0
        this.errorFetchingData = true
        // eslint-disable-next-line no-console
        console.error('Error fetching repository tree and content:', error)
      }
    },

    updateFileIconsColors(linesByFileExtension) {
      // Clear fileIcons before updating
      this.fileIcons = []
      const fileIcon = new FileIcon({ colors: this.currentColors })
      for (const extension in linesByFileExtension) {
        if (Object.prototype.hasOwnProperty.call(linesByFileExtension, extension)) {
          // Create icon for each file extension
          fileIcon.create(extension).then(icon => {
            // Store the icon in the fileIcons array
            this.fileIcons.push({ extension, icon })
          })
        }
      }
    },

    async getRepositoryTreeAndContent(user, repo, branch) {
      try {
        const repositoryTree = await api.fetchRepositoryTree(user, repo, branch)

        const repositoryContent = await Promise.all(repositoryTree.map(item => api.fetchRepositoryContent(user, repo, item.path)))

        const repositoryLanguages = await api.fetchRepositoryLanguages(user, repo)

        return { repositoryTree, repositoryContent, repositoryLanguages }
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error('Error fetching repository tree and content:', error)
        throw error
      }
    },

    // Utility function to decode Base64 content with newline handling
    decodeBase64Content(content) {
      try {
        // Split by newline characters, decode each line, and join them back
        // return content
        //   .split('\n')
        //   .map(line => this.safeBase64Decode(line))
        //   .join('\n')
        return Base64.decode(content)
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error('Error decoding Base64 content with newline handling:', error)
        return null
      }
    }

    // Utility function to safely decode Base64
    // safeBase64Decode(line) {
    //   try {
    //     return atob(line)
    //   } catch (error) {
    //     // eslint-disable-next-line no-console
    //     console.error('Error decoding Base64 content:', error)
    //     return null
    //   }
    // }
  }
}
</script>

<style scoped>
@import '../assets/base.css';
@import '../assets/layout.css';

.message h2 {
  color: var(--color-dark-subtle);
  margin: 1rem;
  font-size: 1.125rem;
  font-weight: 500;
  line-height: 1.75rem;
  text-align: center;
}

.dark .message h2 {
  color: var(--color-light-accent-2);
}

.result-list {
  /* max-height: 36rem; */
  margin-top: 0.5rem;
  text-align: center;
  border: 2px solid var(--color-light-subtle);
  border-radius: 0.375rem;
  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
  /* overflow-y: auto; */
}

.dark .result-list {
  border: 2px solid var(--color-border-dark-normal);
  color: var(--color-light-subtle);
}

.result-table {
  display: table;
  margin: 0 auto;
  padding: 0 0 1em 0;
  width: 100%;
  text-align: left;
  overflow: hidden;
}

.result-table th {
  font-weight: bold;
  font-size: 1em;
  line-height: 1em;
  background-color: var(--color-dark-subtle);
  color: var(--color-light-subtle);
}

.dark .result-table th {
  background-color: var(--color-light-subtle);
  color: var(--color-dark-subtle);
}

.result-table th,
.result-table td {
  padding: 2% 0 2% 2%;
}

.result-table tr {
  background-color: var(--color-light-subtle);
}

.dark .result-table tr {
  background-color: var(--color-dark-subtle);
}

.result-table td:last-child {
  color: var(--color-pink);
}

.file-icons-container {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-around;
  gap: 1em;
  padding: 1em;
}

.file-icons-list {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.file-icon {
  height: 100px;
  object-fit: contain;
}

.file-extension {
  font-size: 14px;
  font-weight: 500;
}
</style>

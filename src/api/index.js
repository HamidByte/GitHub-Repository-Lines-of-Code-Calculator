import axios from 'axios'
const accessToken = import.meta.env.VITE_GITHUB_ACCESS_TOKEN

export const api = {
  async fetchAUser(user) {
    try {
      const response = await axios.get(`https://api.github.com/users/${user}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      })

      return response.data
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Error fetching a user:', error)
      throw error
    }
  },

  async fetchUserPublicRepositories(user) {
    try {
      const response = await axios.get(`https://api.github.com/users/${user}/repos?sort=updated_at`, {
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      })

      return response.data
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Error fetching repositories of a user:', error)
      throw error
    }
  },

  async fetchARepository(user, repo) {
    try {
      const response = await axios.get(`https://api.github.com/repos/${user}/${repo}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      })

      return response.data
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Error fetching a repository:', error)
      throw error
    }
  },

  async fetchRepositoryContent(user, repo, path) {
    try {
      const response = await axios.get(`https://api.github.com/repos/${user}/${repo}/contents/${path}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      })

      return response.data
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Error fetching repository content:', error)
      throw error
    }
  },

  async fetchRepositoryTree(user, repo, branch) {
    try {
      const response = await axios.get(`https://api.github.com/repos/${user}/${repo}/git/trees/${branch}?recursive=1`, {
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      })

      return response.data.tree
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Error fetching a repository tree:', error)
      throw error
    }
  },

  async fetchRepositoryLanguages(user, repo) {
    try {
      const response = await axios.get(`https://api.github.com/repos/${user}/${repo}/languages`, {
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      })

      return response.data
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Error fetching a repository languages:', error)
      throw error
    }
  }
}

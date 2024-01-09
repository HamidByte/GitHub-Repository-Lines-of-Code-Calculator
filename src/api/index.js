import axios from 'axios'
const accessToken = import.meta.env.VITE_GITHUB_ACCESS_TOKEN

export const api = {
  async getRepositoryInformation(user, repo) {
    try {
      const response = await axios.get(`https://api.github.com/repos/${user}/${repo}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      })

      return response.data
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Error fetching repository:', error)
      throw error
    }
  },

  async getRepositoryTree(user, repo, branch) {
    try {
      const response = await axios.get(`https://api.github.com/repos/${user}/${repo}/git/trees/${branch}?recursive=1`, {
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      })

      return response.data.tree
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Error fetching repository tree:', error)
      throw error
    }
  },

  async getRepositoryContents(user, repo, path) {
    try {
      const response = await axios.get(`https://api.github.com/repos/${user}/${repo}/contents/${path}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      })

      return response.data
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Error fetching repository contents:', error)
      throw error
    }
  }
}
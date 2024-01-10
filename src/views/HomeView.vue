<template>
  <div>
    <h1 class="title">GitHub Repository Line of Code Calculator</h1>

    <div class="container">
      <h2 class="search-text">Count lines of code in a GitHub repository</h2>
      <div class="search-box">
        <input class="input-box" v-model="searchQuery" @input="handleInput" @keyup.enter="search" @focus="isFocused = true" @blur="isFocused = false" @mouseenter="isHovered = true" @mouseleave="isHovered = false" placeholder="user or user/repo" autofocus />
        <div class="search-icon">
          <IconSearch @click="search" :color="getColors()" />
        </div>
      </div>

      <!-- Display repositories in dropdown -->
      <div v-if="showDropdown" class="dropdown">
        <ul>
          <li v-for="repo in repositories" :key="repo.id" @click="selectRepository(repo)">
            {{ repo.full_name }}
          </li>
        </ul>
      </div>

      <div class="invalid-search" v-if="isInvalid">
        <h2>{{ invalidMessage }}</h2>
      </div>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useDark } from '@vueuse/core'
import { api } from '@/api'
import IconSearch from '@/components/icons/IconSearch.vue'

export default {
  components: {
    IconSearch
  },
  setup() {
    const router = useRouter()
    const isFocused = ref(false)
    const isHovered = ref(false)

    const isDark = useDark()
    return { router, isDark, isFocused, isHovered }
  },
  data() {
    return {
      searchQuery: null,
      showDropdown: false,
      invalidMessage: 'Invalid search query format. Please enter a valid "user/repo" format.',
      isInvalid: false,
      repositories: [],
      colors: {
        light: 'var(--color-dark-muted)',
        dark: 'var(--color-light-muted)',
        lightHovered: 'var(--color-border-light-active)',
        darkHovered: 'var(--color-border-dark-active-2)'
      }
    }
  },
  methods: {
    async search() {
      try {
        if (this.searchQuery) {
          const parts = this.searchQuery.split('/')

          if (parts.length === 2) {
            // Owner and repo are provided
            const [owner, repo] = parts
            this.isInvalid = false

            // Fetch repository information to get the default branch
            const repositoryInfo = await api.getRepositoryInformation(owner, repo)

            // Use the Vuex store to set the searchQuery
            this.$store.commit('setSearchQuery', this.searchQuery)

            // Clear the dropdown and show only the selected repository
            this.repositories = [repositoryInfo]
            this.showDropdown = true
          } else {
            // Only owner is provided, fetch all repositories
            this.repositories = await api.getAllPublicRepositories(this.searchQuery)
            this.showDropdown = true
          }
        } else {
          // Clear the dropdown if the search query is empty
          this.repositories = []
          this.showDropdown = false
        }
      } catch (error) {
        this.isInvalid = true
        // eslint-disable-next-line no-console
        console.error('Error fetching repositories:', error)
      }
    },

    selectRepository(repo) {
      // Use the router to navigate to the selected repository
      this.router.push({
        name: 'SearchResult',
        params: { user: repo.owner.login, repo: repo.name },
        query: { branch: repo.default_branch }
      })
    },

    handleInput() {
      // Hide dropdown on input change
      this.showDropdown = false
    },

    getColors() {
      if (this.isDark) {
        return this.isHovered || this.isFocused ? this.colors.darkHovered : this.colors.dark
      } else {
        return this.isHovered || this.isFocused ? this.colors.lightHovered : this.colors.light
      }
    }
  }
}
</script>

<style scoped>
@import '../assets/base.css';
@import '../assets/layout.css';

.dropdown {
  flex-grow: 1;
  background-color: var(--color-light-normal);
  pointer-events: auto;
}

.dark .dropdown {
  background-color: var(--color-dark-normal);
}

.dropdown ul {
  list-style: none;
  margin: 0;
  padding: 0;
  border-radius: 0.375rem;
  max-height: 300px; /* Set a maximum height for the dropdown */
  overflow-y: auto; /* Enable vertical scrolling if the content exceeds the height */
  opacity: 1;
  box-shadow: var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow, 0 0 #0000), var(--tw-shadow);
  --tw-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
  --tw-shadow-colored: 0 1px 2px 0 var(--tw-shadow-color);
}

.dropdown ul li {
  display: block;
  position: relative;
  padding: 0.75rem 1.5rem;
  cursor: pointer;
  border: 1px solid var(--color-border-light-normal);
  --tw-divide-y-reverse: 0;
  border-top-width: calc(1px * calc(1 - var(--tw-divide-y-reverse)));
  border-bottom-width: calc(1px * var(--tw-divide-y-reverse));
  -webkit-user-select: none;
  -moz-user-select: none;
  user-select: none;
}

.dark .dropdown ul li {
  color: var(--color-light-subtle);
  border: 1px solid var(--color-border-dark-normal);
  --tw-divide-y-reverse: 0;
  border-top-width: calc(1px * calc(1 - var(--tw-divide-y-reverse)));
  border-bottom-width: calc(1px * var(--tw-divide-y-reverse));
}

.dropdown ul li:hover {
  background-color: var(--color-select-active);
}

.dark .dropdown ul li:hover {
  background-color: var(--color-dark-accent);
}

.search-text {
  color: var(--color-dark-subtle);
  font-size: 1.125rem;
  line-height: 1.75rem;
  margin-bottom: 1rem;
  text-align: center;
}

.dark .search-text {
  color: var(--color-light-accent-2);
}

.search-box {
  position: relative;
}

.input-box {
  border: 2px solid var(--color-border-light-normal);
  /* background-color: var(--color-light-normal); */
  color: var(--color-dark-normal);
  border-radius: 0.375rem;
  padding: 0.75rem;
  width: 100%;
  font-weight: 300;
  font-size: 1.5rem;
  line-height: 2rem;
  text-align: center;
  outline: none;
  appearance: none;
}

.input-box::placeholder {
  color: var(--color-dark-muted);
}

.input-box::-ms-input-placeholder {
  /* Edge 12-18 */
  color: var(--color-daek-muted);
}

.input-box:hover,
.input-box:focus {
  border: 2px solid var(--color-border-light-active);
}

.dark .input-box {
  border: 2px solid var(--color-border-dark-normal);
  background-color: var(--color-dark-normal);
  color: var(--color-light-normal);
}

.dark .input-box::placeholder {
  color: var(--color-light-muted);
}

.dark .input-box::-ms-input-placeholder {
  /* Edge 12-18 */
  color: var(--color-light-muted);
}

.dark .input-box:hover,
.dark .input-box:focus {
  border: 2px solid var(--color-border-dark-active-2);
}

.search-icon {
  position: absolute;
  top: 0;
  bottom: 0;
  right: 0.5rem;
  margin: auto;
  width: 2rem;
  height: 2rem;
}

.invalid-search h2 {
  color: var(--color-dark-subtle);
  margin: 1rem;
  font-size: 1rem;
  font-weight: 400;
  line-height: 1.75rem;
  text-align: center;
}

.dark .invalid-search h2 {
  color: var(--color-light-accent-2);
}
</style>

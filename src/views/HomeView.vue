<template>
  <div class="main">
    <h1 class="title">GitHub Repository Line of Code Calculator</h1>

    <div class="container">
      <h2 class="search-text">Count lines of code in a GitHub repository</h2>
      <div class="search-box">
        <input class="input-box" v-model="searchQuery" @keyup.enter="search" @mouseenter="isHovered = true" @mouseleave="isHovered = false" placeholder="user/repo" autofocus />
        <div class="search-icon">
          <IconSearch @click="search" :color="isDark ? (isHovered ? colors.darkHovered : colors.dark) : isHovered ? colors.lightHovered : colors.light" />
        </div>
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
import IconSearch from '@/components/icons/IconSearch.vue'

export default {
  components: {
    IconSearch
  },
  setup() {
    const router = useRouter()
    const isHovered = ref(false)

    const isDark = useDark()
    return { router, isDark, isHovered }
  },
  data() {
    return {
      searchQuery: null,
      invalidMessage: 'Invalid search query format. Please enter a valid "user/repo" format.',
      isInvalid: false,
      colors: {
        light: 'var(--color-dark-muted)',
        dark: 'var(--color-light-muted)',
        lightHovered: 'var(--color-border-light-active)',
        darkHovered: 'var(--color-border-dark-active-2)'
      }
    }
  },
  methods: {
    search() {
      const parts = this.searchQuery.split('/')

      if (parts.length === 2) {
        const [owner, repo] = parts
        this.isInvalid = false

        // Use the Vuex store to set the searchQuery
        this.$store.commit('setSearchQuery', this.searchQuery)

        // Use the router to navigate to the search result page with the appropriate route
        this.router.push({
          name: 'SearchResult',
          params: { user: owner, repo: repo },
          query: { branch: 'master' } // You can set the default branch here
        })
      } else {
        this.isInvalid = true
      }
    }
  }
}
</script>

<style scoped>
@import '../assets/base.css';
@import '../assets/layout.css';

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

.input-box:hover {
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

.dark .input-box:hover {
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

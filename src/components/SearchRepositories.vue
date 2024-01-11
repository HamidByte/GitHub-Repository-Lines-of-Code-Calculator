<template>
  <div>
    <h1 class="title">GitHub Repository Lines of Code Calculator</h1>

    <div class="container">
      <h2 class="search-text">Discover all public repositories for a GitHub user</h2>
      <div class="search-box">
        <input class="input-box" v-model="searchQuery" @keyup.enter="search" @focus="isFocused = true" @blur="isFocused = false" @mouseenter="isHovered = true" @mouseleave="isHovered = false" placeholder="Enter username" autofocus />
        <div class="search-icon">
          <IconSearch @click="search" :color="getColors()" />
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
    const isFocused = ref(false)
    const isHovered = ref(false)

    const isDark = useDark()
    return { router, isDark, isFocused, isHovered }
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
    async search() {
      if (this.searchQuery) {
        // Use the Vuex store to set the searchQuery
        this.$store.commit('setSearchQuery', this.searchQuery)

        // Use the router to navigate to the selected repository
        this.router.push({
          name: 'UserRepositories',
          params: { user: this.searchQuery }
        })
      } else {
        this.isInvalid = true
      }
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

<template>
  <header v-if="!is404Route">
    <nav>
      <ul class="nav-container">
        <li class="nav-item">
          <RouterLink to="/" title="Home">
            <IconHome :color="isDark ? colors.lightNormal : colors.darkNormal" />
          </RouterLink>
        </li>
        <li class="nav-item">
          <RouterLink
            :to="{
              name: 'SearchResult',
              params: {
                user: $store.state.searchQuery.split('/')[0] || 'defaultUser',
                repo: $store.state.searchQuery.split('/')[1] || 'defaultRepo'
              },
              query: { branch: 'master' }
            }"
            title="Search repos"
          >
            <IconSearch :color="isDark ? colors.lightNormal : colors.darkNormal" />
          </RouterLink>
        </li>
        <li class="nav-item">
          <a href="https://github.com/mhamid49/" target="_blank" title="Project source code">
            <IconGithub :color="isDark ? colors.lightNormal : colors.darkNormal" />
          </a>
        </li>
        <li class="nav-item">
          <a href="/about" title="About">
            <IconAbout :color="isDark ? colors.lightNormal : colors.darkNormal" />
          </a>
        </li>
        <li class="nav-item">
          <button class="nav-item-dark-mode-toggle" title="Toggle dark mode" @click="toggleDark()">
            <template v-if="isDark">
              <IconSun :color="colors.lightNormal" />
            </template>
            <template v-else>
              <IconMoon :color="colors.darkNormal" />
            </template>
          </button>
        </li>
      </ul>
    </nav>
  </header>
</template>

<script setup>
import { ref, watchEffect } from 'vue'
import { RouterLink, useRouter } from 'vue-router'
import { useDark, useToggle } from '@vueuse/core'
import IconHome from '@/components/icons/IconHome.vue'
import IconSearch from '@/components/icons/IconSearch.vue'
import IconGithub from '@/components/icons/IconGithub.vue'
import IconAbout from '@/components/icons/IconAbout.vue'
import IconMoon from '@/components/icons/IconMoon.vue'
import IconSun from '@/components/icons/IconSun.vue'

const router = useRouter()
const is404Route = ref(false)

const colors = {
  lightNormal: 'var(--color-light-normal)',
  darkNormal: 'var(--color-dark-normal)'
}

const isDark = useDark({
  selector: 'body', //element to add attribute to
  attribute: 'class', // attribute name e.g. theme
  valueDark: 'dark', // attribute value for dark mode
  valueLight: 'light' // attribute value for light mode
})

const toggleDark = useToggle(isDark)

watchEffect(() => {
  // Check if the current route is the "PageNotFound" route
  is404Route.value = router.currentRoute.value.name === 'PageNotFound'
})
</script>

<style scoped>
@import '../assets/base.css';

nav {
  margin: 0 auto;
  /* width: 20rem;
  padding-bottom: 0.5em;
  border-bottom: 1px solid var(--color-light-subtle); */
}

.nav-container {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 0.5rem; /* Adjust the spacing as needed */
  list-style-type: none;
  margin: 0;
  padding: 0;
}

.nav-item {
  width: 50px;
  height: 50px;
  padding: 0.8em;
  border-radius: 0.375rem; /* Equivalent to rounded-md */
  transition: background-color 0.1s;
  cursor: pointer;
}

.nav-item:hover {
  transform: scale(1.2);
  background-color: var(--color-light-accent);
}

.dark .nav-item:hover {
  background-color: var(--color-dark-accent);
}

.nav-item-dark-mode-toggle {
  width: 100%;
  height: 100%;
  padding: 0;
  border: none;
  background: none;
  cursor: pointer;
}
</style>

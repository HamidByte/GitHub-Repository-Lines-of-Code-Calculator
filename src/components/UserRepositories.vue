<template>
  <div class="container">
    <div class="message" v-if="errorFetchingData">
      <h2>Invalid user or user not found. Please check the username and try again.</h2>
    </div>
    <div v-else>
      <div v-if="loading">
        <!-- Loading indicator -->
        <p>Loading...</p>
      </div>
      <div v-else-if="repositories.length">
        <div class="user-info">
          <h1 style="font-size: 1.5rem; line-height: 2rem">
            <a class="user-link" :href="owner.html_url" target="_blank">
              <div class="user-avatar">
                <img class="user-avatar-cover" :src="`${owner.html_url}.png?size=64`" alt="avatar" />
              </div>
              <span>{{ owner.login }}</span>
            </a>
          </h1>
        </div>
        <h2 style="font-weight: 600; font-size: 1.125rem; line-height: 1.75rem; margin-bottom: 0.5rem">Repositories</h2>
        <div class="repos">
          <div class="repo-list">
            <a v-for="repo in repositories" :key="repo.id" class="repo-item" :href="`/${repo.owner.login}/${repo.name}?branch=${repo.default_branch}`" target="_blank">
              <div class="repo-item-title">{{ repo.name }}</div>
              <div class="repo-item-description">{{ shortDescription(repo.description) }}</div>
              <!-- Separator -->
              <div style="flex-grow: 1"></div>
              <div class="repo-item-updated-at">Updated at: {{ formatRelativeTime(repo.updated_at) }}</div>
              <div class="repo-item-footer">
                <div class="repo-item-languae">{{ repo.language }}</div>
                <div class="repo-item-details">
                  <div class="repo-item-watchers">
                    <IconWatcher :color="isDark ? colors.lightNormal : colors.darkNormal" />
                    <span>{{ repo.watchers_count }}</span>
                  </div>
                  <div class="repo-item-stars">
                    <IconStar :color="isDark ? colors.lightNormal : colors.darkNormal" />
                    <span>{{ repo.stargazers_count }}</span>
                  </div>
                  <div class="repo-item-forks">
                    <IconFork :color="isDark ? colors.lightNormal : colors.darkNormal" />
                    <span>{{ repo.forks_count }}</span>
                  </div>
                </div>
              </div>
            </a>
          </div>
        </div>
      </div>
      <div class="message" v-else>
        <h2>No public repositories available.</h2>
      </div>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useDark } from '@vueuse/core'
import moment from 'moment'
import { api } from '@/api'
import IconWatcher from '@/components/icons/IconWatcher.vue'
import IconStar from '@/components/icons/IconStar.vue'
import IconFork from '@/components/icons/IconFork.vue'

const MAX_LENGTH = 120

export default {
  components: {
    IconWatcher,
    IconStar,
    IconFork
  },
  setup() {
    const router = useRouter()
    const loading = ref(true)

    const isDark = useDark()
    return { router, isDark, loading }
  },
  data() {
    return {
      user: null,
      owner: null,
      repositories: [],
      errorFetchingData: false,
      colors: {
        lightNormal: 'var(--color-light-subtle)',
        darkNormal: 'var(--color-dark-normal)'
      }
    }
  },
  created() {
    this.user = this.$route.params.user

    this.getOwnerInfo(this.user)
    this.getRepositories(this.user)
  },
  methods: {
    async getOwnerInfo(user) {
      try {
        this.owner = await api.getOwnerInformation(user)

        this.errorFetchingData = false
        this.loading = false
      } catch (error) {
        this.errorFetchingData = true
        this.loading = false
        // eslint-disable-next-line no-console
        console.error('Error fetching owner info:', error)
      }
    },

    async getRepositories(user) {
      try {
        this.repositories = await api.getAllPublicRepositories(user)

        // Sort repositories by the updated_at property in descending order
        this.repositories.sort((a, b) => new Date(b.updated_at) - new Date(a.updated_at))

        this.errorFetchingData = false
        this.loading = false
      } catch (error) {
        this.errorFetchingData = true
        this.loading = false
        // eslint-disable-next-line no-console
        console.error('Error fetching repository data:', error)
      }
    },

    shortDescription(description) {
      if (!description) {
        // If description is null or undefined, return an empty string or handle it accordingly
        return ''
      }

      if (description.length > MAX_LENGTH) {
        // // If the description exceeds the maxLength, truncate and add ellipsis
        // return `${description.substring(0, MAX_LENGTH)}...`

        // Find the last space within the maxLength
        const lastSpaceIndex = description.lastIndexOf(' ', MAX_LENGTH)

        if (lastSpaceIndex !== -1) {
          // Truncate at the last space
          return `${description.substring(0, lastSpaceIndex)}...`
        } else {
          // If no space found, truncate at the specified maxLength
          return `${description.substring(0, MAX_LENGTH)}...`
        }
      }

      // If the description is within the maxLength, display as is
      return description
    },

    formatRelativeTime(time) {
      // Assuming time is a string in ISO format (e.g., "2022-01-06T12:34:56Z")
      const updatedTime = moment(time)

      // Use moment().fromNow() to get the relative time
      return `Updated ${updatedTime.fromNow()}`
    }
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

.user-info {
  display: flex;
  align-items: center;
  margin-bottom: 1.25rem;
}

.user-link {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: inherit;
  text-decoration: inherit;
}

.user-link:hover {
  text-decoration: underline;
}

.user-avatar {
  width: 2.5rem;
  height: 2.5rem;
  border: 2px solid var(--color-border-light-normal);
  border-radius: 9999px;
  overflow: hidden;
}

.dark .user-avatar {
  border-color: var(--color-border-dark-normal);
}

.user-avatar-cover {
  object-fit: cover;
  max-width: 100%;
  height: auto;
}

.repos {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.repo-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(12rem, 1fr));
  gap: 1rem;
  word-wrap: break-word;
  padding: 0;
}

.repo-item {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  min-height: 8rem;
  padding-top: 0.5rem;
  padding-bottom: 0.5rem;
  padding-left: 1rem;
  padding-right: 1rem;
  border: 1px solid var(--color-border-light-normal);
  border-radius: 0.375rem;
  color: inherit;
  text-decoration: inherit;
}

.repo-item:hover {
  border: 1px solid var(--color-border-light-active);
}

.dark .repo-item {
  border: 1px solid var(--color-border-dark-normal);
}

.dark .repo-item:hover {
  border: 1px solid var(--color-border-dark-active);
}

.repo-item-title {
  display: flex;
  gap: 0.5rem;
  word-break: break-all;
  font-weight: 500;
}

.dark .repo-item-title {
  color: var(--color-light-subtle);
}

.repo-item-description {
  color: var(--color-dark-muted);
  font-size: 0.875rem;
  line-height: 1.25rem;
  margin-bottom: 0.25rem;
}

.dark .repo-item-description {
  color: var(--color-light-muted);
}

.repo-item-updated-at {
  color: var(--color-dark-normal);
  font-size: 0.75rem;
  line-height: 1rem;
}

.dark .repo-item-updated-at {
  color: var(--color-light-subtle);
}

.repo-item-footer {
  color: var(--color-dark-normal);
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.875rem;
  line-height: 1.25rem;
}

.dark .repo-item-footer {
  color: var(--color-light-subtle);
}

.repo-item-languae {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.repo-item-details {
  display: flex;
  flex-shrink: 0;
  gap: 0.5rem;
  margin-left: auto;
  color: var(--color-dark-normal);
}

.dark .repo-item-details {
  color: var(--color-light-subtle);
}

.repo-item-watchers,
.repo-item-stars,
.repo-item-forks {
  display: flex;
  align-items: center;
  gap: 0.25rem;
}
</style>

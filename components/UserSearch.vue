<template>
  <div>
    <input 
      v-model="searchQuery"
      type="text" 
      placeholder="Search users by name or email..."
      @input="handleSearch"
      style="width: 100%; padding: 8px; margin: 10px 0; border: 1px solid #ccc; border-radius: 4px;"
    />
  </div>
</template>

<script setup lang="ts">
import { useUsersStore } from '../store/users'
import { ref } from 'vue'

const usersStore = useUsersStore()

const searchQuery = ref('')

const handleSearch = () => {
  usersStore.setSearchQuery(searchQuery.value)
}
</script>
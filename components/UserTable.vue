<!-- components/UserTable.vue -->
<template>
  <div>
    <div>
      <button @click="openAddForm">Add User</button>
    </div>
    
    <UserSearch />
    
    <div v-if="usersStore.loading">Loading...</div>
    
    <table v-else>
      <thead>
        <tr>
          <th @click="sort('id')">
            ID {{ getSortIcon('id') }}
          </th>
          <th @click="sort('firstName')">
            First Name {{ getSortIcon('firstName') }}
          </th>
          <th @click="sort('lastName')">
            Last Name {{ getSortIcon('lastName') }}
          </th>
          <th @click="sort('email')">
            Email {{ getSortIcon('email') }}
          </th>
          <th @click="sort('lastVisitedAt')">
            Last Visit {{ getSortIcon('lastVisitedAt') }}
          </th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="user in usersStore.paginatedUsers" :key="user.id">
          <td>{{ user.id }}</td>
          <td>{{ user.firstName }}</td>
          <td>{{ user.lastName }}</td>
          <td>{{ user.email }}</td>
          <td>{{ formatDate(user.lastVisitedAt) }}</td>
          <td>
            <button @click="editUser(user)">Edit</button>
            <button @click="deleteUser(user.id)">Delete</button>
          </td>
        </tr>
      </tbody>
    </table>
    
    <div v-if="usersStore.totalPages > 1">
      <button 
        v-for="page in usersStore.totalPages" 
        :key="page"
        @click="usersStore.setPage(page)"
        :disabled="page === usersStore.currentPage"
      >
        {{ page }}
      </button>
    </div>
    
    <UserForm 
      :is-open="showForm" 
      :user="selectedUser" 
      @close="closeForm" 
    />

  </div>
</template>

<script setup lang="ts">
import type { User } from '../types/user'
import { useUsersStore } from '../store/users'
import { onMounted, ref } from 'vue'
import UserForm from './UserForm.vue'
import UserSearch from './UserSearch.vue'

const usersStore = useUsersStore()

const showForm = ref(false)
const selectedUser = ref<User | null>(null)

onMounted(() => {
  usersStore.loadUsers()
})

const openAddForm = () => {
  console.log('Opening add form')
  selectedUser.value = null
  showForm.value = true
}

const editUser = (user: User) => {
  selectedUser.value = { ...user }
  showForm.value = true
}

const deleteUser = (id: number) => {
  if (confirm('Are you sure you want to delete this user?')) {
    usersStore.deleteUser(id)
  }
}

const closeForm = () => {
  showForm.value = false
  selectedUser.value = null
}

const sort = (field: keyof User) => {
  const currentOrder = usersStore.sortField === field && usersStore.sortOrder === 'asc' ? 'desc' : 'asc'
  usersStore.setSorting(field, currentOrder)
}

const getSortIcon = (field: keyof User) => {
  if (usersStore.sortField !== field) return ''
  return usersStore.sortOrder === 'asc' ? '↑' : '↓'
}

const formatDate = (timestamp: number) => {
  return new Date(timestamp * 1000).toLocaleDateString()
}
</script>
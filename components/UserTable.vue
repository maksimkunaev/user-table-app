<template>
  <div class="user-table-container">
    <div class="header-section">
      <h2 class="table-title">Users Management</h2>
      <button @click="openAddForm" class="btn btn-primary">
        <span class="btn-icon">+</span>
        Add User
      </button>
    </div>
    
    <UserSearch />
    
    <div v-if="usersStore.loading" class="loading">
      <div class="loading-spinner"></div>
      <span>Loading users...</span>
    </div>
    
    <div v-else class="table-wrapper">
      <table class="users-table">
        <thead>
          <tr>
            <th @click="sort('id')" class="sortable">
              ID <span class="sort-icon">{{ getSortIcon('id') }}</span>
            </th>
            <th @click="sort('firstName')" class="sortable">
              First Name <span class="sort-icon">{{ getSortIcon('firstName') }}</span>
            </th>
            <th @click="sort('lastName')" class="sortable">
              Last Name <span class="sort-icon">{{ getSortIcon('lastName') }}</span>
            </th>
            <th @click="sort('email')" class="sortable">
              Email <span class="sort-icon">{{ getSortIcon('email') }}</span>
            </th>
            <th @click="sort('lastVisitedAt')" class="sortable">
              Last Visit <span class="sort-icon">{{ getSortIcon('lastVisitedAt') }}</span>
            </th>
            <th class="actions-header">Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="user in usersStore.paginatedUsers" :key="user.id" class="user-row">
            <td class="user-id">{{ user.id }}</td>
            <td>{{ user.firstName }}</td>
            <td>{{ user.lastName }}</td>
            <td class="user-email">{{ user.email }}</td>
            <td class="user-date">{{ formatDate(user.lastVisitedAt) }}</td>
            <td class="actions-cell">
              <button @click="editUser(user)" class="btn btn-secondary btn-sm">
                Edit
              </button>
              <button @click="deleteUser(user.id)" class="btn btn-danger btn-sm">
                Delete
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    
    <!-- Pagination -->
    <div v-if="usersStore.totalPages > 1" class="pagination-wrapper">
      <div class="pagination-info">
        Showing {{ ((usersStore.currentPage - 1) * usersStore.itemsPerPage) + 1 }} 
        to {{ Math.min(usersStore.currentPage * usersStore.itemsPerPage, usersStore.filteredUsers.length) }} 
        of {{ usersStore.filteredUsers.length }} users
      </div>
      <div class="pagination">
        <button 
          v-for="page in usersStore.totalPages" 
          :key="page"
          @click="usersStore.setPage(page)"
          :class="['pagination-btn', { 'active': page === usersStore.currentPage }]"
          :disabled="page === usersStore.currentPage"
        >
          {{ page }}
        </button>
      </div>
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

<style scoped>
.user-table-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
}

.header-section {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}

.table-title {
  font-size: 2rem;
  font-weight: 700;
  color: #1f2937;
  margin: 0;
}

.btn {
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 500;
  transition: all 0.2s ease;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  text-decoration: none;
}

.btn:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.btn:active {
  transform: translateY(0);
}

.btn-primary {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 0.75rem 1.5rem;
  font-size: 1rem;
}

.btn-secondary {
  background: #f3f4f6;
  color: #374151;
  border: 1px solid #d1d5db;
  padding: 0.5rem 1rem;
}

.btn-secondary:hover {
  background: #e5e7eb;
}

.btn-danger {
  background: linear-gradient(135deg, #ef4444 0%, #be185d 100%);
  color: white;
  padding: 0.5rem 1rem;
}

.btn-danger:hover {
  background: #dc2626;
}

.btn-sm {
  font-size: 0.875rem;
  padding: 0.375rem 0.75rem;
}

.btn-icon {
  font-size: 1.2rem;
  font-weight: bold;
}

.loading {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 3rem;
  color: #6b7280;
  font-size: 1.1rem;
  gap: 1rem;
}

.loading-spinner {
  width: 20px;
  height: 20px;
  border: 2px solid #e5e7eb;
  border-top: 2px solid #667eea;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.table-wrapper {
  background: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1), 0 1px 2px rgba(0, 0, 0, 0.06);
  border: 1px solid #e5e7eb;
}

.users-table {
  width: 100%;
  border-collapse: collapse;
}

.users-table thead {
  background: linear-gradient(90deg, #f8fafc 0%, #f1f5f9 100%);
}

.users-table th {
  padding: 1rem;
  text-align: left;
  font-weight: 600;
  color: #374151;
  border-bottom: 2px solid #e5e7eb;
  position: relative;
}

.sortable {
  cursor: pointer;
  user-select: none;
}

.sortable:hover {
  background: #e2e8f0;
}

.sort-icon {
  margin-left: 0.5rem;
  color: #667eea;
  font-weight: bold;
}

.user-row {
  transition: background-color 0.15s ease;
}

.user-row:hover {
  background: #f9fafb;
}

.user-row:nth-child(even) {
  background: #fafafa;
}

.user-row:nth-child(even):hover {
  background: #f3f4f6;
}

.users-table td {
  padding: 0.875rem 1rem;
  border-bottom: 1px solid #e5e7eb;
  color: #374151;
}

.user-id {
  color: #6b7280;
  font-weight: 500;
  font-family: monospace;
}

.user-email {
  color: #1f2937;
  font-family: monospace;
  font-size: 0.9rem;
}

.user-date {
  color: #6b7280;
  font-size: 0.9rem;
}

.actions-cell {
  display: flex;
  gap: 0.5rem;
  align-items: center;
}

.actions-header {
  text-align: center;
  width: 180px;
}

.pagination-wrapper {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 1.5rem;
  padding: 1rem;
  background: #f9fafb;
  border-radius: 8px;
  border: 1px solid #e5e7eb;
}

.pagination-info {
  color: #6b7280;
  font-size: 0.9rem;
}

.pagination {
  display: flex;
  gap: 0.25rem;
}

.pagination-btn {
  padding: 0.5rem 0.75rem;
  border: 1px solid #d1d5db;
  background: white;
  color: #374151;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s ease;
  font-weight: 500;
}

.pagination-btn:hover:not(:disabled) {
  background: #f3f4f6;
  border-color: #9ca3af;
}

.pagination-btn:disabled,
.pagination-btn.active {
  background: #667eea;
  color: white;
  border-color: #667eea;
  cursor: default;
}

/* Mobile responsiveness */
@media (max-width: 768px) {
  .user-table-container {
    padding: 1rem;
  }
  
  .header-section {
    flex-direction: column;
    gap: 1rem;
    text-align: center;
  }
  
  .table-title {
    font-size: 1.5rem;
  }
  
  .table-wrapper {
    overflow-x: auto;
  }
  
  .users-table {
    min-width: 600px;
  }
  
  .pagination-wrapper {
    flex-direction: column;
    gap: 1rem;
    text-align: center;
  }
}
</style>
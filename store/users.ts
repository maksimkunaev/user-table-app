import { defineStore } from 'pinia'
import type { User } from '../types/user'

export const useUsersStore = defineStore('users', () => {
  const users = ref<User[]>([])
  const loading = ref(false)
  const searchQuery = ref('')
  const sortField = ref<keyof User>('id')
  const sortOrder = ref<'asc' | 'desc'>('asc')
  const currentPage = ref(1)
  const itemsPerPage = ref(10)

  const loadUsers = async () => {
    loading.value = true
    try {
      const data = await $fetch<User[]>('/userList.json')
      console.log('data: ', data)
      users.value = data || []
    } catch (error) {
      console.error('Failed to load users:', error)
    } finally {
      loading.value = false
    }
  }

  const addUser = (user: Omit<User, 'id'>) => {
    const newId = Math.max(...users.value.map(u => u.id), 0) + 1
    users.value.push({ ...user, id: newId })
  }

  const updateUser = (id: number, updatedUser: Partial<User>) => {
    console.log('updateUser: ', id, updatedUser)
    const index = users.value.findIndex(u => u.id === id)
    if (index !== -1) {
      users.value[index] = { ...users.value[index], ...updatedUser }
    }
  }

  const deleteUser = (id: number) => {
    users.value = users.value.filter(u => u.id !== id)
  }

  const filteredUsers = computed(() => {
    let filtered = users.value

    if (searchQuery.value) {
      const query = searchQuery.value.toLowerCase()
      filtered = filtered.filter(user => 
        user.firstName.toLowerCase().includes(query) ||
        user.lastName.toLowerCase().includes(query) ||
        user.email.toLowerCase().includes(query)
      )
    }

    filtered.sort((a, b) => {
      const aValue = a[sortField.value]
      const bValue = b[sortField.value]
      
      if (aValue < bValue) return sortOrder.value === 'asc' ? -1 : 1
      if (aValue > bValue) return sortOrder.value === 'asc' ? 1 : -1
      return 0
    })

    return filtered
  })

  const paginatedUsers = computed(() => {
    const start = (currentPage.value - 1) * itemsPerPage.value
    const end = start + itemsPerPage.value
    return filteredUsers.value.slice(start, end)
  })

  const totalPages = computed(() => 
    Math.ceil(filteredUsers.value.length / itemsPerPage.value)
  )

  const setSearchQuery = (query: string) => {
    searchQuery.value = query
    currentPage.value = 1
  }

  const setSorting = (field: keyof User, order: 'asc' | 'desc') => {
    sortField.value = field
    sortOrder.value = order
  }

  const setPage = (page: number) => {
    currentPage.value = page
  }

  return {
    users,
    loading,
    searchQuery,
    sortField,
    sortOrder,
    currentPage,
    itemsPerPage,
    filteredUsers,
    paginatedUsers,
    totalPages,
    loadUsers,
    addUser,
    updateUser,
    deleteUser,
    setSearchQuery,
    setSorting,
    setPage
  }
})
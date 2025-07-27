<template>
  <div v-if="isOpen" style="position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.5); display: flex; align-items: center; justify-content: center;">
    <div style="background: white; padding: 20px; border-radius: 8px; width: 400px;">
      <h3>{{ isEditing ? 'Edit User' : 'Add User' }}</h3>
      
      <form @submit.prevent="handleSubmit">
        <div style="margin-bottom: 15px;">
          <label style="display: block; margin-bottom: 5px;">First Name:</label>
          <input 
            v-model="form.firstName" 
            type="text" 
            required 
            style="width: 100%; padding: 8px; border: 1px solid #ccc; border-radius: 4px;"
          />
        </div>
        
        <div style="margin-bottom: 15px;">
          <label style="display: block; margin-bottom: 5px;">Last Name:</label>
          <input 
            v-model="form.lastName" 
            type="text" 
            required 
            style="width: 100%; padding: 8px; border: 1px solid #ccc; border-radius: 4px;"
          />
        </div>
        
        <div style="margin-bottom: 15px;">
          <label style="display: block; margin-bottom: 5px;">Email:</label>
          <input 
            v-model="form.email" 
            type="email" 
            required 
            style="width: 100%; padding: 8px; border: 1px solid #ccc; border-radius: 4px;"
          />
        </div>
        
        <div style="display: flex; gap: 10px; justify-content: flex-end;">
          <button type="button" @click="closeForm" style="padding: 8px 16px; border: 1px solid #ccc; background: white; border-radius: 4px; cursor: pointer;">
            Cancel
          </button>
          <button type="submit" style="padding: 8px 16px; background: #007bff; color: white; border: none; border-radius: 4px; cursor: pointer;">
            {{ isEditing ? 'Update' : 'Add' }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { User } from '../types/user'
import { useUsersStore } from '../store/users'
import { computed, reactive, watch } from 'vue'

interface Props {
  isOpen: boolean
  user?: User | null
}

const props = defineProps<Props>()
const emit = defineEmits<{
  close: []
}>()

const usersStore = useUsersStore()

const isEditing = computed(() => !!props.user)

const form = reactive({
  firstName: '',
  lastName: '',
  email: ''
})

const resetForm = () => {
  form.firstName = ''
  form.lastName = ''
  form.email = ''
}

const closeForm = () => {
  resetForm()
  emit('close')
}

const handleSubmit = () => {
  if (isEditing.value && props.user) {
    usersStore.updateUser(props.user.id, {
      firstName: form.firstName,
      lastName: form.lastName,
      email: form.email,
      lastVisitedAt: Math.floor(Date.now() / 1000)
    })
  } else {
    usersStore.addUser({
      firstName: form.firstName,
      lastName: form.lastName,
      email: form.email,
      lastVisitedAt: Math.floor(Date.now() / 1000)
    })
  }
  
  closeForm()
}

watch(() => props.user, (user) => {
  if (user) {
    form.firstName = user.firstName
    form.lastName = user.lastName
    form.email = user.email
  } else {
    resetForm()
  }
}, { immediate: true })

watch(() => props.isOpen, (isOpen) => {
  if (!isOpen) {
    resetForm()
  }
})
</script>
<template>
  <div v-if="isOpen" class="modal-overlay" @click="closeForm">
    <div class="modal-container" @click.stop>
      <div class="modal-header">
        <h3 class="modal-title">{{ isEditing ? 'Edit User' : 'Add User' }}</h3>
        <button type="button" @click="closeForm" class="close-button">
          ✕
        </button>
      </div>
      
      <form @submit.prevent="handleSubmit" class="user-form">
        <div class="form-group">
          <label class="form-label">First Name:</label>
          <input 
            v-model="form.firstName" 
            type="text" 
            required 
            class="form-input"
            placeholder="Enter first name"
          />
        </div>
        
        <div class="form-group">
          <label class="form-label">Last Name:</label>
          <input 
            v-model="form.lastName" 
            type="text" 
            required 
            class="form-input"
            placeholder="Enter last name"
          />
        </div>
        
        <div class="form-group">
          <label class="form-label">Email:</label>
          <input 
            v-model="form.email" 
            type="email" 
            required 
            class="form-input"
            placeholder="Enter email address"
          />
        </div>
        
        <div class="form-actions">
          <button type="button" @click="closeForm" class="btn btn-cancel">
            Cancel
          </button>
          <button type="submit" class="btn btn-submit">
            {{ isEditing ? 'Update User' : 'Add User' }}
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

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 1rem;
  box-sizing: border-box;
}

.modal-container {
  background: white;
  border-radius: 12px;
  width: 100%;
  max-width: 450px;
  max-height: 90vh;
  overflow: auto;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
  animation: modalSlideIn 0.3s ease-out;
}

@keyframes modalSlideIn {
  from {
    opacity: 0;
    transform: scale(0.9) translateY(-20px);
  }
  to {
    opacity: 1;
    transform: scale(1) translateY(0);
  }
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem 1.5rem 0;
}

.modal-title {
  font-size: 1.5rem;
  font-weight: 700;
  color: #1f2937;
  margin: 0;
}

.close-button {
  background: none;
  border: none;
  font-size: 1.5rem;
  color: #6b7280;
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 50%;
  width: 2.5rem;
  height: 2.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
}

.close-button:hover {
  background: #f3f4f6;
  color: #374151;
}

.user-form {
  padding: 1.5rem;
}

.form-group {
  margin-bottom: 1.5rem;
}

.form-label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 600;
  color: #374151;
  font-size: 0.9rem;
}

.form-input {
  width: 100%;
  padding: 0.75rem;
  border: 2px solid #e5e7eb;
  border-radius: 8px;
  font-size: 1rem;
  transition: all 0.2s ease;
  box-sizing: border-box;
  font-family: inherit;
}

.form-input:focus {
  outline: none;
  border-color: #667eea;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

.form-input:hover {
  border-color: #d1d5db;
}

.form-input::placeholder {
  color: #9ca3af;
}

.form-actions {
  display: flex;
  gap: 0.75rem;
  justify-content: flex-end;
  margin-top: 2rem;
  padding-top: 1rem;
  border-top: 1px solid #e5e7eb;
}

.btn {
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  font-weight: 600;
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.2s ease;
  border: none;
  min-width: 100px;
}

.btn:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.btn:active {
  transform: translateY(0);
}

.btn-cancel {
  background: #f3f4f6;
  color: #374151;
  border: 2px solid #e5e7eb;
}

.btn-cancel:hover {
  background: #e5e7eb;
  border-color: #d1d5db;
}

.btn-submit {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.btn-submit:hover {
  background: linear-gradient(135deg, #5a67d8 0%, #6b46c1 100%);
}

@media (max-width: 480px) {
  .modal-overlay {
    padding: 0.5rem;
  }
  
  .modal-container {
    max-width: 100%;
  }
  
  .modal-header {
    padding: 1rem 1rem 0;
  }
  
  .modal-title {
    font-size: 1.25rem;
  }
  
  .user-form {
    padding: 1rem;
  }
  
  .form-actions {
    flex-direction: column;
  }
  
  .btn {
    width: 100%;
  }
}

.btn:focus-visible {
  outline: 2px solid #667eea;
  outline-offset: 2px;
}

.form-input:focus-visible {
  outline: none;
}
</style>
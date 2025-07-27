<template>
  <div class="pagination" v-if="totalPages > 1">
    <div class="pagination-info">
      Показано {{ startItem }}-{{ endItem }} из {{ totalItems }}
    </div>
    
    <div class="pagination-controls">
      <button
        @click="goToPage(currentPage - 1)"
        :disabled="currentPage === 1"
        class="btn btn-page"
      >
        ‹ Назад
      </button>

      <button
        v-for="page in visiblePages"
        :key="page"
        @click="goToPage(page)"
        :class="['btn', 'btn-page', { 'btn-current': page === currentPage }]"
      >
        {{ page }}
      </button>

      <button
        @click="goToPage(currentPage + 1)"
        :disabled="currentPage === totalPages"
        class="btn btn-page"
      >
        Вперед ›
      </button>
    </div>

    <div class="items-per-page">
      <label for="itemsPerPage">На странице:</label>
      <select
        id="itemsPerPage"
        :value="itemsPerPage"
        @change="changeItemsPerPage"
        class="select"
      >
        <option value="5">5</option>
        <option value="10">10</option>
        <option value="20">20</option>
        <option value="50">50</option>
      </select>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';


interface Props {
  currentPage: number
  totalPages: number
  totalItems: number
  itemsPerPage: number
}
const props = defineProps<Props>()

const emit = defineEmits<{
  'page-change': [page: number]
  'items-per-page-change': [itemsPerPage: number]
}>()

const startItem = computed(() => {
  return (props.currentPage - 1) * props.itemsPerPage + 1
})

const endItem = computed(() => {
  return Math.min(props.currentPage * props.itemsPerPage, props.totalItems)
})

const visiblePages = computed(() => {
  const pages = []
  const maxVisible = 5
  
  let start = Math.max(1, props.currentPage - Math.floor(maxVisible / 2))
  let end = Math.min(props.totalPages, start + maxVisible - 1)
  
  if (end - start + 1 < maxVisible) {
    start = Math.max(1, end - maxVisible + 1)
  }
  
  for (let i = start; i <= end; i++) {
    pages.push(i)
  }
  
  return pages
})

const goToPage = (page: number) => {
  if (page >= 1 && page <= props.totalPages && page !== props.currentPage) {
    emit('page-change', page)
  }
}

const changeItemsPerPage = (event: Event) => {
  const target = event.target as HTMLSelectElement
  const newItemsPerPage = parseInt(target.value)
  emit('items-per-page-change', newItemsPerPage)
}
</script>

<style scoped>
.pagination {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 1rem;
  padding: 1rem;
  background-color: #f8f9fa;
  border-radius: 8px;
  flex-wrap: wrap;
  gap: 1rem;
}

.pagination-info {
  font-size: 0.875rem;
  color: #6c757d;
}

.pagination-controls {
  display: flex;
  gap: 0.25rem;
}

.btn {
  padding: 0.5rem 0.75rem;
  border: 1px solid #dee2e6;
  background-color: white;
  color: #007bff;
  cursor: pointer;
  border-radius: 4px;
  font-size: 0.875rem;
  transition: all 0.2s;
}

.btn:hover:not(:disabled) {
  background-color: #e9ecef;
}

.btn:disabled {
  color: #6c757d;
  cursor: not-allowed;
  background-color: #f8f9fa;
}

.btn-current {
  background-color: #007bff;
  color: white;
  border-color: #007bff;
}

.btn-current:hover {
  background-color: #0056b3;
}

.items-per-page {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.875rem;
}

.select {
  padding: 0.25rem 0.5rem;
  border: 1px solid #dee2e6;
  border-radius: 4px;
  font-size: 0.875rem;
}

@media (max-width: 768px) {
  .pagination {
    flex-direction: column;
    align-items: stretch;
    text-align: center;
  }
  
  .pagination-controls {
    justify-content: center;
  }
}
</style>
<template>
  <div class="overflow-x-auto">
    <table class="min-w-full divide-y divide-gray-200">
      <thead class="bg-gray-50">
        <tr>
          <th
            v-for="column in columns"
            :key="column.key"
            class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
          >
            {{ column.label }}
          </th>
        </tr>
      </thead>
      <tbody class="bg-white divide-y divide-gray-200">
        <tr v-if="data.length === 0 && !loading">
          <td :colspan="columns.length" class="px-6 py-12 text-center text-sm text-gray-500">
            No hay datos disponibles
          </td>
        </tr>
        <tr v-for="(row, index) in data" :key="row.id || index" class="hover:bg-gray-50">
          <td
            v-for="column in columns"
            :key="column.key"
            class="px-6 py-4 whitespace-nowrap text-sm text-gray-900"
          >
            <slot :name="`cell-${column.key}`" :row="row" :column="column">
              {{ getCellValue(row, column.key) }}
            </slot>
          </td>
        </tr>
      </tbody>
    </table>
    
    <div v-if="loading" class="flex justify-center items-center p-8">
      <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Column {
  key: string;
  label: string;
}

defineProps<{
  columns: Column[];
  data: any[];
  loading?: boolean;
}>();

function getCellValue(row: any, key: string): string {
  if (key.includes('.')) {
    const keys = key.split('.');
    let value = row;
    for (const k of keys) {
      value = value?.[k];
    }
    return value ?? '';
  }
  return row[key] ?? '';
}
</script>
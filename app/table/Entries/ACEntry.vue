<script setup lang="ts">

const props = defineProps({
      ac: {type: Number, default: 15},
      shield: {type: Number, default: 0}
    }
)
</script>

<template>
  <div
      class="ac-box border-b-gray-500" style="border-color:grey">
    {{ props.ac }}
  </div>
  <div
      v-if="props.shield > 0"
      class=" shield bg-gray-600">
    +{{ props.shield }}
  </div>

</template>

<style scoped lang="scss">
@use "../../assets/styles/table/ac-box" as *;

</style>

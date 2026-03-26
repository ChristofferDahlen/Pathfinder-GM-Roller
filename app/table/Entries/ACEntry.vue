<script lang="ts" setup>

const props = defineProps({
      ac: {type: Number, default: 15},
      shield: {type: Number, default: 0}
    }
)
</script>

<template>
  <div
      class="ac-box border-b-gray-500">
    {{ props.ac }}
  </div>
  <div
      v-if="props.shield > 0"
      class="shield">
    +{{ props.shield }}
  </div>

</template>

<style lang="scss" scoped>
@use "../../assets/styles/box-base" as *;

.ac-box {
  @extend .box-base;

  background-color: darkblue;
  color: white;
  text-align: center;
  display: inline-block;
  vertical-align: middle;
  width: fit-content;
  @apply border-gray-100;

}

.shield {
  position: absolute;
  border-radius: 10pt;
  background-color: slategrey;
  color: white;
  text-align: center;
  display: inline-block;
  vertical-align: top;
  width: fit-content;
  padding: 0 4pt;
  @apply border-gray-100;
}
</style>

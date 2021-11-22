<script setup lang="ts">
// This starter template is using Vue 3 <script setup> SFCs
// Check out https://v3.vuejs.org/api/sfc-script-setup.html#sfc-script-setup
import { useRouter } from 'vue-router'
import HelloWorld from '@/components/HelloWorld/index.vue'

const router = useRouter()

const gotoDemo = () => {
  router.push('/supermap')
}
</script>

<template>
  <img alt="Vue logo" src="@/assets/logo.png" />
  <HelloWorld msg="Hello Vue 3 + TypeScript + Vite" />
  <el-button class="button" type="text" @click="gotoDemo">Supermap Demo</el-button>
</template>

<style scoped></style>

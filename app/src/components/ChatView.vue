<script setup lang="ts">
import { useRouter } from 'vue-router';

const router = useRouter()
const exitChat = () => {
    router.replace('/')
}
</script>


<template>
    <div>
        <h1>CHAT VIEW</h1>
        <h3>We are in route '{{ $route.params.chatId }}'</h3>
        <button @click="exitChat()">Exit</button>
    </div>
</template>


<style scoped>
</style>
<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';

const chatId = ref("")

const router = useRouter();
const joinChat = (chatId: string) => {
    router.push("/" + chatId)
}

const createChat = () => {
    router.push("/" + "random_generated_string")
}
</script>

<template>
    <h1>DYSFUNCTIONALCORD</h1>
    <!-- Have this truncate to DYSCORD by taking left and right and SMASHING them together -->

    <div class="container">
        <input v-model="chatId"></input>
        <button @click="joinChat(chatId)">Join</button>
        <button @click="createChat()">Create</button>
    </div>
</template>


<style>
    .container {
        width: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        flex-direction: column;
    }
</style>
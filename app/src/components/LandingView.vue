<script setup lang="ts">
import { ref } from 'vue';
import FirstView from './FirstView.vue';
import config from '../api/config';
import { createCall, setup, joinCall } from '../api/websocket';

setup(config.websocketURL, config)

const chatId = ref("")

const viewed = document.cookie.includes("viewed")
document.cookie = "viewed"

window.removeEventListener("beforeunload", config.dialog)
</script>

<template>
    <FirstView v-if="!viewed"/>

    <div class="container">
        <h1>DYSCORD</h1>
        <input v-model="chatId"></input>
        <button @click="joinCall(chatId)">Join</button>
        <button @click="createCall()">Create</button>
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
<script setup lang="ts">
</script>

<template>
    <div class="undercover"></div>
    <div class="cover">
        <div class="title">
            <h1 class="span animation"></h1>
            <h1 class="span">CORD</h1>
        </div>
    </div>
</template>

<style scoped>
    .undercover {
        position: fixed;
        bottom: 0;
        left: 0;
        width: 100vw;
        height: 100vh;
        background-color: #242424;
        animation: fadeout 1s ease-in forwards 6s;
    }
    .cover {
        position: fixed;
        bottom: 0;
        left: 0;
        width: 100vw;
        height: 100vh;
        background-color: #0B0A0F;
        display: flex;
        align-items: center;
        justify-content: center;
        animation: pushout 1s ease-in-out forwards 5s;
    }

    .span {
        display: inline;
    }

    .animation {

    }

    .animation::before {
        content: "DYSFUNCTIONAL";
        animation: changeText 1s ease-in 3s forwards;
    }

    .animation::after {
        content: "";
        animation: blink 1s linear 3s forwards;
    }

    .title {
        animation: fadein 2s forwards;
    }

    @keyframes fadein {
        from {
            opacity: 0;
        }

        to {
            opacity: 1;
        }
    }

    @keyframes fadeout {
        from {
            opacity: 1;
        }

        to {
            opacity: 0;
            display: none;
        }
    }

    @keyframes pushout {
        from {
            transform: translateY(0);
        }

        to {
            transform: translateY(100%);
        }
    }

    @keyframes changeText {
        0% {
            content: "DYSFUNCTIONAL";
        }

        10% {
            content: "DYSFUNCTIONA";
        }

        20% {
            content: "DYSFUNCTION";
        }

        30% {
            content: "DYSFUNCTIO";
        }

        40% {
            content: "DYSFUNCTI";
        }

        50% {
            content: "DYSFUNCT";
        }

        60% {
            content: "DYSFUNC";
        }

        70% {
            content: "DYSFUN";
        }

        80% {
            content: "DYSFU";
        }

        90% {
            content: "DYSF";
        }

        100% {
            content: "DYS";
        }
    }

    @keyframes blink {
        0%, 100% { 
            /* border-right: 1ch solid #ffffff; */
            opacity: 0;
        }
        50% {
            border-right: 1ch solid #ffffff;
            opacity: 1;
        }
    }
</style>

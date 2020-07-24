<template>
    <div :hidden="hidden" class="loading-field">
        <div class="box">
            <div class="loader"></div>
        </div>
    </div>
</template>

<script>
    export default {
        props: {
            hidden: {
                type: Boolean,
                default: false
            }
        }
    }
</script>

<style lang="scss" scoped>
    .loading-field {
        position:fixed;
        width: 100vw;
        height: 100vh;
        background-color: #ffffff;
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 999;

        .loader {
            width: 10vw;
            height: 10vw;
            border-radius: 50%;
            margin: 3em;
            position: relative;
        }

        .loader,
        .loader:before,
        .loader:after {
            animation: 1s infinite ease-in-out;
        }

        .loader:before,
        .loader:after {
            width: 100%; 
            height: 100%;
            border-radius: 50%;
            position: absolute;
            top: 0;
            left: 0;
        }

        // ==========================================

        .loader:before,
        .loader:after {
            content: '';
            background-color: #333;
            transform: scale(0);
            animation: loader 1.5s infinite ease-in-out;
        }

        .loader:after { animation-delay: 0.75s; }

        @keyframes loader {
            0%   { transform: translateX(-100%) scale(0); }
            50%  { transform: translateX(0%)    scale(1); }
            100% { transform: translateX(100%)  scale(0); }
        }
    }
</style>
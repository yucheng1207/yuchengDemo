<template>
    <div id="app">
        <img alt="Vue logo" src="./assets/logo.png" />
        <div class="modalContainer">
            <ModalNormal />
        </div>
        <div class="modalContainer">
            <ModalAbnormal />
        </div>
        <div class="modalContainer">
            <ModalTest />
        </div>
    </div>
</template>

<script>
import ModalNormal from './components/ModalNormal';
import ModalAbnormal from './components/ModalAbnormal';
import ModalTest from './components/ModalTest';

export default {
    name: 'App',
    components: {
        ModalTest,
        ModalNormal,
        ModalAbnormal,
    },
};
</script>

<style>
#app {
    font-family: Avenir, Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #2c3e50;
    margin-top: 60px;
}
.modalContainer {
    border: solid 1px gray;
    margin: 20px;
}
</style>

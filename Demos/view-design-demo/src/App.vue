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
        <RmoveTest />
    </div>
</template>

<script>
import ModalNormal from './components/ModalTest/ModalNormal';
import ModalAbnormal from './components/ModalTest/ModalAbnormal';
import ModalTest from './components/ModalTest/ModalTest';
import RmoveTest from './components/RemoveTest/RemoveTest';

export default {
    name: 'App',
    components: {
        ModalTest,
        ModalNormal,
        ModalAbnormal,
        RmoveTest,
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

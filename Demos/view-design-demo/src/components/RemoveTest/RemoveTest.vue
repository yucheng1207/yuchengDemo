<template>
    <div>
        <Button @click="toggleDisplayItem">销毁Item</Button>
        <Button @click="moveItemToBody">使用Js移动Item</Button>
        <RmoveItem id="testItem" v-if="displayItem" />
    </div>
</template>
<script>
import RmoveItem from './RmoveItem';
export default {
    components: {
        RmoveItem,
    },
    data() {
        return {
            displayItem: true,
        };
    },
    methods: {
        toggleDisplayItem() {
            this.displayItem = !this.displayItem;
        },
        moveItemToBody() {
            const item = document.getElementById('testItem');
            console.log('item', item);
            item && document.body.appendChild(item);
        },
    },
};
</script>

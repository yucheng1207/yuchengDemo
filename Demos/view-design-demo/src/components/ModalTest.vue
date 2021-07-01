<template>
    <div>
        <div style="margin: 10px">
            {{ displayModal ? '将Modal从dom中移除:' : '将Modal添加到dom中:' }}
            <Button type="primary" @click="toggleModal">
                {{ displayModal ? '移除Modal' : '添加Modal' }}
            </Button>
        </div>
        <div v-if="displayModal" style="margin: 10px">
            通过v-model控制弹框显示：
            <Button type="primary" @click="modal1 = true">显示弹框</Button>
        </div>
        <div>
            <Modal
                v-if="displayModal"
                v-model="modal1"
                title="弹框测试"
                :transfer="false"
                @on-ok="ok"
                @on-cancel="cancel"
            >
                <p>Content of dialog</p>
                <p>Content of dialog</p>
                <p>Content of dialog</p>
            </Modal>
        </div>
    </div>
</template>
<script>
export default {
    data() {
        return {
            displayModal: true,
            modal1: false,
        };
    },
    methods: {
        ok() {
            this.$Message.info('Clicked ok');
        },
        cancel() {
            this.$Message.info('Clicked cancel');
        },
        toggleModal() {
            this.displayModal = !this.displayModal;
        },
    },
};
</script>

<template>
    <div class="modalTest">
        <h1>不正常</h1>
        <ButtonGroup>
            <Button @click="showModal1">显示弹框一</Button>
            <Button @click="showModal2">显示弹框二</Button>
        </ButtonGroup>
        <div>
            <Modal
                v-for="m in modals"
                :key="`modal${m.key}`"
                :mask="true"
                v-model="showModal"
                :title="m.name"
                :footer-hide="true"
                :mask-closable="false"
                :closable="false"
                :transfer="true"
            >
                <Button @click="() => showOtherModal(m.key)">
                    {{ m.key === 'modal1' ? '显示弹框二' : '显示弹框一' }}
                </Button>
                <Button @click="() => closeModal(m.key)">关闭</Button>
            </Modal>
        </div>
    </div>
</template>

<script>
export default {
    name: 'HelloWorld',
    props: {
        msg: String,
    },
    data() {
        return {
            showModal: true,
            modals: [],
        };
    },
    methods: {
        showModal1() {
            if (!this.modals.find((item) => item.key === 'modal1')) {
                this.modals.push({
                    key: 'modal1',
                    name: '弹框1',
                });
            }
        },
        showModal2() {
            if (!this.modals.find((item) => item.key === 'modal2')) {
                this.modals.push({
                    key: 'modal2',
                    name: '弹框2',
                });
            }
        },
        showOtherModal(key) {
            if (key === 'modal1') {
                this.showModal2();
            } else {
                this.showModal1();
            }
        },
        closeModal(key) {
            this.modals = this.modals.filter((item) => item.key !== key);
        },
    },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>
.modalTest {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    margin: 8px;
}
</style>

<template>
    <div class="about">
        <h1>This is an test page</h1>
    </div>
</template>

<script lang="ts">
import {
    defineComponent,
    ref,
    reactive,
    toRaw,
    markRaw,
    toRef,
    isRef,
    Ref,
    toRefs,
    shallowRef,
    watchEffect,
    triggerRef,
} from 'vue';

export default defineComponent({
    name: 'Test',
    setup() {
        console.log('===== test0 =====');
        const rawCount = 1;
        const count = ref(rawCount);
        const obj = reactive({ count });

        console.log(rawCount === count.value);

        // ref 会被解包
        console.log(obj.count === count.value); // true

        // 它会更新 `obj.count`
        count.value++;
        console.log(count.value); // 2
        console.log(obj.count); // 2

        // 它也会更新 `count` ref
        obj.count++;
        console.log(obj.count); // 3
        console.log(count.value); // 3

        console.log('===== test1 =====');
        const obj1 = { count: 1 };
        const reactiveObj1 = reactive(obj1);

        console.log(reactiveObj1 === obj1); // false

        obj1.count++;
        console.log(obj1.count, reactiveObj1.count);

        console.log('===== test2 =====');
        const obj2 = { count: 1 };
        const reactiveObj2 = reactive(obj2);

        console.log(reactiveObj2 === obj2); // false

        // toRaw 返回 reactive 或 readonly 代理的原始对象
        const reactiveObj2Raw = toRaw(reactiveObj2); // 返回 reactive 或 readonly 代理的原始对象
        console.log(reactiveObj2Raw === obj2); // true
        console.log(reactiveObj2Raw === reactiveObj2); // false

        console.log('===== test3 =====');
        // markRaw标记一个对象，使其永远不会转换为 proxy。返回对象本身。
        const fooVar = { nested: {} };
        // fooVar.nested = 123;
        console.log('fooVar', fooVar);

        const fooRaw = markRaw(fooVar);
        console.log('fooRaw', fooRaw);

        console.log(fooVar === fooRaw); //true

        const fooRawReactive = reactive(fooRaw);
        console.log('fooRawReactive', fooRawReactive);

        console.log(fooVar === fooRawReactive); //true

        const fooVarReactive = reactive(fooVar); // 前面标记了fooVar永远不会成为proxy，所以这里不会生效
        console.log('fooVarReactive', fooVarReactive);

        console.log(fooVar === fooRawReactive); //true

        const bar = reactive({
            // 虽然 `foo` 被标记为原始，但 foo.nested 不是。
            nested: fooRaw.nested,
        });
        console.log(fooRaw.nested === bar.nested); // false

        markRaw(fooRaw.nested); // 将 `fooRaw.nested` 被标记为原始
        const bar11 = reactive({
            nested: fooRaw.nested,
        });
        console.log(fooRaw.nested === bar11.nested); // false fooRaw.nested标记为reactive不能重新标记为markRaw？？？

        const fooVar2 = { nested: {} };
        const fooRaw2 = markRaw(fooVar2);
        markRaw(fooRaw2.nested); // 将 `fooRaw2.nested` 被标记为原始
        const bar2 = reactive({
            nested: fooRaw2.nested,
        });
        console.log(fooRaw2.nested === bar2.nested); // true

        console.log('===== test4 =====');
        // toRef 可以用来为源响应式对象上的某个 property 新创建一个 ref。然后，ref 可以被传递，它会保持对其源 property 的响应式连接
        const state = reactive({
            foo: 1,
            bar: 2,
        });

        function add(data: number | Ref<number>) {
            if (isRef(data)) {
                data.value++;
            } else {
                data++;
            }
        }

        add(state.foo);
        console.log(state.foo); // 1
        add(toRef(state, 'foo'));
        console.log(state.foo); // 2

        console.log('===== test5 =====');
        // toRefs: 将响应式对象转换为普通对象，其中结果对象的每个 property 都是指向原始对象相应 property 的 ref。
        const state1 = reactive({
            foo: 1,
            bar: 2,
            obj: {
                foo: 1,
            },
        });

        const stateAsRefs = toRefs(state1);
        /*
        stateAsRefs 的类型:

        {
        foo: Ref<number>,
        bar: Ref<number>
        }
        */

        // ref 和原始 property 已经“链接”起来了
        state1.foo++;
        console.log(stateAsRefs.foo.value); // 2

        stateAsRefs.foo.value++;
        console.log(state1.foo); // 3

        state1.obj.foo++;
        console.log(stateAsRefs.obj.value.foo); // 2
        stateAsRefs.obj.value.foo++;
        console.log(state1.obj.foo); // 3

        console.log('===== test6 =====');
        const shallow = shallowRef({
            greet: 'Hello, world',
        });

        // 第一次运行时记录一次 "Hello, world"
        watchEffect(() => {
            console.log(shallow.value.greet);
        });

        // 这不会触发作用 (effect)，因为 ref 是浅层的
        shallow.value.greet = 'Hello, universe';

        // 记录 "Hello, universe"
        triggerRef(shallow);
    },
});
</script>

import { useState } from "react";

export default function IndexDBTest() {
    const [db, setDb] = useState(null);
  
    // 创建数据库
    const createDatabase = () => {
      const request = window.indexedDB.open('myDatabase', 1);
  
      request.onerror = event => {
        console.log('创建数据库失败');
      };
  
      request.onsuccess = (event: Event) => {
        console.log('创建数据库成功');
        setDb((event.target as any).result);
      };
  
      request.onupgradeneeded = (event: Event) => {
        const db = (event.target as any).result;
        const store = db.createObjectStore('myObjectStore', { keyPath: 'id' });
  
        // 添加索引
        store.createIndex('name', 'name', { unique: false });
        store.createIndex('email', 'email', { unique: true });
  
        // 填充数据
        store.add({ id: 1, name: '张三', email: 'zhangsan@example.com' });
        store.add({ id: 2, name: '李四', email: 'lisi@example.com' });
        store.add({ id: 3, name: '王五', email: 'wangwu@example.com' });
      };
    };
  
    // 删除数据库
    const deleteDatabase = () => {
      if (window.indexedDB.deleteDatabase) {
        const request = window.indexedDB.deleteDatabase('myDatabase');
  
        request.onerror = event => {
          console.log('删除数据库失败');
        };
  
        request.onsuccess = event => {
          console.log('删除数据库成功');
          setDb(null);
        };
      }
    };
  
    // 查询数据
    const queryData = () => {
      const transaction = db.transaction(['myObjectStore'], 'readonly');
      const objectStore = transaction.objectStore('myObjectStore');
      const request = objectStore.openCursor();
  
      // 遍历游标
      request.onsuccess = event => {
        const cursor = event.target.result;
  
        if (cursor) {
          console.log('id: ' + cursor.value.id + ', name: ' + cursor.value.name + ', email: ' + cursor.value.email);
          cursor.continue();
        }
      };
  
      // 查询出错处理
      transaction.onerror = event => {
        console.log('查询数据失败');
      };
    };

    const emitIndexdbError = () => {
        console.log('emit indexdb error')
        const request = window.indexedDB.open('myDatabase');
  
        request.onerror = event => {
          console.log('创建数据库失败');
        };
    
        request.onsuccess = (event: Event) => {
          console.log('创建数据库成功');
          setDb((event.target as any).result);
        };
    
    }
  
    return (
      <div>
        {!db ? (
          <button onClick={createDatabase}>创建数据库</button>
        ) : (
          <>
            <button onClick={deleteDatabase}>删除数据库</button>
            <button onClick={queryData}>查询数据</button>
          </>
        )}
        <button onClick={emitIndexdbError}>触发 indexdb 报错</button>
      </div>
    );
}
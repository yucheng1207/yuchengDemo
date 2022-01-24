import React from "react";
// 两种引入方式
// import { Button as RemoteButton, ButtonProps } from "app2/Button";
// or
const RemoteButton = React.lazy(() => import("app2/Button").then(({ Button }) => ({ default: Button }) ));

const App = () => (
  <div>
    <h1>Basic Host-Remote</h1>
    <h2>App 1</h2>
    <React.Suspense fallback="Loading Button">
      <RemoteButton />
    </React.Suspense>
  </div>
);

export default App;

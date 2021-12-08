import React from "react";
// import { Button as RemoteButton, ButtonProps } from "app2/Button";

const RemoteButton = React.lazy(() => import("app2/Button"));

const App = () => (
  <div>
    <h1>Basic Host-Remote</h1>
    <h2>App 1</h2>
    <React.Suspense fallback="Loading Button">
      <RemoteButton text="remote button" />
    </React.Suspense>
  </div>
);

export default App;

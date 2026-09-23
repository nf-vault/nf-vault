import { BrowserRouter, Navigate, Route, Routes } from "react-router";

import "./themes/default.css";
import "./App.css";
import ErrorProvider from "@/06-shared/lib/error/ErrorProvider";
import { NodePage } from "@/02-pages/node";
import { TreePage } from "@/02-pages/tree";

const App = () => {
  return (
    <ErrorProvider>
      <BrowserRouter>
        <Routes>
          <Route
            path="/"
            element={<TreePage currentDirectoryId={null} path={[]}/>}
          />
          <Route
            path="/:nodeId"
            element={<NodePage/>}
          />
          <Route
            path="*"
            element={<Navigate to="/" replace/>}
          />
        </Routes>
      </BrowserRouter>
    </ErrorProvider>
  );
}

export default App;

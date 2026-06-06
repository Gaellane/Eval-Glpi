import { BrowserRouter, Routes , Route } from "react-router-dom";
import LoginBO from "./pages/LoginBO";
import MainLayoutBO from "./layouts/MainLayoutBO";
import Reset from "./pages/Reset";
import Import from "./pages/Import";

function App() {
    return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LoginBO />} />
        <Route path="/accueil" element={<MainLayoutBO />}>
          <Route path="reset" element={<Reset />} />
          <Route path="import" element={<Import />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App

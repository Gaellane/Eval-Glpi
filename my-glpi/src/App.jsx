import { BrowserRouter, Routes , Route } from "react-router-dom";
import { useEffect } from "react";

import LoginBO from "./pages/LoginBO";
import MainLayoutBO from "./layouts/MainLayoutBO";
import MainLayoutFO from "./layouts/MainLayoutFO";
import Reset from "./pages/Reset";
import Import from "./pages/Import";
import AssetList from "./components/assets/AssetList";
import TicketForm from "./pages/assistance/TicketForm";

function App() {

    return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LoginBO />} />
        <Route path="/bo" element={<MainLayoutBO />}>
          <Route path="reset" element={<Reset />} />
          <Route path="import" element={<Import />} />
        </Route>
        <Route path="/fo" element={<MainLayoutFO />}>
          <Route path="assets" element={<AssetList />} />
          <Route path="ticket/add" element={<TicketForm />} />
        </Route>
      </Routes>
      
    </BrowserRouter>
  );
}

export default App;

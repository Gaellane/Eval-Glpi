import { BrowserRouter, Routes , Route } from "react-router-dom";
import { useEffect } from "react";

import LoginBO from "./pages/LoginBO";
import MainLayoutBO from "./layouts/MainLayoutBO";
import MainLayoutFO from "./layouts/MainLayoutFO";
import Reset from "./pages/Reset";
import Import from "./pages/Import";
import AssetList from "./pages/assets/AssetList";
import TicketForm from "./pages/assistance/TicketForm";
import TicketList from "./pages/assistance/TicketList";
import TicketDetail from "./components/assistance/TicketDetail";
import Dashboard from "./pages/Dashboard";


function App() {

    return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LoginBO />} />
        <Route path="/bo" element={<MainLayoutBO />}>
          <Route index element={<Dashboard />} />
          <Route path="reset" element={<Reset />} />
          <Route path="import" element={<Import />} />
          <Route path="ticket" element={<TicketList />} />
          <Route path="ticket/:id" element={<TicketDetail />} />
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

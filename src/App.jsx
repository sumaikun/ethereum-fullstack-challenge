import Home from "./pages/Home.jsx";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Detailed from "./pages/Detailed.jsx";
import Trading from "./pages/Trading.jsx";
import Challenges from "./pages/Challenges";
import Sidebar from "./components/Sidebar";
import { SidebarItem } from "./components/Sidebar";
import { UserCircle, LayoutDashboard, Puzzle  } from "lucide-react";

function App() {
  return (
    <Router>
      <div className="flex">
        <Sidebar>
          <SidebarItem
            to="/"
            icon={<LayoutDashboard size={20} />}
            text="Home"
          />
          <SidebarItem
            icon={<UserCircle size={20} />}
            text="Trading"
            to="/Trading"
          />
          <SidebarItem
            to="/Challenges"
            icon={<Puzzle  size={20} />}
            text="Challenges"
          />
          <hr className="my-3" />
        </Sidebar>
        <Routes>
          <Route path="/" element={<Home />}></Route>
          <Route path="/page/:pageNumber" element={<Home />}></Route>
          <Route path="/categories" element={<Home />}></Route>
          <Route path="/Challenges" element={<Challenges />}></Route>
          <Route path="/Trading" element={<Trading />}></Route>
          <Route path="/:id" element={<Detailed />}></Route>
        </Routes>
      </div>
    </Router>
  );
}

export default App;

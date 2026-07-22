import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/navbar";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import Projects from "./pages/Projects";
import ProjectDetail from "./pages/ProjectDetail";
import Auth from "./pages/Auth";
import PaymentSuccess from "./pages/PaymentSuccess";
import Admin from "./pages/Admin";
import Boutique from "./pages/Boutique";

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-[#0a0a1a]">
        <Navbar />
        <main>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/projects" element={<Projects />} />
            <Route path="/projects/:slug" element={<ProjectDetail />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/boutique" element={<Boutique />} />
            <Route path="/paiement/succes" element={<PaymentSuccess />} />
            <Route path="/admin" element={<Admin />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </BrowserRouter>
  );
}

export default App;

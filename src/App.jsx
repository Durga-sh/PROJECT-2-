import { Routes, Route } from "react-router-dom";
import Register from "./pages/Register";
import Login from "./pages/Login";
import ChefRegister from "./pages/ChefRegister";
import Home from "./pages/Home";   
import Header from "./components/Header"; 

function App() {
  return (
    <>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/chef-register" element={<ChefRegister />} />
      </Routes>
    </>
  );
}

export default App;
import { Routes, Route } from 'react-router-dom'; 
import Header from "./components/Header"; 
import Home from "./pages/Home";
import Login from "./pages/Login";
import Registration from "./pages/Registration";
import "./App.css";

function App() {
  return (
    <>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />   
        <Route path="/login" element={<Login />} />
        <Route path="/Registration" element={<Registration />} />
      </Routes>
    </>
  );
}

export default App;
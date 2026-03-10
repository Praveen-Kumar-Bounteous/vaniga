import { Routes, Route } from "react-router-dom";
import { Toaster } from "sonner";
import Login from "./Auth/pages/Login";
import Signup from "./Auth/pages/Signup";

function App() {
  return (
    <>
      <Toaster position="top-right" richColors closeButton />
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/" element={<h1 className="p-10 text-2xl">Home Page (Coming Soon)</h1>} />
      </Routes>
    </>
  );
}

export default App;
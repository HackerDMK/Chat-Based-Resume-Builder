import { Navigate, Route, Routes } from "react-router-dom";
import { useEffect, useState } from "react";
import Home from "./pages/home/Home";
import Login from "./pages/login/Login";
import { Toaster } from "react-hot-toast";
import { useAuthContext } from "./context/AuthContext";
import Particles, { initParticlesEngine } from "@tsparticles/react";
import { loadSlim } from "@tsparticles/slim";
import particlesOptions from "./particleConfig,js";

function App() {
  const { authUser } = useAuthContext();
  const [init, setInit] = useState(false);

  useEffect(() => {
    initParticlesEngine(async (engine) => {
      await loadSlim(engine);
    }).then(() => {
      setInit(true);
    });
  }, []);

  return (
    <div className="p-4 h-screen flex items-center justify-center">
      <Routes>
        <Route
          path="/:chatId?"
          element={authUser ? <Home /> : <Navigate to={"/auth"} />}
        />
        <Route
          path="/auth"
          element={authUser ? <Navigate to="/" /> : <Login />}
        />
      </Routes>
      {init && (
        <Particles
          id="tsparticles"
          init={() => null}
          options={particlesOptions}
          style={{ position: "fixed", width: "100%", height: "100%" }}
        />
      )}
      <Toaster />
    </div>
  );
}

export default App;

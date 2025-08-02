import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api"; // Asegúrate que tenga la baseURL correcta

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const manejarLogin = async (e) => {
    e.preventDefault();

    if (!username.trim() || !password.trim()) {
      alert("Por favor ingresa usuario y clave.");
      return;
    }

    setLoading(true);
    try {
      const formData = new URLSearchParams();
      formData.append("username", username);
      formData.append("password", password);

      const response = await API.post("/usuarios/login", formData, {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      });

      const token = response?.data?.access_token;
      if (token) {
        localStorage.setItem("token", token);
        localStorage.setItem("usuario", username);
        navigate("/lista-pedidos"); // Redirección al home después de login
      } else {
        console.error("Token no recibido:", response.data);
        alert("Login fallido: token no recibido.");
      }

    } catch (error) {
      console.error("Error en login:", error);
      alert("Usuario o contraseña incorrectos");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-tr from-sky-300 via-blue-400 to-indigo-500 px-4">
      <form
        onSubmit={manejarLogin}
        className="bg-white shadow-2xl rounded-3xl p-8 w-full max-w-md space-y-6"
      >
        <h1 className="text-3xl font-extrabold text-center text-blue-700">
          🔧 Ingresar al Taller
        </h1>

        <div>
          <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">
            Usuario
          </label>
          <input
            id="username"
            type="text"
            autoComplete="username"
            placeholder="Ingresa tu usuario"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
            Contraseña
          </label>
          <input
            id="password"
            type="password"
            autoComplete="current-password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className={`w-full py-2 rounded-lg font-semibold text-white transition duration-200 ${
            loading
              ? "bg-blue-300 cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-700"
          }`}
        >
          {loading ? "Cargando..." : "Entrar"}
        </button>
      </form>
    </div>
  );
};

export default Login;

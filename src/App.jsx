import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Login from "./pages/Login";
import ListaPedidos from "./pages/ListaPedidos";
import NuevoPedido from "./pages/NuevoPedido";
import EditarPedido from "./pages/EditarPedido";


function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/lista-pedidos" element={<ListaPedidos />} />
        <Route path="/nuevo-pedido" element={<NuevoPedido />} />
        <Route path="/editar-pedido/:id" element={<EditarPedido />} />
      </Routes>
      <ToastContainer position="top-right" autoClose={3000} />
    </BrowserRouter>
  );
}

export default App;

import React, { useEffect, useState } from "react";
import API from "../services/api";
import { useNavigate } from "react-router-dom";
import { FaPlus, FaEdit, FaSignOutAlt, FaWhatsapp } from "react-icons/fa";

const ListaPedidos = () => {
  const [pedidos, setPedidos] = useState([]);
  const [pedidosFiltrados, setPedidosFiltrados] = useState([]);
  const [pagina, setPagina] = useState(1);
  const [totalPaginas, setTotalPaginas] = useState(1);
  const [busqueda, setBusqueda] = useState("");
  const limite = 10;
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/");
      return;
    }

    const cargarPedidos = async () => {
      try {
        const skip = (pagina - 1) * limite;
        const res = await API.get(`/pedidos?skip=${skip}&limit=${limite}`);
        const data = res.data;
        const pedidosCargados = Array.isArray(data.pedidos) ? data.pedidos : data;
        const paginasTotales = data.totalPaginas || 1;

        setPedidos(pedidosCargados);
        setTotalPaginas(paginasTotales);
        setPedidosFiltrados(pedidosCargados);
      } catch (error) {
        console.error("Error al cargar pedidos:", error);
        if (error.response?.status === 401) {
          localStorage.removeItem("token");
          localStorage.removeItem("usuario");
          navigate("/");
        } else {
          setPedidos([]);
          setPedidosFiltrados([]);
        }
      }
    };

    cargarPedidos();
  }, [pagina, navigate]);

  useEffect(() => {
    const filtro = busqueda.toLowerCase();
    const resultado = pedidos.filter(
      (p) =>
        p.cliente.toLowerCase().includes(filtro) ||
        p.prenda.toLowerCase().includes(filtro)
    );
    setPedidosFiltrados(resultado);
  }, [busqueda, pedidos]);

  const manejarCerrarSesion = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("usuario");
    navigate("/");
  };

  const manejarAgregar = () => navigate("/nuevo-pedido");
  const manejarEditar = (id) => navigate(`/editar-pedido/${id}`);

  const enviarWhatsApp = (pedido) => {
    const numeroOriginal = pedido.whatsapp;
    if (!numeroOriginal) {
      alert("Este pedido no tiene número de teléfono.");
      return;
    }

    const numeroLimpio = numeroOriginal.replace(/\D/g, "");
    if (numeroLimpio.length < 10) {
      alert("Número de teléfono inválido.");
      return;
    }

    const numeroConPrefijo = numeroLimpio.startsWith("57")
      ? numeroLimpio
      : `57${numeroLimpio}`;

    const mensaje = encodeURIComponent(
      `Hola ${pedido.cliente}, tu pedido de ${pedido.cantidad} ${pedido.prenda} está en estado: ${pedido.estado}. ¡Gracias por confiar en nosotros!`
    );

    const url = `https://api.whatsapp.com/send?phone=${numeroConPrefijo}&text=${mensaje}`;

    window.open(url, "_blank", "noopener,noreferrer");
  };

  return (
    <div className="min-h-screen bg-blue-50 p-4 sm:p-6">
      {/* Encabezado */}
      <div className="flex flex-col sm:flex-row justify-between items-center mb-4">
        <h1 className="text-3xl font-bold text-blue-900 mb-2 sm:mb-0">
          Lista de Pedidos
        </h1>
        <div className="flex gap-2">
          <button
            onClick={manejarAgregar}
            className="bg-green-600 text-white px-4 py-2 rounded shadow hover:bg-green-700 flex items-center gap-2"
          >
            <FaPlus /> Agregar Pedido
          </button>
          <button
            onClick={manejarCerrarSesion}
            className="bg-red-500 text-white px-4 py-2 rounded shadow hover:bg-red-600 flex items-center gap-2"
          >
            <FaSignOutAlt /> Salir
          </button>
        </div>
      </div>

      {/* Buscador */}
      <div className="mb-4">
        <input
          type="text"
          placeholder="Buscar por cliente o prenda..."
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
          className="w-full sm:w-96 px-4 py-2 rounded border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
      </div>

      {/* Tabla */}
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-300 shadow-md rounded-lg text-sm sm:text-base">
          <thead className="bg-blue-200 text-blue-900">
            <tr>
              <th className="p-2 sm:p-3">Cliente</th>
              <th className="p-2 sm:p-3">Prenda</th>
              <th className="p-2 sm:p-3">Cantidad</th>
              <th className="p-2 sm:p-3">Entrega</th>
              <th className="p-2 sm:p-3">Valor</th>
              <th className="p-2 sm:p-3">Estado</th>
              <th className="p-2 sm:p-3 text-center">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {pedidosFiltrados.length > 0 ? (
              pedidosFiltrados.map((pedido) => {
                const whatsappLimpio = pedido.whatsapp?.replace(/\D/g, "") || "";
                const esValido = whatsappLimpio.length >= 10;

                return (
                  <tr key={pedido.id} className="border-t hover:bg-blue-50">
                    <td className="p-2 sm:p-3">{pedido.cliente}</td>
                    <td className="p-2 sm:p-3">{pedido.prenda}</td>
                    <td className="p-2 sm:p-3">{pedido.cantidad}</td>
                    <td className="p-2 sm:p-3">
                      {pedido.fecha_entrega
                        ? new Date(pedido.fecha_entrega).toLocaleDateString()
                        : "Sin fecha"}
                    </td>
                    <td className="p-2 sm:p-3">
                        {pedido.valor !== null
                            ? new Intl.NumberFormat("es-CO", {
                                style: "currency",
                                currency: "COP",
                                minimumFractionDigits: 0,
                            }).format(pedido.valor)
                            : "—"}
                     </td>
                    <td className="p-2 sm:p-3">{pedido.estado}</td>
                    <td className="p-2 sm:p-3 flex gap-2 justify-center">
                      <button
                        onClick={() => manejarEditar(pedido.id)}
                        className="text-blue-600 hover:text-blue-800"
                        title="Editar"
                      >
                        <FaEdit />
                      </button>
                      <button
                        onClick={() => enviarWhatsApp(pedido)}
                        className={`${
                          esValido
                            ? "text-green-600 hover:text-green-800"
                            : "text-gray-400 cursor-not-allowed"
                        }`}
                        disabled={!esValido}
                        title={
                          esValido
                            ? "Enviar estado por WhatsApp"
                            : "Sin número válido"
                        }
                      >
                        <FaWhatsapp />
                      </button>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan="7" className="text-center p-4 text-gray-500">
                  No hay resultados.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Paginación */}
      <div className="flex justify-center items-center gap-4 mt-6">
        <button
          onClick={() => setPagina(pagina - 1)}
          disabled={pagina === 1}
          className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400 disabled:opacity-50"
        >
          Anterior
        </button>
        <span className="text-gray-700">
          Página {pagina} de {totalPaginas}
        </span>
        <button
          onClick={() => setPagina(pagina + 1)}
          disabled={pagina === totalPaginas}
          className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400 disabled:opacity-50"
        >
          Siguiente
        </button>
      </div>
    </div>
  );
};

export default ListaPedidos;

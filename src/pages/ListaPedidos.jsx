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
    <div className="min-h-screen bg-blue-50 px-3 py-5 sm:px-6">
      {/* Encabezado */}
      <div className="flex flex-col sm:flex-row justify-between items-center mb-5 gap-2">
        <h1 className="text-2xl sm:text-3xl font-bold text-blue-900">Pedidos</h1>
        <div className="flex gap-2 w-full sm:w-auto">
          <button
            onClick={manejarAgregar}
            className="flex-1 sm:flex-none bg-green-600 text-white px-4 py-3 rounded-lg shadow hover:bg-green-700 flex items-center justify-center gap-2 text-sm"
          >
            <FaPlus /> Agregar
          </button>
          <button
            onClick={manejarCerrarSesion}
            className="flex-1 sm:flex-none bg-red-500 text-white px-4 py-3 rounded-lg shadow hover:bg-red-600 flex items-center justify-center gap-2 text-sm"
          >
            <FaSignOutAlt /> Salir
          </button>
        </div>
      </div>

      {/* Buscador */}
      <div className="mb-4">
        <input
          type="text"
          placeholder="Buscar cliente o prenda..."
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
          className="w-full px-4 py-3 rounded-lg border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 text-base"
        />
      </div>

      {/* Lista de Pedidos */}
      <div className="space-y-4">
        {pedidosFiltrados.length > 0 ? (
          pedidosFiltrados.map((pedido) => {
            const whatsappLimpio = pedido.whatsapp?.replace(/\D/g, "") || "";
            const esValido = whatsappLimpio.length >= 10;

            return (
              <div
                key={pedido.id}
                className="bg-white shadow rounded-xl p-4 space-y-1 text-gray-800 text-base"
              >
                <p><strong>👤 Cliente:</strong> {pedido.cliente}</p>
                <p><strong>👕 Prenda:</strong> {pedido.prenda}</p>
                <p><strong>🔢 Cantidad:</strong> {pedido.cantidad}</p>
                <p>
                  <strong>📅 Entrega:</strong>{" "}
                  {pedido.fecha_entrega
                    ? new Date(pedido.fecha_entrega).toLocaleDateString()
                    : "Sin fecha"}
                </p>
                <p>
                  <strong>💰 Valor:</strong>{" "}
                  {pedido.valor !== null
                    ? new Intl.NumberFormat("es-CO", {
                        style: "currency",
                        currency: "COP",
                        minimumFractionDigits: 0,
                      }).format(pedido.valor)
                    : "—"}
                </p>
                <p><strong>📌 Estado:</strong> {pedido.estado}</p>

                <div className="flex gap-3 justify-end pt-3">
                  <button
                    onClick={() => manejarEditar(pedido.id)}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700 text-sm"
                  >
                    <FaEdit /> Editar
                  </button>
                  <button
                    onClick={() => enviarWhatsApp(pedido)}
                    disabled={!esValido}
                    className={`${
                      esValido
                        ? "bg-green-600 hover:bg-green-700"
                        : "bg-gray-300 cursor-not-allowed"
                    } text-white px-4 py-2 rounded-lg flex items-center gap-2 text-sm`}
                  >
                    <FaWhatsapp /> WhatsApp
                  </button>
                </div>
              </div>
            );
          })
        ) : (
          <p className="text-center text-gray-500 text-lg">No hay resultados.</p>
        )}
      </div>

      {/* Paginación */}
      <div className="flex justify-center items-center gap-4 mt-6">
        <button
          onClick={() => setPagina(pagina - 1)}
          disabled={pagina === 1}
          className="px-4 py-2 bg-gray-300 rounded-lg hover:bg-gray-400 disabled:opacity-50"
        >
          ⬅ Anterior
        </button>
        <span className="text-gray-700 text-lg font-medium">
          Página {pagina} de {totalPaginas}
        </span>
        <button
          onClick={() => setPagina(pagina + 1)}
          disabled={pagina === totalPaginas}
          className="px-4 py-2 bg-gray-300 rounded-lg hover:bg-gray-400 disabled:opacity-50"
        >
          Siguiente ➡
        </button>
      </div>
    </div>
  );
};

export default ListaPedidos;

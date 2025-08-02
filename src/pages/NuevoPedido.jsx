import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import {
  Box,
  Button,
  Container,
  Grid,
  TextField,
  Typography,
  Paper,
} from "@mui/material";

const NuevoPedido = () => {
  const [pedido, setPedido] = useState({
    cliente: "",
    prenda: "",
    cantidad: "",
    fecha_entrega: "",
    whatsapp: "",
    valor: "",
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    // No convertir aquí a número para evitar problemas al borrar valores
    setPedido({ ...pedido, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!pedido.cliente || !pedido.prenda || !pedido.fecha_entrega || !pedido.valor) {
      toast.warn("Por favor completa todos los campos obligatorios.");
      return;
    }

    try {
      await API.post("/pedidos", {
        ...pedido,
        cantidad: pedido.cantidad ? Number(pedido.cantidad) : null,
        valor: Number(pedido.valor),
      });
      toast.success("✅ Pedido creado con éxito");
      setPedido({
        cliente: "",
        prenda: "",
        cantidad: "",
        fecha_entrega: "",
        whatsapp: "",
        valor: "",
      });
      navigate("/lista-pedidos");
    } catch (error) {
      const mensaje =
        error?.response?.data?.message || "❌ Error al crear el pedido.";
      toast.error(mensaje);
    }
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 4, mb: 4 }}>
      <Paper elevation={4} sx={{ p: { xs: 2, sm: 4 } }}>
        <Typography variant="h5" gutterBottom align="center">
          Nuevo Pedido
        </Typography>

        <Box component="form" onSubmit={handleSubmit} noValidate>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                label="Cliente *"
                name="cliente"
                value={pedido.cliente}
                onChange={handleChange}
                fullWidth
                required
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                label="Prenda *"
                name="prenda"
                value={pedido.prenda}
                onChange={handleChange}
                fullWidth
                required
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                label="Cantidad"
                name="cantidad"
                type="number"
                inputProps={{ min: 1 }}
                value={pedido.cantidad}
                onChange={handleChange}
                fullWidth
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                label="Fecha de entrega *"
                name="fecha_entrega"
                type="date"
                value={pedido.fecha_entrega}
                onChange={handleChange}
                fullWidth
                InputLabelProps={{ shrink: true }}
                required
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                label="WhatsApp"
                name="whatsapp"
                value={pedido.whatsapp}
                onChange={handleChange}
                fullWidth
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                label="Valor *"
                name="valor"
                type="number"
                inputProps={{ min: 0 }}
                value={pedido.valor}
                onChange={handleChange}
                fullWidth
                required
              />
            </Grid>

            <Grid item xs={12}>
              <Button
                type="submit"
                variant="contained"
                fullWidth
                sx={{ mt: 1.5, py: 1.5 }}
              >
                Guardar Pedido
              </Button>
            </Grid>
          </Grid>
        </Box>
      </Paper>
    </Container>
  );
};

export default NuevoPedido;

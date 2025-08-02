import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../services/api";
import { toast } from "react-toastify";

import {
  Box,
  Button,
  Container,
  Grid,
  MenuItem,
  Paper,
  TextField,
  Typography,
} from "@mui/material";

const EditarPedido = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [pedido, setPedido] = useState(null);

  const opcionesEstado = ["pendiente", "en proceso", "entregado", "cancelado"];

  useEffect(() => {
    const fetchPedido = async () => {
      try {
        const { data } = await API.get(`/pedidos/${id}`);
        if (data?.fecha_entrega) {
          data.fecha_entrega = data.fecha_entrega.split("T")[0];
        }
        setPedido(data);
      } catch (error) {
        toast.error("Error cargando el pedido.");
      }
    };

    fetchPedido();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPedido((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const pedidoAEnviar = {
        ...pedido,
        cantidad: pedido.cantidad ? Number(pedido.cantidad) : null,
        valor: Number(pedido.valor),
      };

      await API.put(`/pedidos/${id}`, pedidoAEnviar);
      toast.success("✅ Pedido actualizado correctamente.");
      navigate("/lista-pedidos");
    } catch (error) {
      toast.error("❌ Error al actualizar el pedido.");
    }
  };

  if (!pedido) {
    return (
      <Typography align="center" variant="body1" sx={{ mt: 10 }}>
        Cargando pedido...
      </Typography>
    );
  }

  return (
    <Container maxWidth="sm" sx={{ mt: 4, mb: 4 }}>
      <Paper elevation={4} sx={{ p: { xs: 2, sm: 4 } }}>
        <Typography variant="h5" gutterBottom align="center">
          Editar Pedido
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
              <TextField
                select
                label="Estado"
                name="estado"
                value={pedido.estado || "pendiente"}
                onChange={handleChange}
                fullWidth
              >
                {opcionesEstado.map((estado) => (
                  <MenuItem key={estado} value={estado}>
                    {estado.charAt(0).toUpperCase() + estado.slice(1)}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>

            <Grid item xs={12}>
              <Button
                type="submit"
                variant="contained"
                fullWidth
                sx={{ mt: 1.5, py: 1.5 }}
              >
                Actualizar Pedido
              </Button>
            </Grid>
          </Grid>
        </Box>
      </Paper>
    </Container>
  );
};

export default EditarPedido;

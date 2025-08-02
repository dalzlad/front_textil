const Home = () => {
    return (
      <div className="p-4">
        <h2 className="text-xl font-bold">Bienvenido al sistema de pedidos</h2>
      </div>
    );
  };
  
  export default Home;

  async function mostrarUsuario() {
    try {
      const usuario = await obtenerUsuario(1);
      const { nombre, edad } = usuario;
      console.log(`Usuario: ${nombre}, Edad: ${edad}`);
    } catch (error) {
      console.error("Error:", error);
    }
  }
  
  mostrarUsuario();
  

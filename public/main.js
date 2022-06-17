const socket = io();

const enviarMensaje = () => {
  const nombre = document.getElementById("nombre").value;
  const mensaje = document.getElementById("mensaje").value;
  const msj = { nombre, mensaje };
  
  socket.emit('new_message', msj);
  return false;
}

const crearEtiquetasMensaje = (msj) => {
  const { nombre, mensaje } = msj;
  return `
    <div>
      <strong>${nombre}</strong>
      <em>${mensaje}</em>
    </div>
  `;
}

const agregarMensajes = (mensajes) => {
  const mensajesFinal = mensajes.map(msj => crearEtiquetasMensaje(msj)).join(" ");
  document.getElementById("messages").innerHTML = mensajesFinal;
}

socket.on('messages', (messages) => agregarMensajes(messages));
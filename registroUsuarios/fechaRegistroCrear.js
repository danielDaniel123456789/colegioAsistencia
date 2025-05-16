function fechaRegistroCrear() {
    // Crear la fecha actual
    const fecha = new Date();
  
    // Obtener el año, mes y día
    const año = fecha.getFullYear();
    const mes = (fecha.getMonth() + 1).toString().padStart(2, '0'); // Los meses en JavaScript empiezan desde 0
    const dia = fecha.getDate().toString().padStart(2, '0');
  
    // Formato de fecha en "año-mes-día"
    const fechaRegistro = `${año}-${mes}-${dia}`;
  
    // Guardar la fecha de registro en localStorage
    localStorage.setItem('fechaRegistroInicioUsuario', JSON.stringify(fechaRegistro));
  }
  

  function obtenerFechaRegistro() {
    // Intentar obtener la fecha de registro desde localStorage
    const fechaRegistro = localStorage.getItem('fechaRegistroInicioUsuario');
  
    // Si no existe, crearla y almacenarla
    if (!fechaRegistro) {
      // Crear la fecha actual
      const fecha = new Date();
  
      // Obtener el año, mes y día
      const año = fecha.getFullYear();
      const mes = (fecha.getMonth() + 1).toString().padStart(2, '0'); // Los meses en JavaScript empiezan desde 0
      const dia = fecha.getDate().toString().padStart(2, '0');
  
      // Formato de fecha en "año-mes-día"
      const nuevaFechaRegistro = `${año}-${mes}-${dia}`;
  
      // Guardar la nueva fecha de registro en localStorage
      localStorage.setItem('fechaRegistroInicioUsuario', JSON.stringify(nuevaFechaRegistro));
  
      // Devolver la fecha recién creada
      return nuevaFechaRegistro;
    }
  
    // Si existe, devolver la fecha almacenada
    return JSON.parse(fechaRegistro);
  }
  
function generarRegistroUsuario() {
 
       
    
    // Guardar el registro y el estado del usuario en localStorage
    localStorage.setItem('registroAsistencia', JSON.stringify(clavesRegistro()));
    localStorage.setItem('estadoUsuarioRegistrado', JSON.stringify('0'));
}


function obtenerRegistroAsistencia() {
    const registro = localStorage.getItem('registroAsistencia');
    if (registro) {
        return JSON.parse(registro);
    } else {
        return null; // o puedes devolver un valor por defecto
    }
}

// Función para editar un grupo
function editarGrupo(id) {
    let grupos = JSON.parse(localStorage.getItem('grupos')) || [];

    // Buscar el grupo por su ID
    let grupo = grupos.find(g => g.id === id);

    if (!grupo) {
        Swal.fire('Error', 'Grupo no encontrado.', 'error');
        return;
    }

    Swal.fire({
        title: 'Editar Grupo',
        input: 'text',
        inputValue: grupo.nombre,  // Usamos el nombre del grupo para la edición
        showCancelButton: true,
        confirmButtonText: 'Guardar',
        cancelButtonText: 'Cancelar',
        inputValidator: (value) => {
            if (!value) {
                return 'El nombre del grupo no puede estar vacío';
            }
        }
    }).then((result) => {
        if (result.isConfirmed) {
            grupo.nombre = result.value;  // Actualizamos el nombre del grupo
            localStorage.setItem('grupos', JSON.stringify(grupos));  // Guardamos los cambios en el localStorage
            misGrupos();  // Recargar la lista de grupos
            Swal.fire('Guardado', 'El grupo ha sido actualizado.', 'success');
        }
    });
}

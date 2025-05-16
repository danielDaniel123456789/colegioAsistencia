function editarTarea(estudianteId) {
    // Obtener los estudiantes del localStorage
    const estudiantes = JSON.parse(localStorage.getItem('students')) || [];

    // Buscar al estudiante con el ID proporcionado
    const estudiante = estudiantes.find(est => est.id === estudianteId);

    if (!estudiante) {
        Swal.fire('Error', 'Estudiante no encontrado.', 'error');
        return;
    }

    // Crear el formulario HTML para editar las tareas
    let tareasFormHTML = '<form id="formEditarTareas">';
    
    // Generar campos de entrada para cada tarea
    estudiante.tareas.forEach(tarea => {
        tareasFormHTML += `
            <div class="mb-3">
                <label for="tarea_${tarea.id}" class="form-label">Tarea ${tarea.id}:</label>
                <input type="number" class="form-control" id="tarea_${tarea.id}" value="${tarea.puntos || tarea.score}" required>
            </div>
        `;
    });

    tareasFormHTML += '</form>';

    // Mostrar el formulario de edición con SweetAlert2
    Swal.fire({
        title: `Editar Tareas de ${estudiante.name}`,
        html: tareasFormHTML,
        showCancelButton: true,
        confirmButtonText: 'Guardar cambios',
        cancelButtonText: 'Cancelar',
        preConfirm: () => {
            // Recoger los valores de los inputs
            const updatedTareas = estudiante.tareas.map(tarea => {
                const input = document.getElementById(`tarea_${tarea.id}`);
                if (input) {
                    tarea.puntos = input.value; // Modificar los puntos de la tarea
                }
                return tarea;
            });

            // Actualizar el estudiante con las nuevas tareas
            estudiante.tareas = updatedTareas;

            // Actualizar el listado de estudiantes en el localStorage
            const index = estudiantes.findIndex(est => est.id === estudianteId);
            if (index !== -1) {
                estudiantes[index] = estudiante;
                localStorage.setItem('students', JSON.stringify(estudiantes));
            }
        }
    }).then(result => {
        if (result.isConfirmed) {
            // Mostrar mensaje de éxito
            Swal.fire('Éxito', 'Las tareas han sido actualizadas correctamente.', 'success');
        }
    });
}

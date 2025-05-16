function eliminarTarea(estudianteId) {
    Swal.fire({
        title: 'Eliminar Tarea',
        text: `¿Estás seguro de que deseas eliminar las tareas de este estudiante? ID: ${estudianteId}`,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Eliminar',
        cancelButtonText: 'Cancelar',
        reverseButtons: true
    }).then(result => {
        if (result.isConfirmed) {
            // Obtener los estudiantes del localStorage
            const estudiantes = JSON.parse(localStorage.getItem('students')) || [];

            // Buscar al estudiante con el ID proporcionado
            const estudiante = estudiantes.find(est => est.id === estudianteId);

            if (!estudiante) {
                Swal.fire('Error', 'Estudiante no encontrado.', 'error');
                return;
            }

            // Eliminar las tareas del estudiante
            estudiante.tareas = [];

            // Actualizar el listado de estudiantes en el localStorage
            const index = estudiantes.findIndex(est => est.id === estudianteId);
            if (index !== -1) {
                estudiantes[index] = estudiante;
                localStorage.setItem('students', JSON.stringify(estudiantes));
            }

            // Mostrar mensaje de éxito
            Swal.fire('Eliminado', 'Las tareas han sido eliminadas correctamente.', 'success');
        }
    });
}

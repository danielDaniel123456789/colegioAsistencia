function deleteTrabajoCotidiano(index, workIndex) {
    const students = JSON.parse(localStorage.getItem('students')) || [];
    const student = students[index];

    // Verificar si el estudiante tiene trabajos cotidianos
    if (!student.trabajoCotidiano || student.trabajoCotidiano.length === 0) {
        Swal.fire('No hay trabajos cotidianos', 'Este estudiante no tiene trabajos cotidianos registrados.', 'info');
        return;
    }

    // Confirmación de eliminación
    Swal.fire({
        title: '¿Estás seguro?',
        text: 'Esta acción no se puede deshacer.',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Sí, eliminar',
        cancelButtonText: 'Cancelar'
    }).then((result) => {
        if (result.isConfirmed) {
            // Eliminar el trabajo cotidiano en la posición especificada
            student.trabajoCotidiano.splice(workIndex, 1);

            // Actualizar la lista de estudiantes
            students[index] = student;
            localStorage.setItem('students', JSON.stringify(students));

            // Notificar al usuario que el trabajo cotidiano ha sido eliminado
            Swal.fire('Trabajo Cotidiano Eliminado', 'El trabajo cotidiano ha sido eliminado correctamente.', 'success')
                .then(() => {
                    // Recargar el informe actualizado
                    abrirInformeCotidiano(index, student.lastSelectedMateria);
                });
        }
    });
}

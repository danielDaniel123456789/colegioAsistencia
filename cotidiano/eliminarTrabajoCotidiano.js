// Función para eliminar un trabajo cotidiano con confirmación
function eliminarTrabajoCotidiano(trabajoIndex, studentId) {
    // Usar SweetAlert2 para confirmar la eliminación
    Swal.fire({
        title: '¿Estás seguro?',
        text: "Esta acción no se puede deshacer.",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Sí, eliminar',
        cancelButtonText: 'Cancelar',
        reverseButtons: true
    }).then(result => {
        if (result.isConfirmed) {
            const students = JSON.parse(localStorage.getItem('students')) || [];
            const student = students.find(st => st.id === studentId);

            if (student) {
                // Eliminar el trabajo cotidiano del array
                student.trabajoCotidiano.splice(trabajoIndex, 1);
                
                // Actualizar el localStorage con los nuevos datos
                localStorage.setItem('students', JSON.stringify(students));

                // Recargar el informe
                informeTrabajoCotidiano(studentId);

                // Mostrar mensaje de éxito
                Swal.fire('Eliminado', 'El trabajo cotidiano ha sido eliminado.', 'success');
            }
        }
    });
}

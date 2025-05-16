// Función para eliminar el estudiante con confirmación por ID
function deleteStudent(studentId) {
    console.log("Eliminando estudiante con ID:", studentId); // Para depuración
    Swal.fire({
        title: '¿Estás seguro?',
        text: "¡No podrás revertir esta acción!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Sí, eliminar',
        cancelButtonText: 'Cancelar',
        reverseButtons: true
    }).then((result) => {
        if (result.isConfirmed) {
            let students = JSON.parse(localStorage.getItem('students')) || [];

            // Verificar si existe un estudiante con ese ID
            const exists = students.some(student => student.id === studentId);

            if (!exists) {
                Swal.fire('No encontrado', 'No se encontró ningún estudiante con ese ID.', 'error');
                return;
            }

            // Filtrar los estudiantes para eliminar el que tiene el ID correspondiente
            const updatedStudents = students.filter(student => student.id !== studentId);

            // Actualizar el localStorage
            localStorage.setItem('students', JSON.stringify(updatedStudents));

            Swal.fire('Eliminado', 'El estudiante ha sido eliminado correctamente.', 'success');
            loadStudents(); // Recargar la lista de estudiantes
        }
    });
}

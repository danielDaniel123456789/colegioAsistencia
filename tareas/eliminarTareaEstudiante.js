function eliminarTareaEstudiante(studentId, tareaId) {
    const students = JSON.parse(localStorage.getItem('students')) || [];
    const student = students.find(s => s.id === studentId);

    if (!student) return;

    Swal.fire({
        title: '¿Eliminar tarea?',
        text: 'Esta acción no se puede deshacer',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Sí, eliminar',
        cancelButtonText: 'Cancelar'
    }).then(result => {
        if (result.isConfirmed) {
            student.tareas = student.tareas.filter(t => t.id !== tareaId);
            localStorage.setItem('students', JSON.stringify(students));
            Swal.fire('Eliminado', 'La tarea ha sido eliminada.', 'success');
            verTareasEstudiante(studentId);
        }
    });
}

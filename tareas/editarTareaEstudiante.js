function editarTareaEstudiante(studentId, tareaId) {
    const students = JSON.parse(localStorage.getItem('students')) || [];
    const student = students.find(s => s.id === studentId);
    
    if (!student) {
        Swal.fire('Error', 'Estudiante no encontrado', 'error');
        return;
    }

    // Buscar la tarea específica
    const tarea = student.tareas.find(t => t.id === tareaId);
    
    if (!tarea) {
        Swal.fire('Error', 'Tarea no encontrada', 'error');
        return;
    }

    // Crear un formulario para editar los puntos de la tarea
    Swal.fire({
        title: `Editar Puntos - Tarea ${tarea.id}`,
        html: `
            <label for="puntos">Puntos:</label>
            <input type="number" id="puntos" class="form-control" value="${tarea.puntos || tarea.score || ''}" min="0">
        `,
        showCancelButton: true,
        confirmButtonText: 'Guardar',
        cancelButtonText: 'Cancelar',
        preConfirm: () => {
            const puntos = document.getElementById('puntos').value;
            if (puntos === '' || isNaN(puntos) || puntos < 0) {
                Swal.showValidationMessage('Por favor ingrese un puntaje válido');
                return false;
            }
            return puntos;
        }
    }).then((result) => {
        if (result.isConfirmed) {
            const puntosActualizados = parseInt(result.value);

            // Actualizar los puntos de la tarea
            tarea.puntos = puntosActualizados;

            // Guardar los estudiantes actualizados en localStorage
            localStorage.setItem('students', JSON.stringify(students));

            Swal.fire('Éxito', 'Los puntos de la tarea han sido actualizados correctamente.', 'success');

            // Refrescar la vista de las tareas
            viewTasks(studentId);
        }
    });
}

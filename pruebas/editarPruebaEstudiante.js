
// Función para editar los puntos de una prueba específica del estudiante
function editarPruebaEstudiante(studentId, pruebaId) {
    const students = JSON.parse(localStorage.getItem('students')) || [];
    const student = students.find(s => s.id === studentId);
    
    if (!student) {
        Swal.fire('Error', 'Estudiante no encontrado', 'error');
        return;
    }

    // Buscar la prueba específica
    const prueba = student.pruebas.find(p => p.id === pruebaId);
    
    if (!prueba) {
        Swal.fire('Error', 'Prueba no encontrada', 'error');
        return;
    }

    // Crear un formulario para editar los puntos de la prueba
    Swal.fire({
        title: `Editar Puntos - Prueba ${prueba.id}`,
        html: `
            <label for="puntos">Puntos:</label>
            <input type="number" id="puntos" class="form-control" value="${prueba.puntos || ''}" min="0">
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
            const puntosActualizados = result.value;

            // Actualizar los puntos de la prueba
            prueba.puntos = parseInt(puntosActualizados);

            // Guardar los estudiantes actualizados en localStorage
            localStorage.setItem('students', JSON.stringify(students));

            Swal.fire('Éxito', 'Los puntos de la prueba han sido actualizados correctamente.', 'success');

            // Refrescar la vista de las pruebas
            viewPruebas(studentId);
        }
    });
}

function editarPrueba(estudianteId) {
    // Recuperar los estudiantes desde localStorage
    const estudiantes = JSON.parse(localStorage.getItem('students')) || [];
    
    // Encontrar el estudiante por su ID
    const estudiante = estudiantes.find(est => est.id === estudianteId);
    
    if (!estudiante) {
        Swal.fire('Error', 'Estudiante no encontrado', 'error');
        return;
    }

    // Crear un formulario de edición para las pruebas del estudiante
    let pruebasHTML = '';
    estudiante.pruebas.forEach(prueba => {
        pruebasHTML += `
            <div class="form-group">
                <label for="prueba${prueba.id}">Prueba ${prueba.id} (${prueba.date})</label>
                <input type="number" id="prueba${prueba.id}" class="form-control" value="${prueba.puntos}" min="0" />
            </div>
        `;
    });

    // Mostrar el formulario de edición usando SweetAlert
    Swal.fire({
        title: `Editar Pruebas - ${estudiante.name}`,
        html: pruebasHTML,
        showCancelButton: true,
        confirmButtonText: 'Guardar cambios',
        cancelButtonText: 'Cancelar',
        preConfirm: () => {
            // Validar los campos de prueba
            let puntosActualizados = [];
            estudiante.pruebas.forEach(prueba => {
                const puntos = document.getElementById(`prueba${prueba.id}`).value;
                if (puntos === '' || isNaN(puntos) || puntos < 0) {
                    Swal.showValidationMessage(`Por favor ingrese un puntaje válido para la prueba ${prueba.id}`);
                    return false;
                }
                puntosActualizados.push({ id: prueba.id, puntos: parseInt(puntos) });
            });
            return puntosActualizados;
        }
    }).then((result) => {
        if (result.isConfirmed) {
            const puntosActualizados = result.value;

            // Actualizar los puntos de las pruebas del estudiante
            puntosActualizados.forEach(puntos => {
                const pruebaEstudiante = estudiante.pruebas.find(p => p.id === puntos.id);
                if (pruebaEstudiante) {
                    pruebaEstudiante.puntos = puntos.puntos;
                }
            });

            // Guardar los estudiantes actualizados en localStorage
            localStorage.setItem('students', JSON.stringify(estudiantes));

            Swal.fire('Éxito', 'Los puntos de las pruebas han sido actualizados correctamente.', 'success');
        }
    });
}

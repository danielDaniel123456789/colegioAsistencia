function editarTrabajoCotidiano(tareaIndex, studentId) {
    // Obtener los datos de localStorage
    const students = JSON.parse(localStorage.getItem('students')) || [];
    const student = students.find(st => Number(st.id) === Number(studentId));
    if (!student) {
        Swal.fire({
            title: "No hay datos",
            text: "No se encontró el estudiante.",
            icon: "error",
        });
        return;
    }

    const tarea = student.trabajoCotidiano[tareaIndex];
    if (!tarea) {
        Swal.fire({
            title: "Error",
            text: "No se encontró la tarea.",
            icon: "error",
        });
        return;
    }

    // Crear el HTML para el formulario de edición con un select para los puntos
    Swal.fire({
        title: 'Editar Tarea',
        html: `
        <h5>${tarea.date}</h5>
            <input id="fecha" class="swal2-input" value="${tarea.date}" placeholder="Fecha" hidden >
            <select id="puntos" class="swal2-input">
                <option value="0" ${tarea.type === '0' ? 'selected' : ''}>0 - No hubo participación</option>
                <option value="1" ${tarea.type === '1' ? 'selected' : ''}>1 - Baja participación</option>
                <option value="2" ${tarea.type === '2' ? 'selected' : ''}>2 - Participación parcial</option>
                <option value="3" ${tarea.type === '3' ? 'selected' : ''}>3 - Participación activa</option>
            </select>
        `,
        focusConfirm: false,
        preConfirm: () => {
            const newDate = document.getElementById('fecha').value;
            const newPuntos = document.getElementById('puntos').value;
            
            if (newDate && newPuntos) {
                // Actualizar los datos de la tarea
                student.trabajoCotidiano[tareaIndex].date = newDate;
                student.trabajoCotidiano[tareaIndex].type = newPuntos;

                // Guardar los datos actualizados en localStorage
                localStorage.setItem('students', JSON.stringify(students));

                Swal.fire('Tarea actualizada', 'La tarea ha sido actualizada correctamente.', 'success');
                return;
            } else {
                Swal.fire('Error', 'Por favor, complete todos los campos.', 'error');
            }
        }
    });
}

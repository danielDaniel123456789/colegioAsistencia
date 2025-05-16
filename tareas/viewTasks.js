function viewTasks(studentId) {
    console.log("ID recibido:", studentId);
    const students = JSON.parse(localStorage.getItem('students')) || [];
    const grupos = JSON.parse(localStorage.getItem('grupos')) || [];
    const materiasList = JSON.parse(localStorage.getItem('materias')) || [];
    
    let nombreGrupo = "Grupo no encontrado";

    // Buscar el estudiante por ID
    const student = students.find(s => s.id == studentId);

    if (!student) {
        console.log("Estudiante no encontrado.");
        Swal.fire('Error', 'Estudiante no encontrado', 'error');
        return;
    }

    console.log("Estudiante encontrado:", student);

    // Buscar el grupo del estudiante
    const grupo = grupos.find(g => g.id == student.groupId);
    if (grupo) {
        nombreGrupo = grupo.nombre;
    }

    // Verificar si el estudiante tiene tareas registradas
    if (!student.tareas || student.tareas.length === 0) {
        Swal.fire('Sin Tareas', `${student.name} no tiene tareas registradas.`, 'info');
        return;
    }

    // Obtener el nombre de la materia (usando la primera tarea como referencia)
    const firstMateria = materiasList.find(m => m.id == student.tareas[0].materiaId);
    const materiaNombre = firstMateria ? firstMateria.nombre : "Materia Desconocida";

    // Crear el contenido HTML para la tabla de tareas
    let taskDetails = `
        <table class="table table-bordered">
            <thead>
                <tr>
                    <th>Puntos</th>
                    <th>Fecha de Entrega</th>
                    <th>Acciones</th>
                </tr>
            </thead>
            <tbody>
    `;

    student.tareas.forEach(tarea => {
        taskDetails += `
            <tr>
                <td>${tarea.puntos || tarea.score || "N/A"}</td>
                <td>${tarea.date}</td>
                <td>
                    <button class="btn btn-warning btn-sm" onclick="editarTareaEstudiante(${student.id}, ${tarea.id})">Editar</button>
         
                  <button class="btn btn-danger btn-sm" onclick="eliminarTareaEstudiante(${studentId}, ${tarea.id})">X</button>
                      </td>
            </tr>
        `;
    });

    taskDetails += `</tbody></table>`;

    // Mostrar SweetAlert2 con el resumen de tareas
    Swal.fire({
        html: `
        <br>
        <h5>Resumen de Tareas - ${student.name}</h5>
        <h6>Materia: ${materiaNombre} | Grupo: ${nombreGrupo}</h6>
        ${taskDetails}
        `,
        showCancelButton: true,
        cancelButtonText: 'Cerrar',
        focusConfirm: false
    });
}



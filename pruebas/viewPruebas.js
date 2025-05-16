function viewPruebas(studentId) {
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

    // Verificar si el estudiante tiene pruebas registradas
    if (!student.pruebas || student.pruebas.length === 0) {
        Swal.fire('Sin Pruebas', `${student.name} no tiene pruebas registradas.`, 'info');
        return;
    }

    // Obtener el nombre de la materia (usando la primera prueba como referencia)
    const firstMateria = materiasList.find(m => m.id == student.pruebas[0].materiaId);
    const materiaNombre = firstMateria ? firstMateria.nombre : "Materia Desconocida";

    // Crear el contenido HTML para la tabla de pruebas
    let testDetails = `
        <table class="table table-bordered">
            <thead>
                <tr>
                    <th>Puntos</th>
                    <th>Fecha</th>
                    <th>Acciones</th>
                </tr>
            </thead>
            <tbody>
    `;

    student.pruebas.forEach(prueba => {
        testDetails += `
            <tr>
                <td>${prueba.puntos || "N/A"}</td>
                <td>${prueba.date}</td>
                <td>
                    <button class="btn btn-warning btn-sm" onclick="editarPruebaEstudiante(${student.id}, ${prueba.id})">Editar</button>
                </td>
            </tr>
        `;
    });

    testDetails += `</tbody></table>`;

    // Mostrar SweetAlert2 con el resumen de pruebas
    Swal.fire({
        html: `
        <br>
        <h5>Resumen de Pruebas - ${student.name}</h5>
        <h6>Materia: ${materiaNombre} | Grupo: ${nombreGrupo}</h6>
        ${testDetails}
        `,
        showCancelButton: true,
        cancelButtonText: 'Cerrar',
        focusConfirm: false
    });
}

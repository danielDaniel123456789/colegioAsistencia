function resumeCotidianoMes(studentId, mes) {
    const students = JSON.parse(localStorage.getItem('students')) || [];
    const grupos = JSON.parse(localStorage.getItem('grupos')) || [];
    const materias = JSON.parse(localStorage.getItem('materias')) || [];

    const student = students.find(st => Number(st.id) === Number(studentId));
    if (!student) {
        Swal.fire({
            title: "No hay datos",
            text: "No se encontró el estudiante.",
            icon: "error",
        });
        return;
    }

    const materia = materias.find(m => Number(m.id) === Number(student.materiaId));
    const nomBreMateria = materia ? materia.nombre : "Materia no encontrada";

    let nombreGrupo = "Grupo no encontrado";
    const grupo = grupos.find(gr => Number(gr.id) === Number(student.groupId));
    if (grupo) {
        nombreGrupo = grupo.nombre;
    }

    let tareasDetails = `
        <h6>0 = No hubo participación </h6>
        <h6>1 = Baja participación de la clase </h6>
        <h6>2 = Participación parcial </h6>
        <h6>3 = Participación Activa durante la clase </h6>
        <hr>
        <div style="margin-bottom: 10px;">
            <button class="btn btn-secondary" onclick="Swal.close()">Salir</button>
        </div>
        <table class="table table-bordered">
            <thead>
                <tr>
                    <th>Fecha</th>
                    <th>Puntos</th>
                    <th>Editar</th>
                </tr>
            </thead>
            <tbody>
    `;

    let tareasFiltradas = [];

    if (Array.isArray(student.trabajoCotidiano)) {
        tareasFiltradas = student.trabajoCotidiano.filter(tarea =>
            tarea.date && tarea.date.split("-")[1] === mes
        );

        // Ordenar por fecha descendente (más reciente primero)
        tareasFiltradas.sort((a, b) => new Date(b.date) - new Date(a.date));
    }

    if (tareasFiltradas.length > 0) {
        tareasFiltradas.forEach((tarea, tareaIndex) => {
            const puntosClass = Number(tarea.type) === 0 ? 'text-danger fw-bold' : '';
            tareasDetails += `
            <tr>
                <td>${tarea.date}</td>
                <td class="${puntosClass}">${tarea.type}</td>
                <td>
                    <button class="btn btn-primary btn-sm"
                        onclick="editarTrabajoCotidiano(${tareaIndex}, ${student.id})">Editar</button>
                </td>
            </tr>
            `;
        });
    } else {
        tareasDetails += `
            <tr>
                <td colspan="3" class="text-center">No se encontraron tareas en ese mes.</td>
            </tr>
        `;
    }

    tareasDetails += `</tbody></table>`;

    Swal.fire({
        html: `
            <br>
            <h4>Trabajo Cotidiano / Tareas</h4>
            <hr>
            <h6>Estudiante: ${student.name}</h6>
            <h6>Grupo: ${nombreGrupo}</h6>
            <h6>Materia: ${nomBreMateria}</h6>
            <hr>
            ${tareasDetails}
        `,
        showCancelButton: true,
        cancelButtonText: 'Cancelar',
        showCloseButton: true,
    });
}

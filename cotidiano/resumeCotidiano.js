function resumeCotidiano(index) {
    const students = JSON.parse(localStorage.getItem('students')) || [];
    const grupos = JSON.parse(localStorage.getItem('grupos')) || [];
    const materias = JSON.parse(localStorage.getItem('materias')) || [];

    const student = students.find(st => Number(st.id) === Number(index));
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

    Swal.fire({
        title: 'Seleccione un mes',
        html: `
            <select id="mesSelect" class="swal2-select">
                <option value="">-- Seleccione --</option>
                <option value="01">Enero</option>
                <option value="02">Febrero</option>
                <option value="03">Marzo</option>
                <option value="04">Abril</option>
                <option value="05">Mayo</option>
                <option value="06">Junio</option>
                <option value="07">Julio</option>
                <option value="08">Agosto</option>
                <option value="09">Septiembre</option>
                <option value="10">Octubre</option>
                <option value="11">Noviembre</option>
                <option value="12">Diciembre</option>
            </select>
        `,
        confirmButtonText: 'Filtrar',
        showCancelButton: true,
        preConfirm: () => {
            const mes = document.getElementById('mesSelect').value;
            if (!mes) {
                Swal.showValidationMessage('Debe seleccionar un mes');
            }
            return mes;
        }
    }).then(result => {
        if (!result.isConfirmed) return;
        const mesSeleccionado = result.value;

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
                tarea.date && tarea.date.split("-")[1] === mesSeleccionado
            );

            // Ordenar por fecha descendente
            tareasFiltradas.sort((a, b) => new Date(b.date) - new Date(a.date));
        }

        if (tareasFiltradas.length > 0) {
            tareasFiltradas.forEach((tarea, tareaIndex) => {
                const puntosClass = Number(tarea.type) === 0 ? 'text-white fw-bold bg-danger' : '';
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
    });
}

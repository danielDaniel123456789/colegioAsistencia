function viewAbsences(studentId) {
    const students = JSON.parse(localStorage.getItem('students')) || [];
    const grupos = JSON.parse(localStorage.getItem('grupos')) || [];
    const materiasList = JSON.parse(localStorage.getItem('materias')) || [];

    const student = students.find(s => Number(s.id) === Number(studentId));
    if (!student) {
        Swal.fire('Error', 'Estudiante no encontrado', 'error');
        return;
    }

    const grupo = grupos.find(g => Number(g.id) === Number(student.groupId));
    const nombreGrupo = grupo ? grupo.nombre : "Grupo no encontrado";

    // Paso 1: Seleccionar mes
    Swal.fire({
        title: 'Seleccione el mes',
        input: 'select',
        inputOptions: new Map([
            ['01', 'Enero'],
            ['02', 'Febrero'],
            ['03', 'Marzo'],
            ['04', 'Abril'],
            ['05', 'Mayo'],
            ['06', 'Junio'],
            ['07', 'Julio'],
            ['08', 'Agosto'],
            ['09', 'Septiembre'],
            ['10', 'Octubre'],
            ['11', 'Noviembre'],
            ['12', 'Diciembre']
        ]),
        inputPlaceholder: 'Mes',
        showCancelButton: true,
        confirmButtonText: 'Ver ausencias'
    }).then(result => {
        if (!result.isConfirmed) return;

        const selectedMonth = result.value;

        // Emojis según tipo
        const getAbsenceEmoji = (type) => {
            switch (type) {
                case '4': return '✅'; // Presente
                case '3': return '✔️'; // Justificada
                case '2': return '✔️'; // Tardía justificada
                case '1': return '⏰'; // Tardía no justificada
                case '0': return '❌'; // Ausente
                default: return '';
            }
        };

        const filteredAbsences = Array.isArray(student.absences)
            ? student.absences.filter(abs => abs.date?.split?.('-')[1] === selectedMonth)
            : [];

        if (filteredAbsences.length === 0) {
            Swal.fire('Sin datos', 'No hay ausencias registradas para ese mes.', 'info');
            return;
        }

        let absenceDetails = `
            <h6>4 = Presente ✅</h6>
            <h6>3 = Ausencia Justificada ✔️</h6>
            <h6>2 = Tardía justificada ✔️</h6>
            <h6>1 = Tardía no justificada ⏰</h6>
            <h6>0 = Ausencia no justificada ❌</h6>
              <button class="btn btn-secondary" onclick="Swal.close()">Salir</button>
            <hr>
            <table class="table table-bordered">
                <thead>
                    <tr>
                        <th>Fecha</th>
                        <th>Tipo</th>
                        <th>⚖️</th>
                        <th>Acción</th>
                    </tr>
                </thead>
                <tbody>
        `;

        filteredAbsences.forEach((absence, index) => {
            const materia = materiasList.find(m => m.id === parseInt(absence.materiaId));
            const nombreMateria = materia ? materia.nombre : 'Materia desconocida';
            absenceDetails += `
                <tr>
                    <td>${absence.date}</td>
                    <td>${absence.type}</td>
                    <td>${getAbsenceEmoji(absence.type)}</td>
                    <td>
                        <button class="btn btn-success btn-sm" onclick="editAbsence(${studentId}, ${index}, ${absence.id})">✏️</button>
                        <button class="btn btn-danger btn-sm" onclick="deleteAbsence(${studentId}, ${absence.id})">X</button>
                    </td>
                </tr>
            `;
        });

        absenceDetails += `</tbody></table>`;

        Swal.fire({
            html: `
                <br>
                <h4>Ausencias</h4>
                <hr>
                <h6>Estudiante: ${student.name}</h6>
                <h6>Grupo: ${nombreGrupo}</h6>
                ${absenceDetails}
            `,
            showCancelButton: true,
            cancelButtonText: 'Cerrar',
            showCloseButton: true,
            focusConfirm: false
        });
    });
}

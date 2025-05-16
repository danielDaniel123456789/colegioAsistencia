function viewAbsencesRecargar(index, materia) {
    const students = JSON.parse(localStorage.getItem('students')) || [];
    const student = students[index];

    // Filtrar las ausencias por la materia recibida como parámetro
    const filteredAbsences = student.absences.filter(absence => absence.materia === materia);

    if (filteredAbsences.length === 0) {
        Swal.fire('No hay ausencias registradas', `Este estudiante no tiene ausencias registradas para la materia: ${materia}.`, 'info');
    } else {
        let absenceDetails = `
            <button class="btn btn-info mb-3" onclick="copyStudentData(${index})">Pasar a Excel</button>
            <button class="btn btn-info mb-3" onclick="copyStudentPadre(${index})">Informe al padre</button>
            <table class="table table-bordered">
                <thead>
                    <tr>
                        <th>Fecha</th>
                        <th>Tipo</th>
                        <th>Acción</th>
                    </tr>
                </thead>
                <tbody>
        `;

        filteredAbsences.forEach((absence, absenceIndex) => {
            absenceDetails += `
                <tr>
                    <td>${absence.date}</td>
                    <td>${absence.type}</td>
                    <td>
                        <button class="btn btn-success btn-sm" onclick="editAbsence(${index}, ${absenceIndex})">✏️</button>
                        <button class="btn btn-danger btn-sm" onclick="deleteAbsence(${index}, ${absenceIndex})">X</button>
                    </td>
                </tr>
            `;
        });

        absenceDetails += `</tbody></table>`;

        Swal.fire({
            title: `Informe de Ausencias de ${student.name} ${student.surname} - ${materia}`,
            html: absenceDetails,
            showCancelButton: true,
            cancelButtonText: 'Cerrar',
            focusConfirm: false
        });
    }
}

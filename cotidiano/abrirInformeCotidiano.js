function abrirInformeCotidiano(index, materia) {
    const students = JSON.parse(localStorage.getItem('students')) || [];
    const student = students[index];

    // Obtener todos los trabajos cotidianos del estudiante
    const trabajosCotidianos = student.trabajoCotidiano || [];

    // Filtrar los trabajos cotidianos por la materia que se pasa como parámetro
    const filteredTrabajoCotidiano = trabajosCotidianos.filter(work => work.materia === materia);

    if (filteredTrabajoCotidiano.length === 0) {
        Swal.fire('No hay registros', `Este estudiante no tiene trabajos cotidianos registrados para la materia ${materia}.`, 'info');
    } else {
        let trabajoCotidianoDetails = `
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

        filteredTrabajoCotidiano.forEach((work, workIndex) => {
            trabajoCotidianoDetails += `
                <tr>
                    <td>${work.date}</td>
                    <td>${work.type}</td>
                    <td>
                        <button class="btn btn-success btn-sm" onclick="editTrabajoCotidiano(${index}, ${workIndex})">
                        ✏️ </button>
                        <button class="btn btn-danger btn-sm" onclick="deleteTrabajoCotidiano(${index}, ${workIndex})">X</button>
                    </td>
                </tr>
            `;
        });

        trabajoCotidianoDetails += `</tbody></table>`;

        Swal.fire({
            title: `Informe de Trabajo Cotidiano de ${student.name} ${student.surname} - ${materia}`,
            html: trabajoCotidianoDetails,
            showCancelButton: true,
            cancelButtonText: 'Cancelar',
            focusConfirm: false
        });
    }
}

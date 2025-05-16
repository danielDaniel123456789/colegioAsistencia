

function datosGenerales() {
    Swal.fire({
        title: 'Datos Generales',
        text: 'Se ejecutarán los informes en orden.',
        icon: 'info',
        showCancelButton: true,
        confirmButtonText: 'OK',
        cancelButtonText: 'Cancelar'
    }).then((result) => {
        if (result.isConfirmed) {
            solicitarDatosYEjecutar();
        }
    });
}

function solicitarDatosYEjecutar() {
    let grupos = JSON.parse(localStorage.getItem('grupos') || '[]');
    let materias = JSON.parse(localStorage.getItem('materias') || '[]');
    let students = JSON.parse(localStorage.getItem('students') || '[]');

    if (grupos.length === 0 || materias.length === 0) {
        Swal.fire('Información', 'No hay grupos o materias disponibles.', 'info');
        return;
    }

    let grupoOptions = grupos.map(g => `<option value="${g.id}">${g.nombre}</option>`).join('');
    let materiaOptions = materias.map(m => `<option value="${m.id}">${m.nombre}</option>`).join('');

    Swal.fire({
        title: 'Selecciona Grupo y Materia',
        html: `
            <select id="grupo" class="form-select">
                <option value="" disabled selected>Selecciona un grupo</option>
                ${grupoOptions}
            </select>
            <br>
            <select id="materia" class="form-select">
                <option value="" disabled selected>Selecciona una materia</option>
                ${materiaOptions}
            </select>
        `,
        focusConfirm: false,
        showCancelButton: true,
        cancelButtonText: 'Cancelar',
        confirmButtonText: 'Continuar',
        preConfirm: () => {
            const groupId = document.getElementById('grupo').value;
            const materiaId = document.getElementById('materia').value;

            if (!groupId || !materiaId) {
                Swal.showValidationMessage('Debe seleccionar un grupo y una materia');
                return false;
            }

            const selectedStudents = students.filter(s => s.groupId === groupId && s.materiaId === materiaId);

            if (selectedStudents.length === 0) {
                Swal.showValidationMessage('No hay estudiantes en este grupo y materia');
                return false;
            }

            return { groupId, materiaId, students: selectedStudents };
        }
    }).then((result) => {
        if (result.isConfirmed) {
            ejecutarAmbasCalificaciones(result.value.groupId, result.value.materiaId, result.value.students);
        }
    });
}

function ejecutarAmbasCalificaciones(groupId, materiaId, students) {
    ejecutarCalificacion('4', 'Asistencia del Año', groupId, materiaId, students).then(() => {
        return ejecutarCalificacion('3', 'Trabajo Cotidiano del Año', groupId, materiaId, students);
    }).catch(error => {
        console.error("Error en la ejecución de informes:", error);
    });
}

function ejecutarCalificacion(tipo, titulo, groupId, materiaId, students) {
    return new Promise((resolve, reject) => {
        const currentYear = new Date().getFullYear();
        const datesInYear = [];

        for (let m = 0; m < 12; m++) {
            let daysInMonth = new Date(currentYear, m + 1, 0).getDate();
            for (let day = 1; day <= daysInMonth; day++) {
                datesInYear.push(`${currentYear}-${(m + 1).toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`);
            }
        }

        students.forEach(student => {
            let key = tipo === '4' ? 'absences' : 'trabajoCotidiano';
            student[key] = student[key] || [];
            datesInYear.forEach(date => {
                student[key].push({
                    id: Date.now() + Math.floor(Math.random() * 1000),
                    type: tipo,
                    materiaId: materiaId,
                    grupoId: groupId,
                    date: date
                });
            });
        });

        localStorage.setItem('students', JSON.stringify(students));

        Swal.fire('Guardado', `${titulo} registrada correctamente para todos los estudiantes`, 'success').then(() => {
            resolve();
        });
    });
}

function xxxxxxcalificarAsistenciaDelAyo() {
    // Cargar los grupos, materias y estudiantes desde el localStorage de forma segura
    let grupos = localStorage.getItem('grupos') ? JSON.parse(localStorage.getItem('grupos')) : [];
    let materias = localStorage.getItem('materias') ? JSON.parse(localStorage.getItem('materias')) : [];
    let students = localStorage.getItem('students') ? JSON.parse(localStorage.getItem('students')) : [];

    // Verificar si hay grupos, materias y estudiantes disponibles
    if (grupos.length === 0) {
        Swal.fire('Información', 'No hay grupos disponibles. Por favor, agregue un grupo primero.', 'info');
        return;
    }

    if (materias.length === 0) {
        Swal.fire('Información', 'No hay materias disponibles. Por favor, agregue una materia primero.', 'info');
        return;
    }

    if (students.length === 0) {
        Swal.fire('Información', 'No hay estudiantes disponibles. Por favor, agregue estudiantes primero.', 'info');
        return;
    }

    // Crear las opciones del selector de grupos
    let grupoOptions = grupos.map(grupo => `<option value="${grupo.id}">${grupo.nombre}</option>`).join('');

    // Crear las opciones del selector de materias
    let materiaOptions = materias.map(materia => `<option value="${materia.id}">${materia.nombre}</option>`).join('');

    // Abrir SweetAlert para calificar asistencia del año
    Swal.fire({
        title: 'Calificar Asistencia del Año',
        html: ` 
            <select id="asistenciaGrupo" class="form-select">
                <option value="" disabled selected>Selecciona un grupo</option>
                ${grupoOptions}
            </select>
            <br>
            <select id="asistenciaMateria" class="form-select">
                <option value="" disabled selected>Selecciona una materia</option>
                ${materiaOptions}
            </select>
        `,
        focusConfirm: false,
        showCancelButton: true,
        cancelButtonText: 'Cancelar',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Calificar',
        preConfirm: () => {
            const groupId = document.getElementById('asistenciaGrupo').value;
            const materiaId = document.getElementById('asistenciaMateria').value;

            // Verificar que se haya seleccionado un grupo y materia
            if (!groupId || !materiaId) {
                Swal.showValidationMessage('Debe seleccionar un grupo y una materia');
                return false;
            }

            // Obtener los estudiantes en el grupo y materia seleccionados
            const selectedStudents = students.filter(s => s.groupId === groupId && s.materiaId === materiaId);

            if (selectedStudents.length === 0) {
                Swal.showValidationMessage('No hay estudiantes en este grupo y materia');
                return false;
            }

            // Obtener el número de días de cada mes del año
            const currentYear = new Date().getFullYear();
            const datesInYear = [];

            for (let m = 0; m < 12; m++) {
                let monthDays = [];
                let daysInMonth = new Date(currentYear, m + 1, 0).getDate();
                for (let day = 1; day <= daysInMonth; day++) {
                    monthDays.push(`${currentYear}-${(m + 1).toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`);
                }
                datesInYear.push({ month: m, days: monthDays });
            }

            // Asignar el valor "4" (presente) a todas las fechas de asistencia de los estudiantes seleccionados para todo el año
            selectedStudents.forEach(student => {
                student.absences = student.absences || [];
                
                datesInYear.forEach(month => {
                    month.days.forEach(date => {
                        student.absences.push({
                            id: Date.now() + Math.floor(Math.random() * 1000), // ID único
                            type: "4", // Valor para "presente"
                            materiaId: materiaId,
                            grupoId: groupId,
                            date: date
                        });
                    });
                });
            });

            // Guardar los cambios en el localStorage
            localStorage.setItem('students', JSON.stringify(students));

            return true;
        }
    }).then((result) => {
        if (result.isConfirmed) {
            Swal.fire('Guardado', 'Asistencia del año registrada correctamente para todos los estudiantes', 'success');
        }
    });
}

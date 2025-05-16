function registerAbsence(studentId) {
    const students = JSON.parse(localStorage.getItem('students')) || [];
    const materias = JSON.parse(localStorage.getItem('materias')) || [];
    const grupos = JSON.parse(localStorage.getItem('grupos')) || [];

    const student = students.find(s => s.id === studentId);
    if (!student) {
        Swal.fire('Error', 'Estudiante no encontrado', 'error');
        return;
    }

    const idMateria = Number(student.materiaId);
    const idGrupo = Number(student.groupId);
    const materia = materias.find(m => m.id === idMateria);
    const grupo = grupos.find(g => g.id === idGrupo);

    if (!materia) {
        Swal.fire('Error', 'Materia no encontrada', 'error');
        return;
    }
    if (!grupo) {
        Swal.fire('Error', 'Grupo no encontrado', 'error');
        return;
    }

    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    const currentMonth = currentDate.getMonth();
    const currentDay = currentDate.getDate();
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();

    const months = [
        'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
        'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
    ];

    let dateOptions = '';
    for (let i = 1; i <= daysInMonth; i++) {
        const dateStr = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(i).padStart(2, '0')}`;
        const selected = currentDay === i ? 'selected' : '';
        const displayDate = `${i} de ${months[currentMonth]} ${currentYear}`;
        dateOptions += `<option value="${dateStr}" ${selected}>${displayDate}</option>`;
    }

    dateOptions += `<option value="custom" class="bg-danger text-white">Cargar otra fecha</option>`;

    Swal.fire({
        title: 'Registrar Ausencia',
        html: `
        <h5>Estudiante: ${student.name} ${student.surname}</h5>
        <p><strong>Materia:</strong> ${materia.nombre}</p>
        <p><strong>Grupo:</strong> ${grupo.nombre}</p>
        <label for="absenceDate">Seleccionar fecha:</label>
        <select id="absenceDate" class="swal-input">
            ${dateOptions}
        </select>
        <div id="customDateContainer" style="display: none;">
            <label for="customDate">Fecha personalizada:</label>
            <input type="date" id="customDate" class="swal-input">
        </div>
        <br>
        <label for="absenceType">Seleccionar tipo de ausencia:</label>
        <select id="absenceType" class="swal-input">
            <option value="4">Presente</option>
            <option value="3">Ausencia Justificada</option>
            <option value="2">Tardía Justificada</option>
            <option value="1">Tardía No Justificada (2 = 1 ausencia)</option>
            <option value="0">Ausencia No Justificada</option>
        </select>
        `,
        showCancelButton: true,
        confirmButtonText: 'Guardar',
        didOpen: () => {
            const absenceDate = document.getElementById('absenceDate');
            const customDateContainer = document.getElementById('customDateContainer');

            absenceDate.addEventListener('change', () => {
                customDateContainer.style.display = absenceDate.value === 'custom' ? 'block' : 'none';
            });
        },
        preConfirm: () => {
            const absenceDate = document.getElementById('absenceDate').value;
            const customDate = document.getElementById('customDate').value;
            const type = document.getElementById('absenceType').value;

            const date = (absenceDate === 'custom' && customDate) ? customDate : absenceDate;

            if (!type) {
                Swal.showValidationMessage('Debe seleccionar un tipo de ausencia.');
                return false;
            }

            const lastId = Number(localStorage.getItem('lastAbsenceId')) || 0;
            const newId = lastId + 1;

            const absence = {
                id: newId,
                date,
                type,
                materiaId: idMateria,
                grupoId: idGrupo
            };

            student.absences = student.absences || [];
            student.absences.push(absence);

            localStorage.setItem('students', JSON.stringify(students));
            localStorage.setItem('lastAbsenceId', newId);

            const mes = date.split("-")[1];
          Swal.fire('Guardado', 'Guardado correctamente', 'success');
    }

        
    });
}

function registrarPrueba(studentId) {
    console.log('studentId-----------:', studentId);
    const students = JSON.parse(localStorage.getItem('students')) || [];
    const materias = JSON.parse(localStorage.getItem('materias')) || [];
    const grupos = JSON.parse(localStorage.getItem('grupos')) || [];

    const student = students.find(s => s.id === studentId);

    if (!student) {
        Swal.fire('Error', 'Estudiante no encontrado', 'error');
        return;
    }

    console.log('student-----------:', student);
    
    const idMateria = Number(student.materiaId);
    const idGrupo = Number(student.groupId);

    console.log('idMateria:', idMateria);
    console.log('idGrupo:', idGrupo);

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
    const formattedDate = `${currentDate.getFullYear()}-${(currentDate.getMonth() + 1).toString().padStart(2, '0')}-${currentDate.getDate().toString().padStart(2, '0')}`;

    Swal.fire({
        html: `
        <h5>Registrar Prueba:</h5>
        <strong> Estudiante: </strong><br>
        Nombre: ${student.name}<br>
        ID: ${student.id}<br>
        Grupo: ${grupo.nombre}<br>
        Materia: ${materia.nombre}<br><br>
        <label for="testDate">Seleccionar fecha:</label>
        <input type="date" id="testDate" class="form-control" value="${formattedDate}">
        <br>
        <label for="testScore">Puntaje obtenido:</label>
        <input type="number" id="testScore" class="form-control" min="0" max="100">
        `,
        showCancelButton: true,
        confirmButtonText: 'Guardar',
        preConfirm: () => {
            const testDate = document.getElementById('testDate').value;
            const testScore = Number(document.getElementById('testScore').value);

            if (isNaN(testScore) || testScore < 0 || testScore > 100) {
                Swal.showValidationMessage('Ingrese un puntaje válido entre 0 y 100');
                return false;
            }

            const lastTestId = student.pruebas?.length ? Math.max(...student.pruebas.map(t => t.id)) : 0;
            const newTestId = lastTestId + 1;

            const updatedStudents = students.map(s => {
                if (s.id === studentId) {
                    s.pruebas = s.pruebas || [];
                    s.pruebas.push({
                        id: newTestId,
                        date: testDate,
                        puntos: testScore,
                        materiaId: materia.id,
                        grupoId: grupo.id
                    });
                }
                return s;
            });

            localStorage.setItem('students', JSON.stringify(updatedStudents));

            Swal.fire('Guardado', 'Prueba registrada correctamente', 'success');
        }
    });
}


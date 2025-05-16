function registrarTarea(studentId) {
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
        <h5>Registrar Tarea:</h5>
        <strong> Estudiante: </strong><br>
        Nombre: ${student.name}<br>
        ID: ${student.id}<br>
        Grupo: ${grupo.nombre}<br>
        Materia: ${materia.nombre}<br><br>
        <label for="taskDate">Seleccionar fecha:</label>
        <input type="date" id="taskDate" class="form-control" value="${formattedDate}">
        <br>
        <label for="taskScore">Puntos Obtenidos:</label>
        <input type="number" id="taskScore" class="form-control" min="0" max="100">
        `,
        showCancelButton: true,
        confirmButtonText: 'Guardar',
        preConfirm: () => {
            const taskDate = document.getElementById('taskDate').value;
            const taskScore = Number(document.getElementById('taskScore').value);

            if (isNaN(taskScore) || taskScore < 0 || taskScore > 100) {
                Swal.showValidationMessage('Ingrese un puntaje válido entre 0 y 100');
                return false;
            }

            const lastTaskId = student.tareas?.length ? Math.max(...student.tareas.map(t => t.id)) : 0;
            const newTaskId = lastTaskId + 1;

            const updatedStudents = students.map(s => {
                if (s.id === studentId) {
                    s.tareas = s.tareas || [];
                    s.tareas.push({
                        id: newTaskId,
                        date: taskDate,
                        score: taskScore,
                        materiaId: materia.id,
                        grupoId: grupo.id
                    });
                }
                return s;
            });

            localStorage.setItem('students', JSON.stringify(updatedStudents));

            Swal.fire('Guardado', 'Tarea registrada correctamente', 'success');
        }
    });
}

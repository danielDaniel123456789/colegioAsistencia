// Función para copiar los datos del estudiante al portapapeles
function copyStudentData(index, selectedMateria) {
    const students = JSON.parse(localStorage.getItem('students')) || [];
    const student = students[index];

    // Inicializar contadores para las ausencias justificadas e injustificadas
    let justifiedCount = 0;
    let unjustifiedCount = 0;

    // Filtrar las ausencias por la materia seleccionada
    const filteredAbsences = student.absences.filter(absence => absence.materia === selectedMateria);

    // Crear un texto con todos los datos del estudiante para la materia seleccionada
    let studentData = `Nombre: ${student.name} ${student.surname}\nCédula: ${student.id}\n\nAusencias en ${selectedMateria}:\n`;

    filteredAbsences.forEach(absence => {
        studentData += `Fecha: ${absence.date} - Tipo: ${absence.type}\n`;

        // Incrementar los contadores según el tipo de ausencia
        if (absence.type === 'justificada') {
            justifiedCount++;
        } else if (absence.type === 'injustificada') {
            unjustifiedCount++;
        }
    });

    // Añadir la cantidad de ausencias justificadas e injustificadas al final del texto
    studentData += `\nTotal Justificadas: ${justifiedCount}\nTotal Injustificadas: ${unjustifiedCount}`;

    // Copiar al portapapeles
    navigator.clipboard.writeText(studentData)
        .then(() => {
            Swal.fire('Copiado', 'Los datos del estudiante se han copiado al portapapeles.', 'success');
        })
        .catch(err => {
            Swal.fire('Error', 'Hubo un problema al copiar los datos.', 'error');
        });
}

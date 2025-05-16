// Función para copiar los datos del estudiante en formato de carta dirigida al padre
function copyStudentPadre(index, selectedMateria) {
    const students = JSON.parse(localStorage.getItem('students')) || [];
    const student = students[index];

    // Inicializar contadores para las ausencias justificadas e injustificadas
    let justifiedCount = 0;
    let unjustifiedCount = 0;

    // Obtener la fecha actual
    const currentDate = new Date();
    const day = currentDate.getDate().toString().padStart(2, '0'); // Asegura dos dígitos para el día
    const month = (currentDate.getMonth() + 1).toString().padStart(2, '0'); // Asegura dos dígitos para el mes
    const year = currentDate.getFullYear();

    let letterContent = `Estimado padre/madre de ${student.name} ${student.surname},\n\n`;
    letterContent += `Le informamos acerca de las ausencias de su hijo(a) en la materia de ${selectedMateria} durante el periodo escolar.\n\n`;
    letterContent += `Cédula: ${student.cedula}\n\n`;
    letterContent += `Detalles de las ausencias:\n`;

    // Filtrar las ausencias por la materia seleccionada
    const filteredAbsences = student.absences.filter(absence => absence.materia === selectedMateria);

    filteredAbsences.forEach(absence => {
        letterContent += `Fecha: ${absence.date} - Tipo: ${absence.type}\n`;

        // Incrementar los contadores según el tipo de ausencia
        if (absence.type === 'justificada') {
            justifiedCount++;
        } else if (absence.type === 'injustificada') {
            unjustifiedCount++;
        }
    });

    // Añadir la cantidad de ausencias justificadas e injustificadas al final de la carta
    letterContent += `\nTotal Justificadas: ${justifiedCount}\n`;
    letterContent += `Total Injustificadas: ${unjustifiedCount}\n\n`;

    // Solicitar nombre y firma de recibido al final de la carta
    letterContent += `Por favor, ingrese su nombre y firme de recibido:\n\n`;
    letterContent += `Nombre: _____________________________\n`;
    letterContent += `Firma: _____________________________\n\n`;

    // Incluir la fecha de impresión y el año actual
    letterContent += `Fecha de impresión: ${day}/${month}/${year}\n`;
    letterContent += `Año: ${year}\n\n`;

    letterContent += `Atentamente,\nEl equipo de la escuela.`;

    // Copiar al portapapeles
    navigator.clipboard.writeText(letterContent)
        .then(() => {
            Swal.fire('Copiado', 'El informe ha sido copiado al portapapeles.', 'success');
        })
        .catch(err => {
            Swal.fire('Error', 'Hubo un problema al copiar el informe.', 'error');
        });
}

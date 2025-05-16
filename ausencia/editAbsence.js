function editAbsence(studentIndex, absenceIndex, absenceID) {
    console.log('studentIndex:', studentIndex);
    console.log('absenceIndex:', absenceIndex);
    console.log('absenceID:', absenceID);
    const students = JSON.parse(localStorage.getItem('students')) || [];

    // Filtra el estudiante por ID
    const student = students.find(student => student.id === studentIndex);

    if (student) {
        console.log(`Estudiante encontrado:`, student);

        if (student.absences && student.absences.length > 0) {
            // Buscar la ausencia con el ID proporcionado
            const absence = student.absences.find(absence => absence.id === absenceID);

            if (absence) {
                console.log(`Ausencia encontrada:`, absence);

                // Mostrar el cuadro de SweetAlert2 con el select para modificar el tipo
                Swal.fire({
                    title: `Modificar tipo de ausencia`,
                    html: `
                        <strong>Fecha:</strong> ${absence.date} <br>
                        <strong>Tipo actual:</strong> ${getAbsenceTypeLabel(absence.type)} <br>
                        <label for="absenceType">Selecciona el nuevo tipo de ausencia:</label>
                        <select id="absenceType" class="form-select">
                     <option value="4" ${absence.type === '4' ? 'selected' : ''}>Presente ✅</option>
<option value="3" ${absence.type === '3' ? 'selected' : ''}>Ausencia Justificada ✔️</option>
<option value="2" ${absence.type === '2' ? 'selected' : ''}>Tardía Justificada ✔️</option>
<option value="1" ${absence.type === '1' ? 'selected' : ''}>Tardía no justificada (2=1 Ausencia) ⏰</option>
<option value="0" ${absence.type === '0' ? 'selected' : ''}>Ausencia no justificada ❌</option>
 </select>
                    `,
                    showCancelButton: true,
                    confirmButtonText: 'Guardar',
                    cancelButtonText: 'Cancelar',
                    preConfirm: () => {
                        // Obtener el valor seleccionado del select
                        const newType = document.getElementById('absenceType').value;

                        // Actualizar el tipo de la ausencia
                        absence.type = newType;

                        // Guardar los cambios en localStorage
                        localStorage.setItem('students', JSON.stringify(students));

                        return newType;
                    }
                }).then((result) => {
                    if (result.isConfirmed) {
                        Swal.fire({
                            title: 'Tipo de ausencia actualizado',
                            text: `El tipo de ausencia ha sido cambiado a: ${getAbsenceTypeLabel(result.value)}`,
                            icon: 'success'
                        }).then(() => {
                            // Recargar la página o actualizar la vista según sea necesario
                            location.reload();
                        });
                    }
                });
            } else {
                console.log(`No se encontró la ausencia con ID ${absenceID}`);
                Swal.fire({
                    title: 'Error',
                    text: `No se encontró la ausencia con ID ${absenceID}`,
                    icon: 'error'
                });
            }
        } else {
            console.log(`El estudiante no tiene ausencias registradas.`);
            Swal.fire({
                title: 'Sin ausencias',
                text: `El estudiante ${student.name} no tiene ausencias registradas.`,
                icon: 'info'
            });
        }
    } else {
        console.log(`No se encontró el estudiante con ID ${studentIndex}`);
        Swal.fire({
            title: 'Error',
            text: `No se encontró el estudiante con ID ${studentIndex}`,
            icon: 'error'
        });
    }
}

// Función auxiliar para obtener la etiqueta del tipo de ausencia
function getAbsenceTypeLabel(type) {
    const types = {
        '4': 'Presente',
        '3': 'Ausencia Justificada',
        '2': 'Ausencia justificada',
        '1': 'Tardía no justificada (2=1 Ausencia)',
        '0': 'Ausencia no justificada'
    };
    return types[type] || 'No especificado';
}
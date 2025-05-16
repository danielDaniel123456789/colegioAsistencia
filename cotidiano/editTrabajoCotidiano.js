function editTrabajoCotidiano(index, trabajoIndex) {
    const students = JSON.parse(localStorage.getItem('students')) || [];
    const student = students[index];

    // Verificar si el estudiante tiene trabajos cotidianos
    if (!student.trabajoCotidiano || student.trabajoCotidiano.length === 0) {
        Swal.fire('Sin Trabajos Cotidianos', 'Este estudiante no tiene trabajos cotidianos registrados.', 'warning');
        return;
    }

    const trabajo = student.trabajoCotidiano[trabajoIndex];

    // Obtener las materias almacenadas en localStorage
    const materias = JSON.parse(localStorage.getItem('materias')) || [];

    // Verificar si hay materias disponibles
    if (materias.length === 0) {
        Swal.fire('Sin Materias', 'No se han registrado materias. Por favor, agregue materias primero.', 'warning');
        return;
    }

    // Crear opciones del select con la materia seleccionada previamente
    let materiasOptions = materias.map(materia => 
        `<option value="${materia}" ${materia === trabajo.materia ? 'selected' : ''}>${materia}</option>`
    ).join('');

    Swal.fire({
        title: `Editar Trabajo Cotidiano ${student.name} ${student.surname}`,
        html: ` 
        <div class="p-2">
            <div id="closeButton" class="swal-close-btn">&times;</div>
            <input id="absenceDate" class="swal-input" type="date" value="${trabajo.date}">
            <select id="absenceType" class="swal-input">
                <option value="No participó" ${trabajo.type === "No participó" ? 'selected' : ''}>No participó</option>
                <option value="Baja participación" ${trabajo.type === "Baja participación" ? 'selected' : ''}>Baja participación</option>
                <option value="Participación parcial" ${trabajo.type === "Participación parcial" ? 'selected' : ''}>Participación parcial</option>
                <option value="Participación activa" ${trabajo.type === "Participación activa" ? 'selected' : ''}>Participación activa</option>
            </select>
            <textarea id="absenceDetail" class="swal-input" placeholder="Ingrese un detalle (opcional)">${trabajo.detail || ''}</textarea>
            <select id="absenceMateria" class="swal-input">
                ${materiasOptions}
            </select>
        </div>
        `,
        focusConfirm: false,
        showCancelButton: true,
        cancelButtonText: 'Cancelar',
        preConfirm: () => {
            const date = document.getElementById('absenceDate').value;
            const type = document.getElementById('absenceType').value;
            const detail = document.getElementById('absenceDetail').value.trim(); // Ahora es opcional
            const materia = document.getElementById('absenceMateria').value;

            if (!date || !type || !materia) {
                Swal.showValidationMessage('Por favor complete los campos obligatorios.');
                return false;
            }

            // Actualizar el objeto de trabajo cotidiano
            trabajo.date = date;
            trabajo.type = type;
            trabajo.materia = materia;
            if (detail) {
                trabajo.detail = detail; // Solo se guarda si hay un detalle
            } else {
                delete trabajo.detail; // Eliminar el detalle si está vacío
            }

            // Guardar los cambios en el array de trabajoCotidiano
            student.trabajoCotidiano[trabajoIndex] = trabajo;

            // Actualizar el array de estudiantes
            students[index] = student;

            // Guardar los estudiantes con el trabajo cotidiano editado
            localStorage.setItem('students', JSON.stringify(students));

            Swal.fire('Trabajo Cotidiano Editado', 'El trabajo cotidiano ha sido editado correctamente.', 'success')
                .then(() => {
                    // Llamar al informe de trabajo cotidiano con la materia seleccionada
                    abrirInformeCotidiano(index, materia);
                });
        },
        willOpen: () => {
            document.getElementById('closeButton').addEventListener('click', () => {
                Swal.close();
            });
        }
    });
}

function trabajoCotidiano(studentId) {
    const students = JSON.parse(localStorage.getItem('students')) || [];
    const materias = JSON.parse(localStorage.getItem('materias')) || [];
    const grupos = JSON.parse(localStorage.getItem('grupos')) || [];

    const student = students.find(s => s.id === studentId);
    if (!student) {
        Swal.fire('Error', 'Estudiante no encontrado', 'error');
        return;
    }

    // Obtener la materia y el grupo
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

    // Obtener la fecha actual
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    const currentMonth = currentDate.getMonth();
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate(); // Número de días en el mes

    // Array con los nombres de los meses
    const months = [
        'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 
        'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
    ];

    // Crear las opciones del selector de fechas con el nombre del mes
    let dateOptions = '';
    for (let i = 1; i <= daysInMonth; i++) {
        const dateStr = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(i).padStart(2, '0')}`;
        const selected = currentDate.getDate() === i ? 'selected' : '';
        const monthName = months[currentMonth]; // Obtener el nombre del mes
        const displayDate = `${i} de ${monthName} ${currentYear}`; // Formato amigable para mostrar
        dateOptions += `<option value="${dateStr}" ${selected}>${displayDate}</option>`;
    }

    // Agregar la opción para cargar una fecha personalizada
    dateOptions += `<option value="custom" class="bg-danger text-white">Cargar otra fecha</option>`;

    // Obtener el último ID registrado y aumentar en uno
    let lastId = Number(localStorage.getItem('lastTrabajoId')) || 0;
    const newId = lastId + 1;

    Swal.fire({
        title: `Registro de Trabajo Cotidiano`,
        html: `
        <h5>Estudiante: ${student.name} ${student.surname}</h5>
        <p><strong>Materia:</strong> ${materia.nombre}</p>
        <p><strong>Grupo:</strong> ${grupo.nombre}</p>
        <label for="trabajoDate">Seleccionar fecha:</label>
        <select id="trabajoDate" class="swal-input">
            ${dateOptions}
        </select>
        <div id="customDateContainer" style="display: none;">
            <label for="customDate">Selecciona una fecha personalizada:</label>
            <input type="date" id="customDate" class="swal-input">
        </div>
        <br>
        <label for="trabajoType">Seleccionar desempeño:</label>
        <select id="trabajoType" class="swal-input">
            <option value="0">No participó</option>
            <option value="1">Baja participación</option>
            <option value="2">Participación parcial</option>
            <option value="3">Participación activa</option>
        </select>
        <br>
        <label for="trabajoDetail">Detalles (opcional):</label>
        <textarea id="trabajoDetail" class="swal-input" placeholder="Ingrese un detalle"></textarea>
        `,
        showCancelButton: true,
        confirmButtonText: 'Guardar',
        didOpen: () => {
            const trabajoDate = document.getElementById('trabajoDate');
            const customDateContainer = document.getElementById('customDateContainer');
            const customDate = document.getElementById('customDate');

            // Mostrar el campo para seleccionar una fecha personalizada si se elige la opción "Cargar otra fecha"
            trabajoDate.addEventListener('change', () => {
                if (trabajoDate.value === 'custom') {
                    customDateContainer.style.display = 'block'; // Mostrar campo de fecha
                } else {
                    customDateContainer.style.display = 'none'; // Ocultar campo de fecha
                }
            });
        },
        preConfirm: () => {
            const trabajoDate = document.getElementById('trabajoDate').value;
            const customDate = document.getElementById('customDate').value;
            const type = document.getElementById('trabajoType').value;
            const detail = document.getElementById('trabajoDetail').value.trim();

          // Si la opción "Cargar otra fecha" está seleccionada, usar la fecha personalizada
const date = (trabajoDate === 'custom' && customDate) ? customDate : trabajoDate;

if (!type) {
    Swal.showValidationMessage('Debe seleccionar un tipo de participación.');
    return false;
}

// Crear el objeto del trabajo cotidiano
const trabajo = { 
    id: newId, 
    date, // Usar la fecha seleccionada o personalizada
    type, 
    materiaId: idMateria,
    grupoId: idGrupo,
    detail: detail || null
};

// Asegurar que el array trabajoCotidiano existe
student.trabajoCotidiano = student.trabajoCotidiano || [];
student.trabajoCotidiano.push(trabajo);

// Guardar cambios en localStorage
localStorage.setItem('students', JSON.stringify(students));
localStorage.setItem('lastTrabajoId', newId); // Actualizar el último ID utilizado

// 📌 Obtener el mes desde la fecha seleccionada
const mes = date.split("-")[1]; // devuelve "01", "02", ..., "12"

Swal.fire('Guardado', 'Trabajo cotidiano registrado correctamente.', 'success')
    .then(() => {
        resumeCotidianoMes(studentId, mes); // ✅ ahora mes está definido
    });

        }
    });
}



function importarEstudiantes() {
    // Obtener datos desde localStorage
    const grupos = JSON.parse(localStorage.getItem("grupos")) || [];
    const materias = JSON.parse(localStorage.getItem("materias")) || [];
    const existingStudents = JSON.parse(localStorage.getItem("students")) || [];

    // Encontrar el máximo ID de estudiantes existente
    const maxStudentId = existingStudents.reduce((max, student) => 
        Math.max(max, student.id), 0);

    // Encontrar el máximo ID de ausencias existente (en todos los estudiantes)
    const maxAbsenceId = existingStudents.reduce((maxAbsence, student) => {
        const studentMax = student.absences.reduce((max, absence) => 
            Math.max(max, absence.id), 0);
        return Math.max(maxAbsence, studentMax);
    }, 0);

    // Generar opciones para los selects
    const selectGrupoOptions = grupos.map(grupo => 
        `<option value="${grupo.id}">${grupo.nombre}</option>`
    ).join("");

    const selectMateriaOptions = materias.map(materia => 
        `<option value="${materia.id}">${materia.nombre}</option>`
    ).join("");

    Swal.fire({
        title: "Importar Estudiantes",
        html: `
        <div class="p-2">
            <label for="grupoSelect"><strong>Selecciona un grupo:</strong></label>
            <select id="grupoSelect" class="form-select">
                ${selectGrupoOptions}
            </select>
        </div>

        <div class="p-2">
            <label for="materiaSelect"><strong>Selecciona una materia:</strong></label>
            <select id="materiaSelect" class="form-select">
                ${selectMateriaOptions}
            </select>
        </div>

        <p>Pega los nombres y cédulas de los estudiantes:</p>
        <div style="display: flex; gap: 10px;">
            <div style="flex: 1;">
                <label for="studentTextarea"><strong>Nombres:</strong></label>
                <textarea id="studentTextarea" rows="6" style="width:100%;"></textarea>
            </div>
            <div style="flex: 1;">
                <label for="cedulaTextarea"><strong>Cédulas:</strong></label>
                <textarea id="cedulaTextarea" rows="6" style="width:100%;"></textarea>
            </div>
        </div>
        `,
        showCancelButton: true,
        confirmButtonText: "Importar",
        cancelButtonText: "Cancelar"
    }).then((result) => {
        if (result.isConfirmed) {
            const selectedGroup = document.getElementById("grupoSelect").value;
            const selectedMateria = document.getElementById("materiaSelect").value;
            const namesText = document.getElementById("studentTextarea").value.trim();
            const cedulasText = document.getElementById("cedulaTextarea").value.trim();

            let names = namesText.split("\n")
                .map(name => capitalizeWords(name.trim()))
                .filter(name => name !== "");

            const cedulas = cedulasText.split("\n")
                .map(cedula => cedula.trim())
                .filter(cedula => cedula !== "");

            // Validaciones
            if (!selectedGroup) return Swal.fire("Error", "Debes seleccionar un grupo.", "error");
            if (!selectedMateria) return Swal.fire("Error", "Debes seleccionar una materia.", "error");
            if (names.length === 0) return Swal.fire("Error", "No se ingresaron nombres.", "error");
            if (cedulas.length === 0) return Swal.fire("Error", "No se ingresaron cédulas.", "error");
            if (names.length !== cedulas.length) return Swal.fire("Error", "El número de nombres y cédulas no coincide.", "error");

            // Crear nuevos estudiantes
            const newStudents = names.map((name, index) => ({
                id: maxStudentId + 1 + index,
                name,
                cedula: cedulas[index],
                absences: [], // Array vacío, cada ausencia tendrá su propio ID autoincremental
                materiaId: selectedMateria,
                trabajoCotidiano: [],
                groupId: selectedGroup
            }));

            // Actualizar y guardar
            const updatedStudents = [...existingStudents, ...newStudents];
            localStorage.setItem("students", JSON.stringify(updatedStudents));
            
            Swal.fire("Éxito", "Estudiantes importados correctamente.", "success");
            loadStudents();
            datosGeneralesEspecificos(selectedGroup, selectedMateria);
        }
    });
}
/*
// Función para agregar una ausencia con ID autoincremental
function agregarAusencia(studentId, fecha, motivo) {
    const students = JSON.parse(localStorage.getItem("students")) || [];
    
    // Encontrar el máximo ID de ausencia existente
    const maxAbsenceId = students.reduce((maxAbsence, student) => {
        const studentMax = student.absences.reduce((max, absence) => 
            Math.max(max, absence.id), 0);
        return Math.max(maxAbsence, studentMax);
    }, 0);

    const student = students.find(s => s.id === studentId);
    if (student) {
        const newAbsence = {
            id: maxAbsenceId + 1,
            fecha,
            motivo
        };
        
        student.absences.push(newAbsence);
        localStorage.setItem("students", JSON.stringify(students));
        return true;
    }
    return false;
}
*/
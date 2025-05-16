function importarEstudiantes() {
    const grupos = JSON.parse(localStorage.getItem("grupos")) || [];
    const materias = JSON.parse(localStorage.getItem("materias")) || [];
    const existingStudents = JSON.parse(localStorage.getItem("students")) || [];

    const maxStudentId = existingStudents.reduce((max, student) => Math.max(max, student.id), 0);
    const maxAbsenceId = existingStudents.reduce((maxAbsence, student) => {
        const studentMax = student.absences.reduce((max, absence) =>
            Math.max(max, absence.id), 0);
        return Math.max(maxAbsence, studentMax);
    }, 0);

    // PASO 1: Nombres y cédulas
    Swal.fire({
        title: "Paso 1: Estudiantes",
        html: `
            <p>Pega los nombres y cédulas de los estudiantes:</p>
            <div style="display: flex; gap: 10px;">
                <div style="flex: 1;">
                    <label><strong>Nombres:</strong></label>
                    <textarea id="studentTextarea" rows="6" style="width:100%;"></textarea>
                </div>
                <div style="flex: 1;">
                    <label><strong>Cédulas:</strong></label>
                    <textarea id="cedulaTextarea" rows="6" style="width:100%;"></textarea>
                </div>
            </div>
        `,
        confirmButtonText: "Siguiente",
        showCancelButton: true,
        preConfirm: () => {
            const namesText = document.getElementById("studentTextarea").value.trim();
            const cedulasText = document.getElementById("cedulaTextarea").value.trim();

            const names = namesText.split("\n")
                .map(name => capitalizeWords(name.trim()))
                .filter(name => name !== "");

            const cedulas = cedulasText.split("\n")
                .map(cedula => cedula.trim())
                .filter(cedula => cedula !== "");

            if (names.length === 0) {
                Swal.showValidationMessage("Debes ingresar al menos un nombre.");
                return false;
            }
            if (cedulas.length === 0) {
                Swal.showValidationMessage("Debes ingresar al menos una cédula.");
                return false;
            }
            if (names.length !== cedulas.length) {
                Swal.showValidationMessage("La cantidad de nombres y cédulas no coincide.");
                return false;
            }

            return { names, cedulas };
        }
    }).then(result1 => {
        if (!result1.isConfirmed) return;

        const { names, cedulas } = result1.value;

        // PASO 2: Selección de materia
        const selectMateriaOptions = materias.map(materia =>
            `<option value="${materia.id}">${materia.nombre}</option>`).join("");

        Swal.fire({
            title: "Paso 2: Materia",
            html: `
                <label for="materiaSelect"><strong>Selecciona una materia:</strong></label>
                <select id="materiaSelect" class="form-select">
                    ${selectMateriaOptions}
                </select>
            `,
            confirmButtonText: "Siguiente",
            showCancelButton: true,
            preConfirm: () => {
                const materiaId = document.getElementById("materiaSelect").value;
                if (!materiaId) {
                    Swal.showValidationMessage("Debes seleccionar una materia.");
                    return false;
                }
                return { materiaId };
            }
        }).then(result2 => {
            if (!result2.isConfirmed) return;

            const { materiaId } = result2.value;

            // PASO 3: Selección de grupo
            const selectGrupoOptions = grupos.map(grupo =>
                `<option value="${grupo.id}">${grupo.nombre}</option>`).join("");

            Swal.fire({
                title: "Paso 3: Grupo",
                html: `
                    <label for="grupoSelect"><strong>Selecciona un grupo:</strong></label>
                    <select id="grupoSelect" class="form-select">
                        ${selectGrupoOptions}
                    </select>
                `,
                confirmButtonText: "Importar",
                showCancelButton: true,
                preConfirm: () => {
                    const grupoId = document.getElementById("grupoSelect").value;
                    if (!grupoId) {
                        Swal.showValidationMessage("Debes seleccionar un grupo.");
                        return false;
                    }
                    return { grupoId };
                }
            }).then(result3 => {
                if (!result3.isConfirmed) return;

                const { grupoId } = result3.value;

                // Crear los estudiantes
                const newStudents = names.map((name, index) => ({
                    id: maxStudentId + 1 + index,
                    name,
                    cedula: cedulas[index],
                    absences: [],
                    materiaId,
                    trabajoCotidiano: [],
                    groupId: grupoId
                }));

                const updatedStudents = [...existingStudents, ...newStudents];
                localStorage.setItem("students", JSON.stringify(updatedStudents));

                Swal.fire("Éxito", "Estudiantes importados correctamente.", "success");
                loadStudents();
                datosGeneralesEspecificos(grupoId, materiaId);
            });
        });
    });
}

// Capitalizar palabras
function capitalizeWords(str) {
    return str.replace(/\b\w/g, char => char.toUpperCase());
}

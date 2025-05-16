function addStudent() {
    // Cargar los grupos y materias desde el localStorage de forma segura
    let grupos = obtenerGrupos();
    let materias =obtenerMaterias();

    // Verificar si hay grupos o materias para mostrar
    if (grupos.length === 0) {
        Swal.fire('Información', 'No hay grupos disponibles. Por favor, agregue un grupo primero.', 'info');
        return;
    }

    if (materias.length === 0) {
        Swal.fire('Información', 'No hay materias disponibles. Por favor, agregue una materia primero.', 'info');
        return;
    }


    // Abrir SweetAlert para agregar un estudiante
    Swal.fire({
        title: 'Agregar Estudiante',
        html: `
            <input id="studentName" class="swal2-input" placeholder="Nombre">
            <input id="studentCedula" class="swal2-input" placeholder="Cédula (opcional)" type="text">
            <br> <br>

           ${studentGroup()}
            <br>
           ${studentMateria()}
        `,
        focusConfirm: false,
        showCancelButton: true,
        cancelButtonText: 'Cancelar',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Agregar',
        preConfirm: () => {
            const name = document.getElementById('studentName').value.trim();
            const cedula = document.getElementById('studentCedula').value.trim();
            const groupId = document.getElementById('studentGroup').value;
            const materiaId = document.getElementById('studentMateria').value;

            // Verificar que al menos el nombre, el grupo y la materia estén seleccionados
            if (!name) {
                Swal.showValidationMessage('El nombre es obligatorio');
                return false;
            }
            if (!groupId) {
                Swal.showValidationMessage('Debe seleccionar un grupo');
                return false;
            }
            if (!materiaId) {
                Swal.showValidationMessage('Debe seleccionar una materia');
                return false;
            }

            // Obtener estudiantes de localStorage de forma segura
            let students = localStorage.getItem('students') ? JSON.parse(localStorage.getItem('students')) : [];

            // Generar un ID único para el estudiante
            const studentId = students.length > 0 ? students[students.length - 1].id + 1 : 1; // Generar ID basado en el último estudiante

            // Crear objeto del estudiante
            const student = {
                id: studentId, // Asignar el ID único
                name: name,
                cedula: cedula || '', // Si no se ingresa, se guarda como cadena vacía
                groupId: groupId, // Guardamos solo el ID del grupo
                materiaId: materiaId, // Guardamos el ID de la materia seleccionada
                absences: [] // Inicializar las ausencias
            };

            saveStudent(student);

            Swal.fire({
                title: "Insertado",
                text: "Estudiante agregado correctamente",
                icon: "success"
              });
        }
    });
}

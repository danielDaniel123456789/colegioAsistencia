// Función para agregar una materia
function addMateria() {
    Swal.fire({
        title: 'Agregar Materia',
        html: `
            <input id="materiaName" class="swal2-input" placeholder="Nombre de la materia">
        `,
        focusConfirm: false,
        showCancelButton: true, // Mostrar el botón de cancelar
        cancelButtonText: 'Cancelar', // Texto del botón de cancelar
        confirmButtonText: 'Agregar', // Texto del botón de confirmar
        preConfirm: () => {
            const materiaName = document.getElementById('materiaName').value.trim();

            // Verificar que el campo no esté vacío
            if (materiaName) {
                // Convertir la primera letra en mayúscula
                const formattedMateriaName = materiaName.charAt(0).toUpperCase() + materiaName.slice(1).toLowerCase();

                // Obtener la lista de materias del localStorage
                const materias = JSON.parse(localStorage.getItem('materias')) || [];

                // Crear objeto de materia con ID único
                const materia = {
                    id: materias.length + 1, // ID automático basado en la longitud actual de las materias
                    nombre: formattedMateriaName
                };

                // Agregar la nueva materia a la lista
                materias.push(materia);

                // Guardar la lista de materias actualizada en localStorage
                localStorage.setItem('materias', JSON.stringify(materias));

                // Verificar si es la primera materia que se agrega
                if (materias.length === 1) {
                    // Crear el registro de asistencia con la fecha de registro
                    const registro = {
                        fechaRegistro: new Date().toISOString() // Guardar la fecha en formato ISO
                    };
                    generarRegistroUsuario();
                    console.log("Registro de asistencia creado:", registro); // Solo para depuración
                }

                Swal.fire('Agregada', 'La materia ha sido agregada correctamente.', 'success');
                misMaterias(); // Recargar la lista de materias
            } else {
                Swal.showValidationMessage('Por favor ingrese el nombre de la materia');
            }
        }
    });
}

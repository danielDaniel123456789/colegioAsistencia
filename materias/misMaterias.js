
// Función para mostrar las materias que lleva el estudiante en una tabla con opción de editar
function misMaterias() {
    const materias = JSON.parse(localStorage.getItem('materias')) || [];

    // Verificar si hay materias almacenadas
    if (materias.length === 0) {
        Swal.fire('Sin Materias', 'No has agregado ninguna materia.', 'info');
        return;
    }

    // Crear el contenido HTML para la tabla
    let materiasContent = `
        <table class="table">
            <thead>
                <tr>
                    <th scope="col">#</th>
                    <th scope="col">Materia</th>
                    <th scope="col">Acciones</th>
                </tr>
            </thead>
            <tbody>
    `;

    // Llenar las filas de la tabla con las materias y un botón para editar
    materias.forEach((materia, index) => {
        materiasContent += `
            <tr>
                <td>${materia.id}</td>
                <td>${materia.nombre}</td>
                <td>
                    <button class="btn btn-warning btn-sm" onclick="editarMateria(${index})">Editar</button>
                </td>
            </tr>
        `;
    });

    // Cerrar la tabla
    materiasContent += '</tbody></table>';

    // Mostrar las materias en un cuadro de diálogo con la tabla
    Swal.fire({
        title: 'Mis Materias',
        html: materiasContent,
        confirmButtonText: 'Cerrar'
    });
}

// Función para editar una materia
function editarMateria(index) {
    const materias = JSON.parse(localStorage.getItem('materias')) || [];
    const materiaActual = materias[index];

    // Mostrar un cuadro de diálogo para editar la materia
    Swal.fire({
        title: 'Editar Materia',
        html: `
            <input id="editMateria" class="swal2-input" type="text" value="${materiaActual.nombre}">
        `,
        focusConfirm: false,
        showCancelButton: true,
        cancelButtonText: 'Cancelar',
        preConfirm: () => {
            const newMateria = document.getElementById('editMateria').value.trim();
            if (newMateria) {
                // Convertir la primera letra en mayúscula
                const formattedMateriaName = newMateria.charAt(0).toUpperCase() + newMateria.slice(1).toLowerCase();

                // Actualizar la materia en el array
                materias[index].nombre = formattedMateriaName;
                localStorage.setItem('materias', JSON.stringify(materias));

                Swal.fire('Materia Actualizada', 'La materia ha sido actualizada correctamente.', 'success');
                misMaterias(); // Recargar la lista de materias
            } else {
                Swal.showValidationMessage('Por favor ingresa un nombre para la materia');
            }
        }
    });
}

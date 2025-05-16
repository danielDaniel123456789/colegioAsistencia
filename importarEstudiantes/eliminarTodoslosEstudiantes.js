function eliminarTodoslosEstudiantes() {
    Swal.fire({
        title: 'Confirmar eliminación',
        html: `
            <p>Para eliminar todos los estudiantes, escribe <b>"Eliminar"</b> en la caja de texto.</p>
            <input type="text" id="confirmDeleteInput" class="swal2-input" placeholder="Escribe aquí">
        `,
        showCancelButton: true,
        confirmButtonText: 'Eliminar',
        cancelButtonText: 'Cancelar',
        preConfirm: () => {
            const userInput = document.getElementById('confirmDeleteInput').value.trim(); // Eliminar espacios antes y después
            if (userInput !== "Eliminar") {
                Swal.showValidationMessage('Debes escribir "Eliminar" exactamente como se indica.');
                return false;
            }
            return true;
        }
    }).then((result) => {
        if (result.isConfirmed) {
            localStorage.removeItem('students'); // Elimina todos los estudiantes
            Swal.fire('Eliminado', 'Todos los estudiantes han sido eliminados.', 'success');
            loadStudents(); // Recargar la lista de estudiantes
        }
    });
}

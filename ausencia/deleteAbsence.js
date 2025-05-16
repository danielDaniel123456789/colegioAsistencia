function deleteAbsence(studentId, absence_id) {
    let students = JSON.parse(localStorage.getItem('students')) || [];

    // Buscar el índice del estudiante
    let studentIndex = students.findIndex(s => s.id === studentId);

    if (studentIndex === -1) {
        Swal.fire("Error", "Estudiante no encontrado.", "error");
        return;
    }

    Swal.fire({
        title: "¿Estás seguro?",
        text: "Esta acción eliminará la ausencia.",
     
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Sí, eliminar",
        cancelButtonText: "Cancelar"
    }).then((result) => {
        if (result.isConfirmed) {
            // Filtrar la ausencia
            students[studentIndex].absences = students[studentIndex].absences.filter(absence => absence.id !== absence_id);

            // Guardar en localStorage
            localStorage.setItem('students', JSON.stringify(students));

            Swal.fire("Eliminado", "La ausencia ha sido eliminada.", "success");
        }
    });
}

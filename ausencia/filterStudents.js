function filterStudents() {
    const query = document.getElementById('buscarEstudiante').value.toLowerCase().trim();
    const students = JSON.parse(localStorage.getItem('students')) || [];

    // Filtrar estudiantes
    const filteredStudents = students.filter(student => {
        return (
            (student.name?.toLowerCase().includes(query)) ||
            (student.surname?.toLowerCase().includes(query)) ||
            (student.secondSurname?.toLowerCase().includes(query)) ||
            (student.cedula?.toLowerCase().includes(query)) // Cambiado de 'id' a 'cedula'
        );
    });

    // Llamar a loadStudents con los estudiantes filtrados
    loadStudents(filteredStudents);
}

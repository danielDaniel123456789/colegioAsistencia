function saveStudent(student) {
    // Verificar si 'students' existe y tiene un valor válido en localStorage
    let students = localStorage.getItem('students');
    
    // Si no existe o está vacío, inicializamos como un array vacío
    students = students ? JSON.parse(students) : [];

    // Agregar el nuevo estudiante al array
    students.push(student);

    // Guardar el array actualizado de estudiantes en localStorage
    localStorage.setItem('students', JSON.stringify(students));

    // Cargar los estudiantes para actualizarlos en la interfaz
    loadStudents();
}

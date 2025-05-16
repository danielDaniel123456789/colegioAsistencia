function generateId() {
    // Obtener la lista de estudiantes desde localStorage, o un array vacío si no existe
    const students = JSON.parse(localStorage.getItem("students")) || [];

    // Si hay estudiantes, tomar el último ID y aumentar en 1
    const lastId = students.length > 0 ? students[students.length - 1].id : 0;

    // Retornar el siguiente ID (último + 1)
    return lastId + 1;
}

function loadStudents(students = null) {
    // Si no se pasan estudiantes, obtenerlos desde localStorage
    students = students || (localStorage.getItem('students') ? JSON.parse(localStorage.getItem('students')) : []);
    
    const studentList = document.getElementById('studentList');
    studentList.innerHTML = ''; // Limpiar lista antes de cargar

    // Si no hay estudiantes, se muestra un mensaje
    if (students.length === 0) {
        studentList.innerHTML = "<p>No hay estudiantes registrados.</p>";
    }

    students.forEach((student) => {
        const studentItem = document.createElement('div');
        studentItem.classList.add('col-12', 'col-md-6', 'col-lg-4', 'student-card');
        studentItem.innerHTML = `
        <div class="card text-center">
            <div class="card-body">
                <h5 class="card-title">
                    <button class="btn btn-link btn-sm" onclick="editStudent(${student.id})">
                        ✏️
                        <!-- Carácter de lápiz -->
                    </button>
                    ${capitalizeWords(student.name)} --${student.id}
                </h5>
                <p class="card-text">Cédula: ${student.cedula || 'No disponible'}</p> <!-- Mostrar cédula -->

                <br>
                
                <!-- Grupo de botones con flexbox -->
                <div class="d-flex flex-wrap justify-content-around p-2">
                    <button type="button" class="btn btn-primary m-1" onclick="registerAbsence(${student.id})">Ausencia</button>
                    <button type="button" class="btn btn-primary m-1" onclick="viewAbsences(${student.id})">Informe</button>
                    <button type="button" class="btn btn-primary m-1" onclick="trabajoCotidiano(${student.id})">Cotidiano</button>
                    <button type="button" class="btn btn-primary m-1" onclick="resumeCotidiano(${student.id})">Informe</button>
                    <button type="button" class="btn btn-primary m-1" onclick="registrarTarea(${student.id})">Tareas</button>
                    <button type="button" class="btn btn-primary m-1" onclick="viewTasks(${student.id})">Informe</button>
                    <button type="button" class="btn btn-primary m-1" onclick="registrarPrueba(${student.id})">Prueba</button>
                    <button type="button" class="btn btn-primary m-1" onclick="viewPruebas(${student.id})">Informe</button>
                </div>

            </div>
        </div>
        `;
        studentList.appendChild(studentItem);
    });
}

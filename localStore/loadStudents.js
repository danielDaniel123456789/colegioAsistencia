function loadStudents(students = null) {
    // Si no se pasan estudiantes, obtenerlos desde localStorage
    if (students === null) {
        students = obtenerEstudiantes();
    }

    const studentList = document.getElementById('studentList');
    studentList.innerHTML = ''; // Limpiar lista antes de cargar

    // Si no hay estudiantes, se muestra un mensaje
    if (students.length === 0) {
        studentList.innerHTML = "<p>No hay estudiantes registrados.</p>";
        return;
    }

    students.forEach((student) => {
        const studentItem = document.createElement('div');
        studentItem.classList.add('d-flex', 'align-items-center', 'p-2',  'student-card');
        studentItem.style.cursor = "pointer";
        studentItem.onclick = function () {
            opcionesRegistrar(student.id, obtenerNombreMateria(student.materiaId), obtenerNombreGrupo(student.groupId), student.cedula);
        };

        // Crear avatar con la inicial
        const avatar = document.createElement('div');
        avatar.classList.add('avatar');
        avatar.innerText = student.name.charAt(0).toUpperCase();
        avatar.style.backgroundColor = getRandomColor(); // Color aleatorio

        // Contenedor de información del estudiante
        const infoContainer = document.createElement('div');
        infoContainer.classList.add('ms-3');

        infoContainer.innerHTML = `
        <div class="espacioNombre">
           <h5 class="mb-0 text-white">${capitalizeWords(student.name)}</h5>
            <p class="small text-white">${obtenerNombreMateria(student.materiaId)} - ${obtenerNombreGrupo(student.groupId)}</p>
        </div>`;

        studentItem.appendChild(avatar);
        studentItem.appendChild(infoContainer);
        studentList.appendChild(studentItem);
    });
}



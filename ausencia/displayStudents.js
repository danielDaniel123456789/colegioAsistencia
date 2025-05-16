// Asegúrate de que esta función esté definida
function displayStudents(students) {
    const studentList = document.getElementById('studentList');
    studentList.innerHTML = '';

    students.forEach((student, index) => {
        const studentItem = document.createElement('div');
        studentItem.classList.add('col-12', 'col-md-6', 'col-lg-4', 'student-card');
        studentItem.innerHTML = `
            <div class="card text-center">
                <div class="card-body">
                    <h5 class="card-title">
                        <button class="btn btn-link btn-sm" onclick="editStudent(${index})">✏️</button>
                        ${capitalizeFirstLetter(student.name)} 
                        ${capitalizeFirstLetter(student.surname)} 
                        ${student.secondSurname ? capitalizeFirstLetter(student.secondSurname) : ''}
                    </h5>
                    <p class="card-text">Cédula: ${student.cedula || 'No disponible'}</p>
                    <br>
                    <div class="p-2 btn-group" role="group">
                        <button type="button" class="btn btn-primary" onclick="registerAbsence(${index})">Ausencia</button>
                        <button type="button" class="btn btn-primary" onclick="viewAbsences(${index})">Informe</button>
                    </div>
                    <div class="p-2 btn-group" role="group">
                        <button type="button" class="btn btn-primary" onclick="trabajoCotidiano(${index})">Cotidiano</button>
                        <button type="button" class="btn btn-primary" onclick="informeTrabajoCotidiano(${index})">Informe</button>
                    </div>
                </div>
            </div>
        `;
        studentList.appendChild(studentItem);
    });
}
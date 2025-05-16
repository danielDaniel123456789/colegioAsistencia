function datosGeneralesEspecificos(groupId, materiaId) {

    console.log('sss');
    let students = JSON.parse(localStorage.getItem('students') || '[]');
    // const groupId = document.getElementById('grupo').value;
    // const materiaId = document.getElementById('materia').value;

     
    ejecutarAmbasCalificaciones02(groupId,materiaId, students);
}


function ejecutarAmbasCalificaciones02(groupId, materiaId, students) {
    ejecutarCalificacion02('4', 'Asistencia del Año', groupId, materiaId, students).then(() => {
        return ejecutarCalificacion02('3', 'Trabajo Cotidiano del Año', groupId, materiaId, students);
    }).catch(error => {
        console.error("Error en la ejecución de informes:", error);
    });
}

function ejecutarCalificacion02(tipo, titulo, groupId, materiaId, students) {
    return new Promise((resolve, reject) => {
        const currentYear = new Date().getFullYear();
        const datesInYear = [];
        let counter = 0; // Inicia el contador en 0

        for (let m = 0; m < 12; m++) {
            let daysInMonth = new Date(currentYear, m + 1, 0).getDate();
            for (let day = 1; day <= daysInMonth; day++) {
                datesInYear.push(`${currentYear}-${(m + 1).toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`);
            }
        }

        students.forEach(student => {
            let key = tipo === '4' ? 'absences' : 'trabajoCotidiano';
            student[key] = student[key] || [];

            datesInYear.forEach(date => {
                student[key].push({
                    id: counter++, // Usamos el contador secuencial
                    type: tipo,
                    materiaId: materiaId,
                    grupoId: groupId,
                    date: date
                });
            });
        });

        localStorage.setItem('students', JSON.stringify(students));

        Swal.fire('Guardado', `${titulo} registrada correctamente para todos los estudiantes`, 'success').then(() => {
            resolve();
        });
    });
}

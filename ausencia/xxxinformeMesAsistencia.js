function informeMesAsistencia() {
    // Crear el array con los meses y los días que tienen
    const meses = [
        { id: 1, nombre: 'Enero', dias: 31 },
        { id: 2, nombre: 'Febrero', dias: 28 },
        { id: 3, nombre: 'Marzo', dias: 31 },
        { id: 4, nombre: 'Abril', dias: 30 },
        { id: 5, nombre: 'Mayo', dias: 31 },
        { id: 6, nombre: 'Junio', dias: 30 },
        { id: 7, nombre: 'Julio', dias: 31 },
        { id: 8, nombre: 'Agosto', dias: 31 },
        { id: 9, nombre: 'Septiembre', dias: 30 },
        { id: 10, nombre: 'Octubre', dias: 31 },
        { id: 11, nombre: 'Noviembre', dias: 30 },
        { id: 12, nombre: 'Diciembre', dias: 31 }
    ];

    // Crear el HTML del select para los meses
    let selectMesHTML = '<select id="mesSelect" class="swal2-select">';
    meses.forEach(mes => {
        selectMesHTML += `<option value="${mes.id}">${mes.nombre}</option>`;
    });
    selectMesHTML += '</select>';

    // Mostrar el modal para seleccionar el mes
    Swal.fire({
        title: 'Selecciona un mes',
        html: selectMesHTML,
        showCancelButton: true,
        confirmButtonText: 'Siguiente',
        cancelButtonText: 'Cancelar',
        preConfirm: () => {
            const mesSeleccionado = document.getElementById('mesSelect').value;
            if (!mesSeleccionado) {
                Swal.showValidationMessage('Por favor selecciona un mes');
                return false;
            }
            return mesSeleccionado;
        }
    }).then((result) => {
        if (result.isConfirmed) {
            const mesSeleccionado = parseInt(result.value);
            const mes = meses.find(m => m.id == mesSeleccionado);
            let diasMes = mes.dias;

            // Ajustar días para febrero en años bisiestos
            if (mesSeleccionado == 2) {
                const añoActual = new Date().getFullYear();
                if ((añoActual % 4 === 0 && añoActual % 100 !== 0) || (añoActual % 400 === 0)) {
                    diasMes = 29;
                }
            }

            // Cargar los estudiantes desde localStorage
            const students = JSON.parse(localStorage.getItem('students')) || [];

            // Filtrar estudiantes con ausencias en el mes seleccionado
            const estudiantesFiltrados = students.filter(student => {
                const ausencias = student.absences || [];
                return ausencias.some(absence => {
                    const dateParts = absence.date.split('-');
                    const date = new Date(dateParts[0], dateParts[1] - 1, dateParts[2]);
                    return date.getMonth() + 1 === mesSeleccionado;
                });
            });

            if (estudiantesFiltrados.length === 0) {
                Swal.fire('No hay estudiantes', 'No se encontraron estudiantes con ausencias en este mes.', 'info');
                return;
            }

            // Crear la tabla de asistencia
            let estudiantesHTML = 
 ` 
           <div class="p-3">
           <div class="btn-group" role="group" aria-label="Basic example">
  <button type="button"  id="copiarNombresBtn" class="btn btn-primary">Copiar Nombres</button>

  <button type="button" id="copiarAusenciasBtn" class="btn btn-primary">Copiar Ausencias</button>
</div>
               
</div>

   `+
            '<table class="table p-2">';
            estudiantesHTML += '<br><thead><tr><th>Nombre</th><th>Ausencias</th></tr></thead><tbody>';

            // Preparar datos para copiar
            let nombresParaCopiar = [];
            let ausenciasParaCopiar = [];

            estudiantesFiltrados.forEach(estudiante => {
                estudiantesHTML += `<tr><td>${estudiante.name}</td>`;

                // Filtrar y ordenar ausencias por día del mes
                const ausenciasMes = (estudiante.absences || []).filter(absence => {
                    const dateParts = absence.date.split('-');
                    const date = new Date(dateParts[0], dateParts[1] - 1, dateParts[2]);
                    return date.getMonth() + 1 === mesSeleccionado;
                }).sort((a, b) => {
                    const dateA = new Date(a.date);
                    const dateB = new Date(b.date);
                    return dateA - dateB;
                });

                // Crear array de ausencias ordenadas por día
                const ausenciasPorDia = Array(diasMes).fill('');
                ausenciasMes.forEach(absence => {
                    const dateParts = absence.date.split('-');
                    const dia = parseInt(dateParts[2]);
                    ausenciasPorDia[dia - 1] = absence.type;
                });

                // Mostrar en tabla
                const tiposAusencia = ausenciasMes.length > 0 
                    ? ausenciasMes.map(absence => absence.type).join(', ')
                    : 'No hay ausencias';

                estudiantesHTML += `<td>${tiposAusencia}</td></tr>`;
                
                // Preparar datos para copiar
                nombresParaCopiar.push(estudiante.name);
                ausenciasParaCopiar.push(ausenciasPorDia.join(','));
            });

            estudiantesHTML += '</tbody></table>';

            // Mostrar el modal con la lista de estudiantes
            Swal.fire({
                html: `
                    <div>${estudiantesHTML}</div>
              `,
                showCloseButton: true,
                showCancelButton: true,
                cancelButtonText: 'Cancelar',
                didOpen: () => {
                    // Copiar nombres (simple lista)
                    document.getElementById('copiarNombresBtn').addEventListener('click', () => {
                        const textoACopiar = nombresParaCopiar.join('\n');
                        navigator.clipboard.writeText(textoACopiar).then(() => {
                            Swal.fire('Copiado', 'Los nombres se han copiado al portapapeles.', 'success');
                        });
                    });
                    
                    // Copiar ausencias en formato Excel (columnas separadas)
                    document.getElementById('copiarAusenciasBtn').addEventListener('click', () => {
                        // Crear un string con formato TSV (tab-separated values)
                        let textoACopiar = '';
                        
                        // Primera fila: encabezados (días del mes)
                        const encabezados = Array.from({length: diasMes}, (_, i) => i + 1);
                        textoACopiar += encabezados.join('\t') + '\n';
                        
                        // Filas siguientes: datos de ausencias
                        ausenciasParaCopiar.forEach(ausencias => {
                            textoACopiar += ausencias.split(',').join('\t') + '\n';
                        });
                        
                        // Usar el objeto Clipboard para copiar como texto plano con tabs
                        navigator.clipboard.writeText(textoACopiar).then(() => {
                            Swal.fire('Copiado', 'Las ausencias se han copiado en formato Excel.', 'success');
                        });
                    });
                }
            });
        }
    });
}
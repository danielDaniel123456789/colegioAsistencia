function informeMesAsistencia() {
    const students = JSON.parse(localStorage.getItem('students')) || [];
    const grupos = JSON.parse(localStorage.getItem('grupos')) || [];

    const meses = [
        { id: 1, nombre: 'Enero', dias: 31 }, { id: 2, nombre: 'Febrero', dias: 28 },
        { id: 3, nombre: 'Marzo', dias: 31 }, { id: 4, nombre: 'Abril', dias: 30 },
        { id: 5, nombre: 'Mayo', dias: 31 }, { id: 6, nombre: 'Junio', dias: 30 },
        { id: 7, nombre: 'Julio', dias: 31 }, { id: 8, nombre: 'Agosto', dias: 31 },
        { id: 9, nombre: 'Septiembre', dias: 30 }, { id: 10, nombre: 'Octubre', dias: 31 },
        { id: 11, nombre: 'Noviembre', dias: 30 }, { id: 12, nombre: 'Diciembre', dias: 31 }
    ];

    let selectMesHTML = '<select id="mesSelect" class="swal2-select">';
    meses.forEach(mes => selectMesHTML += `<option value="${mes.id}">${mes.nombre}</option>`);
    selectMesHTML += '</select>';

    let selectGrupoHTML = '<select id="grupoSelect" class="swal2-select">';
    grupos.forEach(grupo => selectGrupoHTML += `<option value="${grupo.id}">${grupo.nombre}</option>`);
    selectGrupoHTML += '</select>';

    Swal.fire({
        title: 'Selecciona un mes y un grupo',
        html: `
            <label>Mes:</label> ${selectMesHTML} <br><br>
            <label>Grupo:</label> ${selectGrupoHTML}
        `,
        showCancelButton: true,
        confirmButtonText: 'Siguiente',
        cancelButtonText: 'Cancelar',
        preConfirm: () => {
            const mesSeleccionado = parseInt(document.getElementById('mesSelect').value);
            const grupoSeleccionado = document.getElementById('grupoSelect').value;
            if (!mesSeleccionado || !grupoSeleccionado) {
                Swal.showValidationMessage('Por favor selecciona un mes y un grupo');
                return false;
            }
            return { mes: mesSeleccionado, grupo: grupoSeleccionado };
        }
    }).then((result) => {
        if (!result.isConfirmed) return;
        const { mes, grupo } = result.value;

        let diasMes = meses.find(m => m.id === mes).dias;
        if (mes === 2) { // Ajuste de año bisiesto
            const añoActual = new Date().getFullYear();
            if ((añoActual % 4 === 0 && añoActual % 100 !== 0) || (añoActual % 400 === 0)) {
                diasMes = 29;
            }
        }

        // Filtrar estudiantes que pertenecen al grupo y tienen ausencias en el mes seleccionado
        const estudiantesFiltrados = students.filter(student => 
            student.groupId == grupo && (student.absences || []).some(absence => {
                const [año, mesAusencia] = absence.date.split('-').map(Number);
                return mesAusencia === mes;
            })
        );

        if (estudiantesFiltrados.length === 0) {
            Swal.fire('No hay estudiantes', 'No se encontraron estudiantes con ausencias en este mes y grupo.', 'info');
            return;
        }

        let estudiantesHTML = `
            <div class="p-3">
                <div class="btn-group">
                    <button id="copiarNombresBtn" class="btn btn-primary">Copiar Nombres</button>
                    <button id="copiarAusenciasBtn" class="btn btn-primary">Copiar Ausencias</button>
                </div>
            </div>
            <table class="table p-2">
                <thead><tr><th>Nombre</th><th>Ausencias</th></tr></thead><tbody>`;

        let nombresParaCopiar = [];
        let ausenciasParaCopiar = [];

        estudiantesFiltrados.forEach(estudiante => {
            estudiantesHTML += `<tr><td>${estudiante.name}</td>`;

            const ausenciasMes = (estudiante.absences || [])
                .filter(absence => parseInt(absence.date.split('-')[1]) === mes)
                .sort((a, b) => new Date(a.date) - new Date(b.date));

            const ausenciasPorDia = Array(diasMes).fill('');
            ausenciasMes.forEach(absence => {
                const dia = parseInt(absence.date.split('-')[2]);
                ausenciasPorDia[dia - 1] = absence.type;
            });

            const tiposAusencia = ausenciasMes.length > 0 
                ? ausenciasMes.map(absence => absence.type).join(', ')
                : 'No hay ausencias';

            estudiantesHTML += `<td>${tiposAusencia}</td></tr>`;
            nombresParaCopiar.push(estudiante.name);
            ausenciasParaCopiar.push(ausenciasPorDia.join(','));
        });

        estudiantesHTML += '</tbody></table>';

        Swal.fire({
            html: `<div>${estudiantesHTML}</div>`,
            showCloseButton: true,
            showCancelButton: true,
            cancelButtonText: 'Cancelar',
            didOpen: () => {
                document.getElementById('copiarNombresBtn').addEventListener('click', () => {
                    navigator.clipboard.writeText(nombresParaCopiar.join('\n')).then(() => {
                        Swal.fire('Copiado', 'Los nombres se han copiado al portapapeles.', 'success');
                    });
                });

                document.getElementById('copiarAusenciasBtn').addEventListener('click', () => {
                    let textoACopiar = Array.from({ length: diasMes }, (_, i) => i + 1).join('\t') + '\n';
                    ausenciasParaCopiar.forEach(ausencias => {
                        textoACopiar += ausencias.split(',').join('\t') + '\n';
                    });

                    navigator.clipboard.writeText(textoACopiar).then(() => {
                        Swal.fire('Copiado', 'Las ausencias se han copiado en formato Excel.', 'success');
                    });
                });
            }
        });
    });
}

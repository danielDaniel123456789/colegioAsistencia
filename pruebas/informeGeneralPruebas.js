function informeGeneralPruebas() {
    // Recuperar los grupos desde localStorage
    const grupos = JSON.parse(localStorage.getItem('grupos')) || [];

    if (!grupos || grupos.length === 0) {
        Swal.fire('Error', 'No se encontraron grupos en el almacenamiento local.', 'error');
        return;
    }

    let selectGruposHTML = '<select id="grupoSelect" class="swal2-select">';
    grupos.forEach(grupo => {
        selectGruposHTML += `<option value="${grupo.id}">${grupo.nombre}</option>`;
    });
    selectGruposHTML += '</select>';

    Swal.fire({
        title: 'Selecciona un grupo',
        html: selectGruposHTML,
        showCancelButton: true,
        confirmButtonText: 'Siguiente',
        cancelButtonText: 'Cancelar',
        preConfirm: () => {
            const grupoSeleccionado = document.getElementById('grupoSelect').value;
            if (!grupoSeleccionado) {
                Swal.showValidationMessage('Por favor selecciona un grupo');
                return false;
            }
            return grupoSeleccionado;
        }
    }).then((result) => {
        if (result.isConfirmed) {
            const grupoSeleccionado = result.value;

            const materias = JSON.parse(localStorage.getItem('materias')) || [];

            if (!materias || materias.length === 0) {
                Swal.fire('Error', 'No se encontraron materias en el almacenamiento local.', 'error');
                return;
            }

            let selectMateriasHTML = '<select id="materiaSelect" class="swal2-select">';
            materias.forEach(materia => {
                selectMateriasHTML += `<option value="${materia.id}">${materia.nombre}</option>`;
            });
            selectMateriasHTML += '</select>';

            Swal.fire({
                title: 'Selecciona una materia',
                html: selectMateriasHTML,
                showCancelButton: true,
                confirmButtonText: 'Mostrar Informe',
                cancelButtonText: 'Cancelar',
                preConfirm: () => {
                    const materiaSeleccionada = document.getElementById('materiaSelect').value;
                    if (!materiaSeleccionada) {
                        Swal.showValidationMessage('Por favor selecciona una materia');
                        return false;
                    }
                    return materiaSeleccionada;
                }
            }).then((result) => {
                if (result.isConfirmed) {
                    const materiaSeleccionada = result.value;

                    const estudiantes = JSON.parse(localStorage.getItem('students')) || [];
                    
                    const estudiantesFiltrados = estudiantes.filter(estudiante => 
                        estudiante.groupId == grupoSeleccionado && estudiante.materiaId == materiaSeleccionada
                    );

                    if (estudiantesFiltrados.length === 0) {
                        Swal.fire('No hay estudiantes', 'No se encontraron estudiantes para este grupo y materia.', 'info');
                        return;
                    }

                    let pruebasUnicas = [];
                    estudiantesFiltrados.forEach(estudiante => {
                        // Add check for pruebas existence
                        if (estudiante.pruebas && Array.isArray(estudiante.pruebas)) {
                            estudiante.pruebas.forEach(prueba => {
                                if (!pruebasUnicas.some(p => p.id === prueba.id)) {
                                    pruebasUnicas.push(prueba);
                                }
                            });
                        }
                    });

                    let estudiantesHTML = '<table class="table p-2">';
                    estudiantesHTML += '<thead><tr><th>Nombre de estudiantes</th>';

                    if (pruebasUnicas && pruebasUnicas.length > 0) {
                        pruebasUnicas.forEach(prueba => {
                            estudiantesHTML += `<th>Prueba ${prueba.id} (${prueba.date})</th>`;
                        });
                    } else {
                        estudiantesHTML += '<th>No hay pruebas disponibles</th>';
                    }

                    estudiantesHTML += '</tr></thead><tbody>';

                    estudiantesFiltrados.forEach(estudiante => {
                        estudiantesHTML += `<tr><td>${estudiante.name} </td>`;

                        if (pruebasUnicas && pruebasUnicas.length > 0) {
                            pruebasUnicas.forEach(prueba => {
                                // Check if student has pruebas and find the matching one
                                const pruebaEstudiante = (estudiante.pruebas && Array.isArray(estudiante.pruebas)) 
                                    ? estudiante.pruebas.find(p => p.id === prueba.id)
                                    : null;
                                estudiantesHTML += `<td>${pruebaEstudiante ? pruebaEstudiante.puntos : 'Sin puntos'} </td>`;
                            });
                        } else {
                            estudiantesHTML += '<td>Sin pruebas</td>';
                        }

                        estudiantesHTML += '</tr>';
                    });

                    estudiantesHTML += '</tbody></table>';

                    // Obtener los nombres del grupo y la materia para el título
                    const nombreGrupo = grupos.find(g => g.id == grupoSeleccionado)?.nombre || 'Grupo desconocido';
                    const nombreMateria = materias.find(m => m.id == materiaSeleccionada)?.nombre || 'Materia desconocida';

                    Swal.fire({
                        title: `Informe de Pruebas - ${nombreGrupo} - ${nombreMateria}`,
                        html: estudiantesHTML + ` 
                            <button id="copiarNombresBtn" class="swal2-confirm swal2-styled" style="margin-top: 20px;">Copiar Nombres</button>
                            <button id="copiarPruebasBtn" class="swal2-confirm swal2-styled" style="margin-top: 20px;">Copiar Pruebas</button>
                        `,
                        showCloseButton: true,
                        showCancelButton: true,
                        cancelButtonText: 'Cerrar'
                    });

                    // Copiar los nombres
                    document.getElementById('copiarNombresBtn').addEventListener('click', () => {
                        const filas = document.querySelectorAll('table tbody tr');
                        let textoCopiar = '';

                        filas.forEach(fila => {
                            const nombre = fila.querySelector('td:first-child').innerText;
                            textoCopiar += nombre + '\n';
                        });

                        navigator.clipboard.writeText(textoCopiar).then(() => {
                            Swal.fire('Copiado', 'Los nombres han sido copiados al portapapeles.', 'success');
                        }).catch(() => {
                            Swal.fire('Error', 'No se pudieron copiar los nombres', 'error');
                        });
                    });

                    // Copiar las pruebas
                    document.getElementById('copiarPruebasBtn').addEventListener('click', () => {
                        const pruebasTexto = estudiantesFiltrados.map(estudiante => {
                            // Check if pruebas exists and is an array
                            const pruebas = (estudiante.pruebas && Array.isArray(estudiante.pruebas))
                                ? estudiante.pruebas.map(prueba => prueba.puntos || 'Sin puntos').join('\t')
                                : '0';
                            return pruebas;
                        }).join('\n');

                        navigator.clipboard.writeText(pruebasTexto).then(() => {
                            Swal.fire('Copiado', 'Las pruebas han sido copiadas al portapapeles.', 'success');
                        }).catch(() => {
                            Swal.fire('Error', 'No se pudieron copiar las pruebas', 'error');
                        });
                    });
                }
            });
        }
    });
}
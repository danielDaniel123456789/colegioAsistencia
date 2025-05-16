function informeGeneralTareas() {
    // Recuperar los grupos desde localStorage
    const grupos = JSON.parse(localStorage.getItem('grupos')) || [];

    // Verificar si los grupos existen en localStorage
    if (!grupos || grupos.length === 0) {
        Swal.fire('Error', 'No se encontraron grupos en el almacenamiento local.', 'error');
        return;
    }

    // Crear el HTML del select para los grupos
    let selectGruposHTML = '<select id="grupoSelect" class="swal2-select">';
    grupos.forEach(grupo => {
        selectGruposHTML += `<option value="${grupo.id}">${grupo.nombre}</option>`;
    });
    selectGruposHTML += '</select>';

    // Mostrar el primer modal con SweetAlert2 para seleccionar el grupo
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

            // Cargar las materias desde localStorage
            const materias = JSON.parse(localStorage.getItem('materias')) || [];

            // Verificar si las materias existen en localStorage
            if (!materias || materias.length === 0) {
                Swal.fire('Error', 'No se encontraron materias en el almacenamiento local.', 'error');
                return;
            }

            // Crear el HTML del select para las materias
            let selectMateriasHTML = '<select id="materiaSelect" class="swal2-select">';
            materias.forEach(materia => {
                selectMateriasHTML += `<option value="${materia.id}">${materia.nombre}</option>`;
            });
            selectMateriasHTML += '</select>';

            // Mostrar el segundo modal con SweetAlert2 para seleccionar la materia
            Swal.fire({
                title: 'Selecciona una materia',
                html: selectMateriasHTML,
                showCancelButton: true,
                showCloseButton: true,
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

                    // Recuperar los estudiantes desde localStorage
                    const estudiantes = JSON.parse(localStorage.getItem('students')) || [];

                    // Filtrar estudiantes por grupo y materia seleccionados
                    const estudiantesFiltrados = estudiantes.filter(estudiante =>
                        estudiante.groupId == grupoSeleccionado && estudiante.materiaId == materiaSeleccionada
                    );

                    // Verificar si hay estudiantes filtrados
                    if (estudiantesFiltrados.length === 0) {
                        Swal.fire('No hay estudiantes', 'No se encontraron estudiantes para este grupo y materia.', 'info');
                        return;
                    }

                    // Obtener todas las tareas únicas para ese grupo y materia
                    let tareasUnicas = [];
                    estudiantesFiltrados.forEach(estudiante => {
                        // Check if tareas exists and is an array
                        if (estudiante.tareas && Array.isArray(estudiante.tareas)) {
                            estudiante.tareas.forEach(tarea => {
                                if (!tareasUnicas.some(t => t.id === tarea.id)) {
                                    tareasUnicas.push(tarea);
                                }
                            });
                        }
                    });

                    // Crear la tabla HTML para las tareas
                    let estudiantesHTML = '<table class="table p-2">';
                    estudiantesHTML += '<thead><tr><th>Nombre de estudiantes</th>';

                    // Crear las cabeceras de las tareas
                    if (tareasUnicas.length > 0) {
                        tareasUnicas.forEach(tarea => {
                            estudiantesHTML += `<th>Tarea ${tarea.id}</th>`;
                        });
                    } else {
                        estudiantesHTML += '<th>No hay tareas disponibles</th>';
                    }
                    estudiantesHTML += '</tr></thead><tbody>';

                    // Recorrer los estudiantes y sus tareas
                    estudiantesFiltrados.forEach(estudiante => {
                        estudiantesHTML += `<tr><td>${estudiante.name}</td>`;

                        // Crear las columnas de tareas para cada estudiante
                        if (tareasUnicas.length > 0) {
                            tareasUnicas.forEach(tarea => {
                                // Check if student has tareas and find the matching one
                                const tareaEstudiante = (estudiante.tareas && Array.isArray(estudiante.tareas))
                                    ? estudiante.tareas.find(t => t.id === tarea.id)
                                    : null;
                                const puntos = tareaEstudiante 
                                    ? (tareaEstudiante.puntos || tareaEstudiante.score || 'Sin puntos')
                                    : '0';
                                estudiantesHTML += `<td>${puntos}</td>`;
                            });
                        } else {
                            estudiantesHTML += '<td>Sin tareas</td>';
                        }

                        estudiantesHTML += '</tr>';
                    });

                    estudiantesHTML += '</tbody></table>';

                    // Mostrar el informe en un modal
                    Swal.fire({
                        title: 'Informe General de Tareas',
                        html: `
                            <div id="footerCopiado" class="p-4 bg-warning text-center" style="display:none">
                                <h3>Copiado, pégalo en tu grupo de WhatsApp</h3>
                                <i class="fa fa-cog fa-spin fa-3x fa-fw"></i>
                                <span class="sr-only">Loading...</span>
                            </div>
                            <div>${estudiantesHTML}</div>
                            <button id="copiarNombresBtn" class="swal2-confirm swal2-styled" style="margin-top: 20px;">Copiar Nombres</button>
                            <button id="copiarPuntuacionesBtn" class="swal2-confirm swal2-styled" style="margin-top: 20px;">Copiar Puntuaciones</button>
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
                            const footer = document.getElementById('footerCopiado');
                            if (footer) {
                                footer.style.display = 'block';
                                setTimeout(() => {
                                    footer.style.display = 'none';
                                }, 4000);
                            }
                        }).catch(() => {
                            Swal.fire('Error', 'No se pudieron copiar los nombres', 'error');
                        });
                    });

                    // Copiar las puntuaciones
                    document.getElementById('copiarPuntuacionesBtn').addEventListener('click', () => {
                        const puntuacionesTexto = estudiantesFiltrados.map(estudiante => {
                            // Check if tareas exists and is an array
                            if (estudiante.tareas && Array.isArray(estudiante.tareas)) {
                                return estudiante.tareas.map(tarea => tarea.puntos || tarea.score || 'Sin puntos').join('\t');
                            }
                            return 'Sin tareas';
                        }).join('\n');

                        navigator.clipboard.writeText(puntuacionesTexto).then(() => {
                            const footerCopiado = document.getElementById('footerCopiado');
                            if (footerCopiado) {
                                footerCopiado.style.display = 'block';
                                setTimeout(() => {
                                    footerCopiado.style.display = 'none';
                                }, 4000);
                            }
                        }).catch(() => {
                            Swal.fire('Error', 'No se pudieron copiar las puntuaciones', 'error');
                        });
                    });
                }
            });
        }
    });
}
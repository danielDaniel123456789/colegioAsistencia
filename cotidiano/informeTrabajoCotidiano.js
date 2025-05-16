

function informeTrabajoCotidiano() {
    const grupos = JSON.parse(localStorage.getItem('grupos')) || [];
    const materias = JSON.parse(localStorage.getItem('materias')) || [];
    const estudiantes = JSON.parse(localStorage.getItem('students')) || [];
    const meses = [
        { id: 1, nombre: 'Enero' }, { id: 2, nombre: 'Febrero' },
        { id: 3, nombre: 'Marzo' }, { id: 4, nombre: 'Abril' },
        { id: 5, nombre: 'Mayo' }, { id: 6, nombre: 'Junio' },
        { id: 7, nombre: 'Julio' }, { id: 8, nombre: 'Agosto' },
        { id: 9, nombre: 'Septiembre' }, { id: 10, nombre: 'Octubre' },
        { id: 11, nombre: 'Noviembre' }, { id: 12, nombre: 'Diciembre' }
    ];

    if (grupos.length === 0) {
        Swal.fire('Error', 'No se encontraron grupos en el almacenamiento local.', 'error');
        return;
    }

    let selectGruposHTML = '<select id="grupoSelect" class="swal2-select">';
    grupos.forEach(grupo => {
        selectGruposHTML += `<option value="${grupo.id}">${grupo.nombre}</option>`;
    });
    selectGruposHTML += '</select>';

    let selectMesHTML = '<select id="mesSelect" class="swal2-select">';
    meses.forEach(mes => selectMesHTML += `<option value="${mes.id}">${mes.nombre}</option>`);
    selectMesHTML += '</select>';

    Swal.fire({
        title: 'Selecciona un grupo y un mes',
        html: `
            <label>Grupo:</label> ${selectGruposHTML} <br><br>
            <label>Mes:</label> ${selectMesHTML}
        `,
        showCancelButton: true,
        showCloseButton: true,
        
        confirmButtonText: 'Siguiente',
        preConfirm: () => {
            const grupoSeleccionado = document.getElementById('grupoSelect').value;
            const mesSeleccionado = document.getElementById('mesSelect').value;
            if (!grupoSeleccionado || !mesSeleccionado) {
                Swal.showValidationMessage('Por favor selecciona un grupo y un mes');
                return false;
            }
            return { grupo: grupoSeleccionado, mes: mesSeleccionado };
        }
    }).then((result) => {
        if (result.isConfirmed) {
            const { grupo, mes } = result.value;
            const grupoSeleccionado = grupos.find(g => g.id.toString() === grupo.toString());

            if (materias.length === 0) {
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
                showCloseButton: true,
                confirmButtonText: 'Siguiente',
                preConfirm: () => {
                    const materiaSeleccionada = document.getElementById('materiaSelect').value;
                    return materiaSeleccionada ? materiaSeleccionada : Swal.showValidationMessage('Por favor selecciona una materia');
                }
            }).then((result) => {
                if (result.isConfirmed) {
                    const materiaSeleccionada = materias.find(materia => materia.id.toString() === result.value.toString());

                    const estudiantesDelGrupo = estudiantes.filter(est =>
                        est.groupId && est.groupId.toString() === grupoSeleccionado.id.toString()
                    );

                    let maxTrabajos = 0;
                    let trabajosPorEstudiante = {};

                    estudiantesDelGrupo.forEach(estudiante => {
                        let trabajosEstudiante = estudiante.trabajoCotidiano
                            ? estudiante.trabajoCotidiano.filter(trabajo => {
                                const [año, mesTrabajo] = trabajo.date.split('-').map(Number);
                                return mesTrabajo === parseInt(mes);
                            }).map(trabajo => trabajo.type)
                            : [];

                        trabajosPorEstudiante[estudiante.name] = trabajosEstudiante;
                        maxTrabajos = Math.max(maxTrabajos, trabajosEstudiante.length);
                    });

                    let tableHTML = `

                    <div id="avisoCopiado"  class="alert alert-primary" style="display: none; ">
   <h2>"Ya lo copié. Ahora abrí WhatsApp y pegalo."</h2>

</div>


                    <div style="overflow-x: auto;">
                        <table class="table" id="trabajoTable">
                            <thead>
                                <tr>
                                    <th><i class="fa fa-user-circle-o" aria-hidden="true"></i></th>
                                    ${Array.from({ length: maxTrabajos }, (_, i) => `<th> #</th>`).join('')}
                                </tr>
                            </thead>
                            <tbody>`;

                    estudiantesDelGrupo.forEach(estudiante => {
                        const inicial = estudiante.name.charAt(0).toUpperCase(); // Obtener la inicial
                       // Cambiar el avatar para incluir el atributo data-nombre con el nombre del estudiante
const avatarHTML = `<div class="avatar" data-nombre="${estudiante.name}">${inicial}</div>`; 

                        tableHTML += `<tr><td>${avatarHTML}</td>`;

                        let trabajos = trabajosPorEstudiante[estudiante.name] || [];
                        for (let i = 0; i < maxTrabajos; i++) {
                            tableHTML += `<td>${trabajos[i] || ''}</td>`;
                        }

                        tableHTML += `</tr>`;
                    });

                    tableHTML += `</tbody></table>
                    </div>`;

                    Swal.fire({
                        html: `
                        <div class="p-2">
                            <h5><strong>Grupo:</strong> ${grupoSeleccionado.nombre}</h5>
                            <h5><strong>Materia:</strong> ${materiaSeleccionada.nombre}</h5>
                        </div>
                        <div>
                            <button class="swal2-confirm swal2-styled" onclick="copiarNombres()">Copiar nombres</button>
                            <button class="swal2-confirm swal2-styled" onclick="copiarTrabajos()">Copiar trabajos</button>
                        </div>
                        ${tableHTML}`,
                        width: '1000px',
                           showCloseButton: true ,
                    });
                }
            });
        }
    });
}

function copiarNombres() {
    let nombres = [];
    document.querySelectorAll("#trabajoTable tbody tr").forEach(tr => {
        let nombre = tr.querySelector("td:first-child .avatar").getAttribute("data-nombre");
        nombres.push(nombre);
    });

    const textoCopiar = nombres.join("\n");

    navigator.clipboard.writeText(textoCopiar).then(() => {
        // Mostrar el aviso de copiado
        document.getElementById("avisoCopiado").style.display = "block";
        setTimeout(() => {
            document.getElementById("avisoCopiado").style.display = "none";
        }, 5000);
    }).catch(err => {
        console.error('Error al copiar nombres:', err);
    });
}

function copiarTrabajos() {
    let trabajos = [];
    document.querySelectorAll("#trabajoTable tbody tr").forEach(tr => {
        let celdas = [...tr.querySelectorAll("td:not(:first-child)")].map(td => td.textContent.trim());
        trabajos.push(celdas.join("\t"));
    });

    const textoCopiar = trabajos.join("\n");

    navigator.clipboard.writeText(textoCopiar).then(() => {
        // Mostrar el aviso de copiado
        document.getElementById("avisoCopiado").style.display = "block";
        setTimeout(() => {
            document.getElementById("avisoCopiado").style.display = "none";
        }, 5000);
    }).catch(err => {
        console.error('Error al copiar trabajos:', err);
    });
}


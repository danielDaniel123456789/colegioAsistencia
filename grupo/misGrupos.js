function misGrupos() {
    let grupos = JSON.parse(localStorage.getItem('grupos')) || [];

    if (grupos.length === 0) {
        Swal.fire('Información', 'No hay grupos guardados.', 'info');
        return;
    }

    let listaHTML = '<ul class="list-group">';
    grupos.forEach((grupo) => {
        listaHTML += `
            <li class="list-group-item d-flex justify-content-between align-items-center">
                ${grupo.nombre}
                <button class="btn btn-sm btn-warning" onclick="editarGrupo(${grupo.id})">
                    ✏️
                </button>
            </li>`;
    });
    listaHTML += '</ul>';

    Swal.fire({
        title: 'Mis Grupos',
        html: listaHTML,
        confirmButtonText: 'Cerrar',
    });
}

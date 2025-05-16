function addGrupo() {
    Swal.fire({
        title: 'Ingrese el nombre del grupo',
        input: 'text',
        inputPlaceholder: 'Ej: Grupo A',
        showCancelButton: true,
        confirmButtonText: 'Agregar',
        cancelButtonText: 'Cancelar',
        inputValidator: (value) => {
            if (!value) {
                return 'Debe ingresar un nombre';
            }
        }
    }).then((result) => {
        if (result.isConfirmed) {
            let grupos = JSON.parse(localStorage.getItem('grupos')) || [];

            // Generar un ID automático
            let nuevoId = grupos.length > 0 ? grupos[grupos.length - 1].id + 1 : 1;

            // Crear el nuevo grupo con ID
            let nuevoGrupo = {
                id: nuevoId,
                nombre: result.value
            };

            grupos.push(nuevoGrupo);
            localStorage.setItem('grupos', JSON.stringify(grupos));

            Swal.fire('Agregado', 'El grupo ha sido guardado', 'success');
        }
    });
}

function obtenerValorLocalStorage(nombreLocalStore, id) {
    let datos = localStorage.getItem(nombreLocalStore);
    if (!datos) {
        return null;
    }

    try {
        datos = JSON.parse(datos);
    } catch (e) {
        console.error("Error al parsear los datos de localStorage:", e);
        return null;
    }

    if (Array.isArray(datos)) {
        return datos.find(item => item.id === id) || null;
    }

    return datos[id] || null;
}

function cargarDatos() {
    let nombreLocalStore = document.getElementById("nombreLocalStore").value;
    let id = parseInt(document.getElementById("id").value);

    if (!nombreLocalStore || isNaN(id)) {
        Swal.fire({
            icon: 'warning',
            title: 'Datos inválidos',
            text: 'Por favor, ingrese valores válidos.',
        });
        return;
    }

    let resultado = obtenerValorLocalStorage(nombreLocalStore, id);

    if (resultado) {
        Swal.fire({
            icon: 'success',
            title: 'Datos encontrados',
            html: `<pre>${JSON.stringify(resultado, null, 2)}</pre>`,
        });
    } else {
        Swal.fire({
            icon: 'error',
            title: 'No encontrado',
            text: 'No se encontraron datos con ese ID.',
        });
    }
}


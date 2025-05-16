function mostrarModalCaducot() {
    let intentosRestantes = localStorage.getItem('conteoCodigoActivacion');

    if (intentosRestantes === null) {
        intentosRestantes = 25;
    } else {
        intentosRestantes = parseInt(intentosRestantes, 10);
    }

    f = obtenerRegistroAsistencia();
    console.log(f);

    const claveAleatoria = obtenerRegistroAsistencia();

    Swal.fire({
        html: `
        <div class="p-4">
            <h5>Código de Activación:</h5>
            <h3>${obtenerRegistroAsistencia().slice(0, 3)}</h3>
            <input id="claveInput" class="swal2-input" placeholder="Escribe la clave completa">
            <p hidden>Intentos restantes: <b>${intentosRestantes}</b></p>
        </div>
        `,
        focusConfirm: false,
        showCancelButton: intentosRestantes > 1,
        confirmButtonText: 'Verificar',
        cancelButtonText: 'Cancelar', // <-- Aquí agregamos esto
        allowOutsideClick: false,
        preConfirm: () => {
            const claveInput = document.getElementById('claveInput').value.trim();

            if (claveInput === '') {
                Swal.showValidationMessage('Este campo es obligatorio');
                return false;
            }

            if (claveInput === claveAleatoria) {
                Swal.fire({
                    icon: 'success',
                    title: 'Clave correcta',
                    text: 'Has ingresado la clave correctamente.',
                });

                localStorage.setItem('estadoUsuarioRegistrado', JSON.stringify(1));
                return true;
            } else {
                intentosRestantes--;

                if (intentosRestantes <= 0) {
                    Swal.fire({
                        icon: 'error',
                        title: 'Acceso bloqueado',
                        text: 'Has agotado todos tus intentos.',
                    });

                    localStorage.setItem('conteoCodigoActivacion', "0");
                    return false;
                } else {
                    localStorage.setItem('conteoCodigoActivacion', intentosRestantes.toString());
                    Swal.showValidationMessage(`Clave incorrecta. Intentos restantes: ${intentosRestantes}`);
                    return false;
                }
            }
        },
        footer: `<h3>Para obtener la clave contacta al <span class="text-danger">85502748<span></h3>`,
    }).then((result) => {
        if (result.dismiss === Swal.DismissReason.cancel) {
            intentosRestantes--;
            localStorage.setItem('conteoCodigoActivacion', intentosRestantes.toString());

            if (intentosRestantes <= 0) {
                Swal.fire({
                    icon: 'error',
                    title: 'Acceso bloqueado',
                    text: 'Has agotado todos tus intentos.',
                });
            }
        }
    });
}

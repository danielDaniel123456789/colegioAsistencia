function informesPresentar() {
    Swal.fire({
        html: `
        <div style="padding: 10px;">
            <h3 style="margin-bottom: 15px; text-align:center;">📊 Elige un tipo de informe</h3>
            <div style="display: flex; flex-direction: column; gap: 15px;">
                <button onclick="informeTrabajoCotidiano()" class="swal-btn-card">🗂️ Informe de  trabajo Cotidiano</button>
                                <button onclick="informeMesAsistencia()" class="swal-btn-card">📅 Informe de asistencia</button>
                <button onclick="informeGeneralTareas()" class="swal-btn-card">📋  Informe de tareas</button>
                <button onclick="informeGeneralPruebas()" class="swal-btn-card">🧪  Informe de pruebas</button>

            </div>
        </div>
        `,
        showCloseButton: true,
        showConfirmButton: false,
        customClass: {
            popup: 'swal-custom'
        }
    });
}

// Estilos con diseño tipo card
const style = document.createElement('style');
style.innerHTML = `
    .swal-btn-card {
        background: #ffffff;
        color: #333;
        padding: 12px 16px;
        border: 1px solid #ddd;
        border-radius: 8px;
        cursor: pointer;
        font-size: 15px;
        box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        transition: all 0.2s ease-in-out;
        text-align: left;
    }

    .swal-btn-card:hover {
        background: #f0f8ff;
        border-color: #007bff;
        transform: translateY(-2px);
    }

    .swal-custom {
        width: 360px;
        border-radius: 12px;
        padding: 10px;
    }
`;
document.head.appendChild(style);

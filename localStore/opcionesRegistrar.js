function opcionesRegistrar(id, materia, grupo, cedula) {
    Swal.fire({

        html: `
        <br>
        <h4>Estudiante ${obtenerNombreEstudiante(id)}</h4>
        <h5>Materia: ${materia}</h5>
        <h5>Grupo: ${grupo}</h5>    
        <h6>Cédula: ${cedula}</h6>
  
     
            <table class="table">
                <tr>
                    <td><button type="button" class="btn btn-primary" onclick="registerAbsence(${id})">Ausencia</button>
                    <button type="button" class="btn btn-primary" onclick="viewAbsences(${id})">Informe</button>
                    </td>
                
                </tr>
                <tr>
                    <td><button type="button" class="btn btn-primary" onclick="trabajoCotidiano(${id})">Cotidiano</button>
                    <button type="button" class="btn btn-primary" onclick="resumeCotidiano(${id})">Informe</button>
                    </td>
               
                </tr>
                <tr>
                    <td><button type="button" class="btn btn-primary" onclick="registrarTarea(${id})">Tareas</button>
                    <button type="button" class="btn btn-primary" onclick="viewTasks(${id})">Informe</button>
                    </td>
              
                </tr>
                <tr>
                    <td><button type="button" class="btn btn-primary" onclick="registrarPrueba(${id})">Prueba</button>
                    <button type="button" class="btn btn-primary" onclick="viewPruebas(${id})">Informe</button>
                    </td>
               
                </tr>
            </table>
  
             <span class="btn btn-link btn-sm" onclick="editStudent(${id})">
               EDITAR ESTUDIANTE   ✏️
                  <!-- Carácter de lápiz -->
              </span>
        `,
        showCloseButton: true,
        showConfirmButton: false,
        customClass: {
            popup: 'text-start'
        }
    });
  }
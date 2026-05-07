document.addEventListener("DOMContentLoaded", cargarTurnos);

const tbody = document.getElementById("tbodyTurnos");

async function cargarTurnos() {

    try {

        const res = await fetch("http://localhost:3000/turnos");
        const data = await res.json();

        tbody.innerHTML = "";

        data.forEach(turno => {

            tbody.innerHTML += `
                <tr>
                    <td>${turno.nombre_paciente} ${turno.apellido_paciente}</td>
                    <td>${turno.telefono_paciente}</td>
                    <td>${turno.cedula_paciente}</td>
                    <td>${formatearFecha(turno.fecha_hora)}</td>
                    <td>${turno.especialidad}</td>
                    <td>${turno.nombre_profesional} ${turno.apellido_profesional}</td>
                    <td>${turno.estado}</td>
                    <td>
                        <button class="btn_editar"onclick="editarTurno(${turno.id_turno})">Editar</button>
                        <button class="btn_eliminar" onclick="eliminarTurno(${turno.id_turno})">Eliminar</button>
                    </td>
                </tr>
            `;
        });

    } catch(error) {
        console.log("Error al cargar turnos", error);
    }
}

function formatearFecha(fecha) {
    return new Date(fecha).toLocaleString("es-UY", {
        dateStyle: "short",
        timeStyle: "short"
    });
}

async function eliminarTurno(id) {

    const confirmar = confirm("¿Seguro que deseas eliminar este turno?");
    if (!confirmar) {
        return;
    }
    try {
        const res = await fetch(`http://localhost:3000/turnos/${id}`, {
            method: "DELETE"
        });
        const data = await res.json();
        alert(data.mensaje);
        cargarTurnos();

    } catch(error) {
        console.log("Error al eliminar", error);
    }
}

function editarTurno(id) {
    window.location.href = `editarTurno.html?id=${id}`;
}
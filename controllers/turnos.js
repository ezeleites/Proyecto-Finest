const URL = "http://localhost:3000/turnos";

const tbody = document.getElementById("tbodyTurnos");

document.addEventListener("DOMContentLoaded", obtenerTurnos);

async function obtenerTurnos() {
    try {
        const respuesta = await fetch(URL);
        const turnos = await respuesta.json();

        tbody.innerHTML = "";

        turnos.forEach(turno => {
            tbody.innerHTML += `
                <tr>
                    <td>${turno.nombre_paciente}</td>
                    <td>${turno.apellido_paciente}</td>
                    <td>${turno.telefono_paciente}</td>
                    <td>${turno.cedula_paciente}</td>
                    <td>${formatearFecha(turno.fecha_hora)}</td>
                    <td>${turno.especialidad}</td>
                    <td>${turno.nombre_profesional} ${turno.apellido_profesional}</td>
                    <td>${turno.observaciones || ""}</td>
                    <td>${turno.estado}</td>
                    <td>
                        <span class="estado ${turno.estado}">
                            ${turno.estado}
                        </span>
                    </td>
                </tr>
            `;
        });

    } catch (error) {
        console.log("Error al cargar turnos", error);
    }
}

function formatearFecha(fecha) {
    const f = new Date(fecha);

    return f.toLocaleString("es-UY", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit"
    });
}

async function eliminarTurno(id) {
    if (!confirm("¿Seguro que querés eliminar este turno?")) return;

    await fetch(`http://localhost:3000/turnos/${id}`, {
        method: "DELETE"
    });

    alert("Turno eliminado");
    location.reload();
}
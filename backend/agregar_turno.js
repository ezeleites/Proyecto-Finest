document.getElementById("formTurno")
.addEventListener("submit", guardarTurno);

const selectEspecialidad = document.getElementById("especialidad");
const selectProfesional = document.getElementById("profesional");

// Cuando carga la página
document.addEventListener("DOMContentLoaded", cargarEspecialidades);

// Cuando cambia la especialidad
selectEspecialidad.addEventListener("change", cargarProfesionales);

async function guardarTurno(e){
    e.preventDefault();

    // Obtener datos del form
    const nombre = document.getElementById("nombre").value;
    const apellido = document.getElementById("apellido").value;
    const cedula = document.getElementById("cedula").value;
    const telefono = document.getElementById("telefono").value;
    const id_profesional = document.getElementById("profesional").value;
    const fecha_hora = document.getElementById("fecha_hora").value;
    const observaciones = document.getElementById("observaciones").value;

    try {

        let id_paciente;

        const resBuscar = await fetch(`http://localhost:3000/pacientes/cedula/${cedula}`);

        if (resBuscar.ok) {

            const pacienteExistente = await resBuscar.json();
            id_paciente = pacienteExistente.id_paciente;

        } else {

            const resPaciente = await fetch("http://localhost:3000/pacientes", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    nombre,
                    apellido,
                    cedula,
                    telefono
                })
            });

            if (!resPaciente.ok) {
                throw new Error("Error al crear paciente");
            }

            const dataPaciente = await resPaciente.json();

            id_paciente = dataPaciente.id;
        }

        const resTurno = await fetch("http://localhost:3000/turnos", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                id_paciente,
                id_profesional,
                fecha_hora,
                estado: "Pendiente",
                observaciones
            })
        });

        const dataTurno = await resTurno.json();

        if (!resTurno.ok) {
            alert(dataTurno.error);
            return;
        }

        alert("Turno creado correctamente");
        window.location.href = "index.html";

        document.getElementById("formTurno").reset();

    } catch(error){
        console.log(error);
        alert("Error al guardar");
    }
}

async function cargarEspecialidades() {
    try {
        const res = await fetch("http://localhost:3000/especialidades");
        const data = await res.json();

        selectEspecialidad.innerHTML = '<option value="">Seleccione una especialidad</option>';

        data.forEach(esp => {
            selectEspecialidad.innerHTML += `
                <option value="${esp.id_especialidad}">
                    ${esp.nombre}
                </option>
            `;
        });

    } catch (error) {
        console.log("Error al cargar especialidades", error);
    }
}

async function cargarProfesionales() {
    const id_especialidad = selectEspecialidad.value;

    // Si no eligió nada
    if (!id_especialidad) {
        selectProfesional.innerHTML = '<option value="">Seleccione un profesional</option>';
        return;
    }

    try {
        const res = await fetch(`http://localhost:3000/profesionales/${id_especialidad}`);
        const data = await res.json();

        selectProfesional.innerHTML = '<option value="">Seleccione un profesional</option>';

        data.forEach(prof => {
            selectProfesional.innerHTML += `
                <option value="${prof.id_profesional}">
                    ${prof.nombre} ${prof.apellido}
                </option>
            `;
        });

    } catch (error) {
        console.log("Error al cargar profesionales", error);
    }
}
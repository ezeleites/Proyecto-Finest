document.getElementById("formTurno")
.addEventListener("submit", guardarTurno);

async function guardarTurno(e){
    e.preventDefault();

    // 1. Obtener datos del form
    const nombre = document.getElementById("nombre").value;
    const apellido = document.getElementById("apellido").value;
    const cedula = document.getElementById("cedula").value;
    const telefono = document.getElementById("telefono").value;
    const id_profesional = document.getElementById("profesional").value;
    const fecha_hora = document.getElementById("fecha_hora").value;

    try {
        // 2. Crear paciente
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

        const dataPaciente = await resPaciente.json();

        const id_paciente = dataPaciente.id;

        // 3. Crear turno
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
                observaciones: ""
            })
        });

        const dataTurno = await resTurno.json();

        alert("Turno creado correctamente");

    } catch(error){
        console.log(error);
        alert("Error al guardar");
    }
}
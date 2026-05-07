const express = require("express");
//esto me importa express
const cors = require("cors");
// importo cors
const conexion = require("../controllers/db.js");
// me traigo mi conexion creada en db.js

const app = express();
// creo una constante con la que puedo usar express

app.use(express.json());
app.use(cors());

app.get("/turnos", (req, res)=>{
    conexion.query("SELECT t.id_turno, t.fecha_hora, p.nombre AS nombre_paciente, p.apellido AS apellido_paciente, p.telefono AS telefono_paciente, p.cedula AS cedula_paciente, prof.nombre AS nombre_profesional, prof.apellido AS apellido_profesional, e.nombre AS especialidad, t.estado FROM turnos t JOIN pacientes p ON t.id_paciente = p.id_paciente JOIN profesionales prof ON t.id_profesional = prof.id_profesional JOIN especialidad e ON prof.id_especialidad = e.id_especialidad ORDER BY t.fecha_hora ASC;", (error, resultados)=>{
        if(error){
            return res.status(500).json(error);
        }

        res.json(resultados);
    });
});

app.post("/turnos", (req, res) => {
    const { id_paciente, id_profesional, fecha_hora, estado, observaciones } = req.body;

    if (!id_paciente || !id_profesional || !fecha_hora || !estado) {
        return res.status(400).json({
            error: "Todos los campos son obligatorios"
        });
    }

    const sql = "INSERT INTO turnos(id_paciente, id_profesional, fecha_hora, observaciones, estado) VALUES (?, ?, ?, ?, ?)";

    conexion.query(sql, [id_paciente, id_profesional, fecha_hora, observaciones, estado], (error, resultado) => {

        if (error) {
            if (error.code === "ER_DUP_ENTRY") {
                return res.status(400).json({
                    error: "Ese horario ya está ocupado para este profesional"
                });
            }

            return res.status(500).json({
                error: "Error al guardar el turno"
            });
        }

        res.status(201).json({
            mensaje: "Turno agregado correctamente",
            id: resultado.insertId
        });
    });
});

app.delete("/turnos/:id_turno", (req, res)=>{
    const id  = req.params.id_turno;
    const sql ="DELETE FROM turnos WHERE id_turno = ?";

    conexion.query(sql, [id], (error, resultado)=>{
        if(error){
            return res.status(500).json(error);
        }
        res.json({
            mensaje: "Turno eliminado"
        });
    });

});

app.put("/turnos/:id_turno", (req, res) => {
    const id = req.params.id_turno;
    const { id_paciente, id_profesional, fecha_hora, observaciones, estado } = req.body;

    if (!id || isNaN(id)) {
        return res.status(400).json({   
            error: "ID inválido"
        });
    }

    if (!id_paciente || !id_profesional || !fecha_hora || !estado) {
        return res.status(400).json({
            error: "Todos los campos son obligatorios"
        });
    }

    const sql = "UPDATE turnos SET id_paciente = ?, id_profesional = ?, fecha_hora = ?, observaciones = ?, estado = ? WHERE id_turno = ?";

    conexion.query(sql, [id_paciente, id_profesional, fecha_hora, observaciones, estado, id], (error, resultado) => {

        if (error) {
            if (error.code === "ER_DUP_ENTRY") {
                return res.status(400).json({
                    error: "Ese horario ya está ocupado para este profesional"
                });
            }

            return res.status(500).json({
                error: "Error al actualizar el turno"
            });
        }

        if (resultado.affectedRows === 0) {
            return res.status(404).json({
                error: "Turno no encontrado"
            });
        }

        res.json({
            mensaje: "Turno actualizado correctamente"
        });
    });
});

app.get("/turnos/:id_turno", (req, res) => {
    const id = req.params.id_turno;

    // Validar ID
    if (!id || isNaN(id)) {
        return res.status(400).json({
            error: "ID inválido"
        });
    }

    const sql = `
        SELECT 
            t.id_turno,
            t.id_paciente,
            t.id_profesional,
            t.fecha_hora,
            t.observaciones,
            t.estado,
            p.nombre AS nombre_paciente,
            p.apellido AS apellido_paciente,
            prof.nombre AS nombre_profesional,
            prof.apellido AS apellido_profesional,
            e.nombre AS especialidad
        FROM turnos t
        JOIN pacientes p ON t.id_paciente = p.id_paciente
        JOIN profesionales prof ON t.id_profesional = prof.id_profesional
        JOIN especialidad e ON prof.id_especialidad = e.id_especialidad
        WHERE t.id_turno = ?
    `;

    conexion.query(sql, [id], (error, resultados) => {

        if (error) {
            return res.status(500).json({
                error: "Error al obtener el turno"
            });
        }

        if (resultados.length === 0) {
            return res.status(404).json({
                error: "Turno no encontrado"
            });
        }

        res.json(resultados[0]);
    });
});

app.get("/especialidades", (req, res) => {
    conexion.query("SELECT * FROM especialidad", (error, resultados) => {
        if (error) return res.status(500).json(error);
        res.json(resultados);
    });
});

app.get("/profesionales/:id_especialidad", (req, res) => {
    const id = req.params.id_especialidad;

    const sql = "SELECT * FROM profesionales WHERE id_especialidad = ?";

    conexion.query(sql, [id], (error, resultados) => {
        if (error) return res.status(500).json(error);
        res.json(resultados);
    });
});

app.get("/pacientes/cedula/:cedula", (req, res) => {

    const cedula = req.params.cedula;

    const sql = "SELECT * FROM pacientes WHERE cedula = ?";

    conexion.query(sql, [cedula], (error, resultados) => {

        if (error) {
            return res.status(500).json(error);
        }

        if (resultados.length === 0) {
            return res.status(404).json({
                error: "Paciente no encontrado"
            });
        }

        res.json(resultados[0]);

    });
});

app.post("/pacientes", (req, res) => {

    const { nombre, apellido, cedula, telefono } = req.body;

    if (!nombre || !apellido || !cedula) {
        return res.status(400).json({
            error: "Faltan datos"
        });
    }

    const sql = `
        INSERT INTO pacientes(nombre, apellido, cedula, telefono)
        VALUES (?, ?, ?, ?)
    `;

    conexion.query(
        sql,
        [nombre, apellido, cedula, telefono],
        (error, resultado) => {

            if (error) {

                if (error.code === "ER_DUP_ENTRY") {
                    return res.status(400).json({
                        error: "La cédula ya existe"
                    });
                }

                return res.status(500).json(error);
            }

            res.status(201).json({
                mensaje: "Paciente creado",
                id: resultado.insertId
            });
        }
    );
});

app.listen(3000, ()=>{
    console.log("Servidor corriendo en http://localhost:3000");
});
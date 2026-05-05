// importar librería mysql2 que nos permite conectarnos a la base de datos
const mysql = require("mysql2");
// creo una conexión a la base
const conexion = mysql.createConnection({
    host: "127.0.0.1", // en clase siempre usamos esto
    user: "root", // el usuario que uso en mysql workbench (por defecto es root)
    password: "", // contraseña de mysql workbench (por defecto vacía)
    database: "consultorio_base",// el nombre de la base de datos que uso en mi backend
    port: 3306 // puerto que utiliza la conexión, por degecto 3306
});

conexion.connect((error)=>{
    // connect intenta conectarse con los datos de conexión
    if(error){
        //si hay error, muestro esto
        console.log("Error de conexion: ", error);
    }else{
        console.log("Conectado a mysql");
    }
});
/* esto lo exporto para poder usarlo en otro lado. 
    Si no está exportado, la conexión no es visisble desde otros archivos.
*/
module.exports = conexion;
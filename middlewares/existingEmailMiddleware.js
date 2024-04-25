const pool = require('../db/db');

const checkEmailExistsMiddleware = (req, res, next) => {
    let conn;
    pool.getConnection()
        .then(connection => {
            conn = connection;
            // Verificar si el correo electrónico ya está registrado
            conn.query('select 1 from usuario where correo = ?', [req.body.email])
                .then(([rows, fields]) => {
                    const exists = rows.length > 0;
                    if (exists) {
                        res.status(400).send({ message: 'El correo electrónico ya está registrado' });
                    } else {
                        next(); // Pasar al siguiente middleware si el correo electrónico no está registrado
                    }
                })
                .catch(error => {
                    console.error(error);
                    res.status(400).send('Error');
                    return ;
                })
        })
        .catch(error => {
            console.error(error);
            res.status(500).send('Error al conectar con la base de datos');
        })
        .finally(() => {
            if(conn){
                conn.release();
            }
        });
};

module.exports = checkEmailExistsMiddleware;
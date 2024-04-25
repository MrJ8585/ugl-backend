require('dotenv').config();
const express = require('express');
const authrouter = express.Router();
const pool = require('../db/db');
const bcrypt = require('bcrypt');
const existingEmailMiddleware = require('../middlewares/existingEmailMiddleware');
const generateAccessToken = require('../auth/generateJWT');

authrouter.post('/register', existingEmailMiddleware, (req, res) => {
    let conn;
    pool.getConnection()
        .then(connection => {
            conn = connection;
            bcrypt.hash(req.body.password, 10)
                .then(hash => {
                    conn.query('call registrarUsuarioCredenciales(?, ?, ?);', [req.body.user, hash, req.body.email])
                        .then(([rows, fields]) => {
                            res.send({rows: rows, message: 'Usuario registrado' });
                        })
                        .catch(error => {
                            console.error(error);
                            res.status(400).send('Error al registrar el usuario');
                        });
                })
                .catch(error => {
                    console.error(error);
                    res.status(500).send('Error al encriptar la contraseña');
                });
        })
        .catch(error => {
            console.error(error);
            res.status(500).send('Error al conectar con la base de datos');
        })
        .finally(() => {
            if (conn) {
                conn.release();
            }
        });
});

authrouter.post('/login', (req, res) => {
    let conn;
    pool.getConnection()
        .then(connection => {
            conn = connection;
            conn.query('select * from usuario where correo = ?', [req.body.correo])
                .then(([rows, fields]) => {
                    if (rows.length === 0) {
                        res.status(400).send({ message: 'Usuario no encontrado' });
                        return;
                    }
                    const user = rows[0];
                    bcrypt.compare(req.body.password, user.password)
                        .then(result => {
                            if (!result) {
                                res.status(400).send({ message: 'Contraseña incorrecta' });
                                return;
                            }
                            let tokens = generateAccessToken({ id_profile: user.id_Usuario, usuario: user.usuario, correo: user.correo });
                            res.cookie('refresh_token', tokens.refresh_token, { httpOnly: true, secure: true, sameSite: 'none' });
                            res.json(tokens);
                            return ;
                        })
                        .catch(error => {
                            console.error(error);
                            res.status(500).send('Error al comparar contraseñas');
                        });
                })
                .catch(error => {
                    console.error(error);
                    res.status(400).send('Error al buscar el usuario');
                });
        })
        .catch(error => {
            console.error(error);
            res.status(500).send('Error al conectar con la base de datos');
        })
        .finally(() => {
            if (conn) {
                conn.release();
            }
        });
});


module.exports = authrouter;
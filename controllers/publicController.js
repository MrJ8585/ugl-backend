require('dotenv').config();
const express = require('express');
const router = express.Router();
const pool = require('../db/db');
const checkEmailExistsMiddleware = require('../middlewares/existingEmailMiddleware');

router.post('/', checkEmailExistsMiddleware, (req, res) => {
    let conn;
    pool.getConnection()
    .then(connection => {
        conn = connection;
        conn.query('select * from banco')
        .then(([rows, fields]) => {
            res.send(rows);
        })
    })
    .catch(error => {
        console.error(error);
    })
    .finally(() => {
        if(conn){
            conn.release();
        }
    });
});

module.exports = router;

require('dotenv').config();
const express = require('express');
const router = express.Router();
const pool = require('../db/db');

router.get('/', (req, res) => {
    pool.getConnection()
    .then(conn => {
        conn.query('Select * from banco')
        .then(([rows, fields]) => {
            res.json(rows);
        })
        .catch(err => {
            console.log(err);
            res.status(500).send('Error');
        })
        .finally(() => {
            conn.release();
        });
    })
});

module.exports = router;

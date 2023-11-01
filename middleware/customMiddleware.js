const express = require('express');
const cors = require('cors');
const path = require('path');

const setCustomMiddleware = (app) => {
    app.use(express.json());
    app.use(cors({ origin: '*', methods: 'GET, HEAD, PUT, PATCH, POST, DELETE' }));
    app.use(function (req, res, next) {
        res.header('Content-Type', 'application/json; charset=UTF-8');
        next();
    });
    app.use(express.static(path.join(__dirname, 'src'), {
        setHeaders: (res, path, stat) => {
            if (path.endsWith('.html')) {
                res.set('Content-Type', 'text/html');
            }
            if (path.endsWith('.css')) {
                res.set('Content-Type', 'text/css');
            }
            if (path.endsWith('.js')) {
                res.set('Content-Type', 'text/javascript');
            }
        }
    }));
};

module.exports = setCustomMiddleware;
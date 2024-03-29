//login de usuarios
const express = require('express')
const router = express.Router()
const cors = require('cors')
const jwt = require('jsonwebtoken');
const { findOneUsersWhitEmail, findOneUsersWhitEmailAndPassword } = require('../../db/controllers')
const dataToken = process.env.DATA_TOKEN
router.post('/', cors(), async (req, res) => {

    try {
        const { email, password } = req.body

        if (!email || !password) {
            res.status(500).json({ message: 'Se espera un correo y una contraseña' })
            return
        }

        const userFinded = await findOneUsersWhitEmail(email)

        if (!userFinded) {
            res.status(500).json({ message: "Usuario no registrado" })
            return
        }

        const response = await findOneUsersWhitEmailAndPassword(email, password)

        if (response) {

            const userData = jwt.sign({response}, dataToken, { expiresIn: '10d' });
            res.status(200).json({ message: "success", userData })
            return
        } else {
            res.status(500).json({ message: "Usuario o contraseña incorrecta" })
        }

    } catch (error) {
        console.log(error)
        res.end(error)
    }
})

module.exports = router;
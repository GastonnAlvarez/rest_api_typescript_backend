import express from 'express'
import router from './router'
import cors, { CorsOptions } from 'cors'
import db from './config/db'
import colors from 'colors'
import swaggerUi from 'swagger-ui-express'
import swaggerSpec from './config/swagger'
import morgan from 'morgan'

// Conextar a DB
export async function connectDB() {
    try {
        await db.authenticate()
        // sync(): En caso que cree nuevos modelos, este lo va agregando
        db.sync()

        // console.log(colors.magenta.bold("Conexion exitosa a la Base de datos"))
    } catch (error) {
        console.log(colors.red.white("Hubo un error al conectar a la DB"))
    }
}
connectDB()

// Instancia de express
const server = express()

// Habilitando CORS
const corsOption: CorsOptions = {
    origin: function (origin, callback) {
        if (origin === process.env.frontend_url) {
            callback(null, true)
        } else {
            callback(new Error('Error de CORS'))
        }
    }
}
server.use(cors(corsOption))

// Leer datos del formulario
server.use(express.json())
server.use(morgan('dev'))


server.use('/api/products', router)

// Documentacion de mi API
server.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec))

export default server
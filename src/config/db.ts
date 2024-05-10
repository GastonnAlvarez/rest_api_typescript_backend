import { Sequelize } from "sequelize-typescript";
import dotenv from 'dotenv'
dotenv.config()

const db = new Sequelize(process.env.db_url!, {
    models: [__dirname + '/../models/**/*'],
    logging: false,
    dialectOptions: {
        ssl: {
            require: true
        }
    }
})

export default db
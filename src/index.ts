import server from "./server";
import colors from 'colors'

server.listen(process.env.PORT, () => {
    console.log(colors.cyan.bold(`Rest API en el puerto 3000`))
})
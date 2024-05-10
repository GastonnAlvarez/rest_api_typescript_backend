import server from "./server";
import colors from 'colors'

server.listen(3000, () => {
    console.log(colors.cyan.bold(`Rest API en el puerto 3000`))
})
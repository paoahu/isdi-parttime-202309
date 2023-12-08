// // herramienta para leer archivos en forma de js

// const fs = require('fs')
// // es un paquete pre-fabricado de node, que significa File System
// // es una caja de herramientas que tiene entre otras cosas readFile, que te permite leer el archivo que tú le digas
// // tiene que estar en la carpeta dnd ejecutamos el node

// function loadAsObject(file, callback) {


//     fs.readFile(file, 'utf8', (error, csv) => {
//         if (error) {
//             callback(error)
//             return
//         }

//         const data = []

//         const lines = csv.split('\n') //aquí tenemos la 1a linea (separame hasta el salto de línea). Detecta todas las líneas

//         const fields = lines[0].split(',') //aquí separo los elementos de la línea, me guio por las comas
//         // en la línea 0 tengo las cabeceras

//         for (let i = 1; i < lines.length; i++) { //quiero recorrer todas las líneas de usuarios (empiezo por la 1)
//             const line = lines[i] // me guardo la información de la línea en la que estoy en la constante line
//             const values = line.split(',') // y los valores de la línea los guardo en la variable values
//             const item = {} // aquí guardaré los datos de cada usuario

//             for (let j in fields) { //la j es el índice en el array fields, itero en fields
//                 // la primera iteración que llega es "item-567,Pin Ocho,pin@ocho.com,123" j = 0
//                 const field = fields[j] // field == 'id' porque estoy recortado de la cabecera, el primer elemento const fields = lines[0].split(',')

//                 item[field] = values[j] // item[id] == 'item-567' // recorro values, que tiene los recortes de cada línea (y empiezo por la 1)
//                 //creo una propiedad en el objeto item, que se llama como el campo, que en este caso es id
//             }

//             data.push(item)
//         }

//         callback(null, data)
//     })

// }

// function saveFromObject(file, data, callback) { // en este fichero, guárdame este objeto
//     const fields = Object.keys(data[0]) // aquí tengo las cabecera

//     let csv = fields.join() //tenemos la línea 0

//     for (const item of data) {
//         //me traigo cada item, y me traifo dato a dato los ddadtos que están y me los pone en data
//         let line = ''

//         for (let i = 0; i < fields.length; i++) {
//             const field = fields[i]

//             line += item[field] + (i < fields.lenght - 1 ? ',' : '')
//         }

//         csv += '\r\n' + line

//     }
//     fs.writeFile(file, csv, error => {
//         if (error) {
//             callback(error) // esto es así porque solo tengo un dato (el error) que le paso al callback
//             // si tiene error que me lo devuelva, sino que sea null
//         }
//         callback(null)
//     }) // ahor lo guardo en disco
// }

// module.exports = {
//     loadAsObject,
//     saveFromObject
// }


const fs = require('fs')

function loadAsObject(file, callback) {
    fs.readFile(file, 'utf8', (error, csv) => {
        if (error) {
            callback(error)

            return
        }

        const data = []

        const lines = csv.split('\r\n')

        const fields = lines[0].split(',')

        for (let i = 1; i < lines.length; i++) {
            const line = lines[i]

            const values = line.split(',')

            const item = {}

            for (const j in fields) {
                const field = fields[j]

                item[field] = values[j]
            }

            data.push(item)
        }

        callback(null, data)
    })
}

function saveFromObject(file, data, callback) {
    const fields = Object.keys(data[0])

    let csv = fields.join()

    for (const item of data) {
        let line = ''

        for (let i = 0; i < fields.length; i++) {
            const field = fields[i]

            line += item[field] + (i < fields.length - 1 ? ',' : '')
        }

        csv += '\r\n' + line
    }

    fs.writeFile(file, csv, error => {
        if (error) {
            callback(error)

            return
        }

        callback(null)
    })
}

module.exports = {
    loadAsObject,
    saveFromObject
}
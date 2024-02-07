import { validate, errors } from 'com'


import { Post, User } from '../data/models.js'

const { SystemError, NotFoundError } = errors

function retrieveFavPosts(userId) {
    validate.id(userId, 'user id')


    return User.findById(userId).lean()
        .catch(error => callback(new SystemError(error.message)))
        .then(user => {
            if (!user) {
                throw new NotFoundError('User not found')

            }

            //Quiero buscar los posts que corresponden a los favoritos del usuario

            return Post.find({ _id: { $in: user.favs } }).populate('author', 'name').lean()
                //dame todos los posts que tengan el id dentro de este set de ids que te comparto

                .catch(error => callback(new SystemError(error.message)))
                .then(posts => {
                    // vamos a limpiar los posts, porque no queremos que traigan información de más
                    //usamos el lean() para que nos devuleva documentos y no se pueden manipular, como no queremos modificarlo, usamos un lean()
                    posts.forEach(post => {
                        post.id = post._id.toString() // Lo convierto a string
                        delete post._id; // borro el _id

                        if (post.author && post.author._id) {
                            post.author.id = post.author._id.toString();
                            delete post.author._id;
                        }

                        delete post.__v; // esto es una propiedad que pone mongoose, pero como no lo quiero, lo elimino

                        post.likes = post.likes.map(userObjectId => userObjectId.toString()) // Hago un mapeo con todos los likes que hay en el array

                        post.liked = post.likes.includes(userId) // devuelvo un true o un false
                        post.fav = user.favs.some(fav => fav.toString() === post.id) // no puedo usar includes porque son referencias a objectos
                        // el some lo que hace es mirar si algun objeto de se array cumple con la condicion

                    })
                    return posts

                })



        })



}

export default retrieveFavPosts
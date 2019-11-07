const { ApolloServer, gql } = require('apollo-server');

const autorData = [];
const recetasData = [];
const ingredientesData = [];


const typeDefs = `

    type Recetas{
        titulo: String!
        descripcion: String!
        fecha: String!
        autor: Autor
        ingredientes: [Ingredientes!]
    }

    type Autor{
        nombre: String!
        email: String!
        lista_recetas: [Recetas!]
    }

    type Ingredientes{
        nombre: String!
        recetas_aparece: [Recetas!]
    }

    type Query{
        autor(nombre: String!): Autor
        ingrediente(nombre: String!): Ingredientes

        listaRecetas: [Recetas!]
        listaAutores: [Autor!]
        listaIngredientes: [Ingredientes!]
    }

    type Mutation{
        addAutor(nombre: String!, email: String!): Autor!
        addIngrediente(nombre: String!): Ingredientes!
        addReceta(titulo: String!, descripcion: String!, autor: String!, ingredientes: [String!]): Recetas!

        deleteReceta(titulo: String!): String!
        deleteAutor(nombre: String!): String!
        deleteIngrediente(nombre: String!): String!

        editAutor(nombre: String!, email: String): Autor
        editReceta(titulo: String!, descripcion: String, autor: String, ingredientes: [String!]): Recetas
        editIngrediente(name: String!): Ingredientes
    }
 

`


const resolvers = {

    Autor: {
        lista_recetas: (parent, args, ctx, info) => {
            const autorNombre = parent.nombre;
            return recetasData.filter(obj => obj.autor === autorNombre);

        }
    },

    Ingredientes: {
        recetas_aparece: (parent, args, ctx, info) => {
            const ingredienteNombre = parent.nombre;
            return recetasData.filter(obj => obj.ingredientes.includes(ingredienteNombre));
        }
    },

    Recetas: {
        autor: (parent, args, ctx, info) => {
            const autorNombre = parent.autor;
            return autorData.find(obj => obj.nombre === autorNombre);
        },

        ingredientes: (parent, args, ctx, info) => {
            return ingredientesData.filter(obj => parent.ingredientes.includes(obj.nombre));

        }
    },

    Query: {
        autor: (parent, args, ctx, info) => {
            return autorData.find(obj => obj.nombre === args.nombre);
        },

        ingrediente: (parent, args, ctx, info) => {
            return ingredientesData.find(obj => obj.nombre === args.nombre);
        },

        listaRecetas: (parent, args, ctx, info) => {
            return recetasData;
        },

        listaAutores: (parent, args, ctx, info) => {
            return autorData;
        },

        listaIngredientes: (parent, args, ctx, info) => {
            return ingredientesData;
        }


    },

    Mutation: {
        addAutor: (parent, args, ctx, info) => {
            const { nombre, email } = args;
            if (autorData.some(obj => obj.email === email)) {
                throw new Error(`User email ${email} already in use`);
            }

            const autor = {
                nombre,
                email
            }

            autorData.push(autor);
            return autor;
        },

        addIngrediente: (parent, args, ctx, info) => {
            const { nombre } = args;
            if (ingredientesData.some(obj => obj.nombre === nombre)) {
                throw new Error(`Ingredient ${nombre} already added.`);
            }

            const ingrediente = {
                nombre
            }

            ingredientesData.push(ingrediente);
            return ingrediente;
        },

        addReceta: (parent, args, ctx, info) => {
            const { titulo, descripcion, autor, ingredientes } = args;
            if (!autorData.some(obj => obj.nombre === autor)) throw new Error(`Author ${autor} not found`)
            ingredientes.forEach(elem => {
                if (!ingredientesData.some(obj => elem === obj.nombre)) throw new Error(`Ingrediente ${elem} not found`)
            })
            if (recetasData.some(obj => obj.titulo === titulo)) throw new Error(`Recipe name ${titulo} already created`)
            var today = new Date();
            var dd = String(today.getDate()).padStart(2, '0');
            var mm = String(today.getMonth() + 1).padStart(2, '0');
            var yyyy = today.getFullYear();
            today = `${dd}/${mm}/${yyyy}`;
            const fecha = today;

            const receta = {
                titulo, descripcion, fecha, autor, ingredientes
            }

            recetasData.push(receta);
            return receta;
        },

        deleteReceta: (parent, args, ctx, info) => {
            const receta = args.titulo;

            if (recetasData.some(obj => obj.titulo === receta)) {
                const result = recetasData.find(obj => obj.titulo === receta);
                const index = recetasData.indexOf(result);

                recetasData.splice(index, 1);

                return (`Successfully deleted ${titulo}`)
            } else {
                return (`Recipe ${titulo} not found`)
            }


        },

        deleteAutor: (parent, args, ctx, info) => {
            const nombre = args.nombre;

            if (autorData.some(obj => obj.nombre === nombre)) {
                const result = autorData.find(obj => obj.nombre === nombre);
                const index = autorData.indexOf(result);

                autorData.splice(index, 1);

                recetasData.forEach(elem => {

                    const ff = elem.autor === nombre
                    if (ff) {
                        const index = recetasData.indexOf(ff)
                        recetasData.splice(index, 1);
                    }
                })

                return (`Deleted author ${nombre} successfully`)
            } else {
                return (`Author ${nombre} not found`)
            }


        },

        deleteIngrediente: (parent, args, ctx, info) => {
            const nombre = args.nombre;

            const result = ingredientesData.find(obj => obj.nombre === nombre);
            if (result) {
                const index = ingredientesData.indexOf(result)
                ingredientesData.splice(index, 1);

                return (`Ingredient ${nombre} deleted successfully`)
            } else {
                return (`Ingredient ${nombre} not found`)
            }

            /*if(ingredientesData.some(obj => obj.nombre === nombre)){
                ingredientesData.forEach(elem => {
                    const ff = elem.nombre === nombre;
                    if(ff){
                        ingredientesData.indexOf(ff)
                        ingredientesData.splice(ff,1)
                    }
                })

                return (`Ingredient ${nombre} deleted successfully`)
            }else{
                return (`Ingredient ${nombre} not found`)
            }*/
        },

        editAutor: (parent, args, ctx, info) => {
            const email = args.mail;

            if (email) {
                const nombre = args.name;

                if (autorData.some(obj => obj.name === nombre)) {
                    const result = autorData.find(obj => obj.name === nombre);
                    const index = autorData.indexOf(result);
                    autorData[index].mail = email

                    const f = autorData.find(obj => obj.name === nombre);

                    return f;
                }
            }
        }


    }

}

const server = new ApolloServer({
    typeDefs,
    resolvers,
});

server.listen().then(({ url }) => {
    console.log(`🚀 Server ready at ${url}`);
});





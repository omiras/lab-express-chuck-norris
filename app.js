// Hola Hola! Happy coding ;)

/**
 * Iteración 0:
 * 
 * 1. Crear un proyecto vacío con NPM
 * 2. Instalar express, nodemon y ejs
 * 3. Configurar adecuadamente el package.json para poder ejecutar el servidor con "npm start"
 * 4. Ser capaces de renderizar la vista index.ejs al hacer un GET a '/'
 * 
 * Podéis basaros en el proyecto de la PEC...o cualquier otro de Express que use EJS.
 * 
 * Corregir: 17.52
 */

/**
 * Corregir iteración 1 a las 18.20
 */

const express = require('express');
const Chuck = require('chucknorris-io');
const client = new Chuck();

const app = express();

app.set('view engine', 'ejs');

app.get("/", (req, res) => {
    res.render('index.ejs');
});

app.get("/random", async (req, res) => {
    let joke = await client.getRandomJoke();
    res.render('random.ejs', {
        joke: joke,
        imageChuck: "https://i.ytimg.com/vi/ragowJOi_ig/maxresdefault.jpg"
    })
})

app.get("/categories", async (req, res) => {

    /**
     * Si la req.query.cat tiene algún valor, significa que queremos obtener un chiste de esa categoría. Renderizar la vista joke-by-category.ejs con el chiste
     */
    let category = req.query.cat; // 'dev' | undefined

    if (category) {
        let joke = await client.getRandomJoke(category);
        return res.render('joke-by-category', {
            category: category,
            joke: joke
        });
    }


    let categories = await client.getJokeCategories();

    // 1. Renderizar la vista categories.ejs
    // 2. Crear tantos enlaces como categorías hay
    //  http://localhost:3000/categories?cat=dev 
    //  http://localhost:3000/categories?cat=animal
    // 3. Debería poder hacer clic en cada uno de los enlaces

    res.render('categories', {
        categories: categories
    });
});

// Iteration 3

// Creamos un nuevo endpoint que renderice el formulario al hacer un GET en /search
app.get("/search", (req, res) => {
    res.render('search-form');
});

// Creamos un nuevo endpoint que gestione otro GET a un endpoint diferente para obtener un chiste filtrado por la palabra introducida por el usuario
app.get("/search-by-text", async (req, res) => {

    // obtenemos el parámetro de la QueryString
    let { q } = req.query;

    // obtener chiste filtrado que contenga las palabras de la querystring. Cuidado! el método 'search' es asíncrono, debemos esperar la respuesta de la API
    let jokes = await client.search(q);


    // Renderizamos la vista joke-by-keyword, donde iteraremos el array de jokes para mostrar todos los chistes relacionados con la palabra clave almacenada en 'q'. Cuidado: hay que fijarse que jokes viene con dos propiedades: 'count' donde almacena el número de chistes encontrados con dicha palabra clave, y 'items', un array de chhistes
    res.render("jokes-by-keyword", {
        jokes: jokes.items,
        numJokes: jokes.count,
        searchTerm: q
    })

});

app.listen(3000);
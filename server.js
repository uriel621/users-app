const express = require('express');
const hbs = require('hbs');
const bodyParser = require('body-parser');
const fs = require('fs');

const port = process.env.PORT || 3000;
const app = express();

const create = require('./routes/create');
const remove = require('./routes/delete');
const edit = require('./routes/edit');

// create application/x-www-form-urlencoded parser
let urlencodedParser = bodyParser.urlencoded({ extended: false })

hbs.registerPartials(__dirname + '/views/partials');
app.set('view engine', 'hbs')
app.use(express.static(__dirname + '/public'))

// Read (load data)
app.get('/', (request, response) => {
    let json = fs.readFileSync('./public/users.json');
        json = JSON.parse(json);
    let users = json.users;
    response.render('home.hbs', {
        "users":users
    });
})


// The About Page (nothing really)
app.get('/about', (request, response) => {
    response.render('about.hbs');
})

// Create User Form page
app.get('/add', (request, response) => {
    response.render('create.hbs');
})

// Update JSON file users properties
app.post('/update', urlencodedParser, (request, response) => {
    if(!request.body){
        return response.sendStatus(400);
    } 

    let user_string = fs.readFileSync('public/users.json');
    let file = JSON.parse(user_string);

    // Loop through Users keys and update key values
    for(user of file.users) {
        if(request.body.id === user.id){
            user.birthday = request.body.birthday;
            user.email = request.body.email;
            user.favoriteColor = request.body.favoriteColor;
            user.image = request.body.image;
            user.name = request.body.name;
            user.username = request.body.username;
            fs.writeFileSync('public/users.json', JSON.stringify({"users":file.users}));
        }
    }
    return response.redirect('/');
})

// Create, Edit, Delete
app.post('/create', urlencodedParser, create);
app.post('/edit', urlencodedParser, edit);
app.post('/delete', urlencodedParser, remove);

app.listen(port, () => console.log(`App listening on port ${ port }`));
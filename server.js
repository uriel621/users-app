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

app.get('/users', function(req, res, next) {
    let file = fs.readFileSync('public/users.json');
    file = JSON.parse(file);

    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    res.send(file);
   });

// Read (load data)
app.get('*', (request, response) => {
    let file = fs.readFileSync('public/users.json');
        file = JSON.parse(file);
    let users = file.users;
    response.render('home.hbs', {
        "users":users
    });
})

app.get('/edit/:id', (request, response) => {
    let file = fs.readFileSync('public/users.json');
        file = JSON.parse(file);
    let found = false;
    for(let user of file.users) {
        if(user.username === request.params.id){
            found = true;
            response.render('edit.hbs', {
                "birthday":user.birthday,
                "email":user.email,
                "favoriteColor":user.favoriteColor,
                "id":user.id,
                "image":user.image,
                "joinDate":user.joinDate,
                "name":user.name,
                "username":user.username
            });
        }
    }
    if(!found){
        response.redirect(`/add/${ request.params.id }`)
    }
})

// The About Page (nothing really)
app.get('/about', (request, response) => {
    response.render('about.hbs');
})

// GET Create User Form page
app.get('/add/:id*?', (request, response) => {
    if(request.params.id){
        let file = fs.readFileSync('public/users.json');
            file = JSON.parse(file);
        let found = false;
        for(let user of file.users) {
            if(user.username === request.params.id){
                found = true;
            }
        }
        if(!found) {
            response.render('create.hbs', {
                "status":`The "${ request.params.id }" username was not found but you can create one`
            });
        }
        else {
            response.render('create.hbs');
        }
    }
    else {
        response.render('create.hbs');
    }
})

// Update JSON file users properties
app.post('/update', urlencodedParser, (request, response) => {
    if(!request.body){
        return response.sendStatus(400);
    }

    let file = fs.readFileSync('public/users.json');
        file = JSON.parse(file);

    // Loop through Users keys and update key values
    for(user of file.users) {
        if(request.body.id === user.id){
            user.birthday = request.body.birthday;
            user.email = request.body.email;
            user.favoriteColor = request.body.favoriteColor;
            user.image = request.body.image;
            user.name = request.body.name;
            user.username = request.body.username;
            fs.writeFileSync('public/users.json', JSON.stringify( {"users":file.users} ));
        }
    }
    return response.redirect('/');
})
app.get('/delete/:id', remove)
app.post('/create', urlencodedParser, create);
app.post('/edit/*?', urlencodedParser, edit);

app.listen(port, () => console.log(`App listening on port ${ port }`));
require('./config/config');

const express = require('express');
const hbs = require('hbs');
const bodyParser = require('body-parser');
const fs = require('fs');

const port = process.env.PORT || 4000;
const app = express();

var { mongoose } = require('./db/mongoose');
var { Authenticate } = require('./models/authenticate');

const create = require('./routes/create');
const remove = require('./routes/delete');
const edit = require('./routes/edit');

// create application/x-www-form-urlencoded parser
let urlencodedParser = bodyParser.urlencoded({ extended: false })

hbs.registerPartials(__dirname + '/views/partials');
app.set('view engine', 'hbs')
// app.use(express.static(__dirname + '/public'))


app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});
app.use(bodyParser.json());
app.use(express.static(__dirname + '/public'))

app.get('/users', function(req, res, next) {
    let file = fs.readFileSync('public/users.json');
    file = JSON.parse(file);

    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    res.send(file);
});

// Read (load data)
app.get('/', (request, response) => {
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
            if(!request.headers.origin){
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
            else {
                return response.json(user);
            }



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

            console.log('ORIGIN', request.headers.origin)
            if(request.headers.origin === 'https://shielded-mesa-72796.herokuapp.com/'){
                console.log('IF', request.headers.origin)
                return response.redirect('/');
            }
            else {
                return response.json({
                    "users":file.users
                });
            }
        }
    }
    
})

app.post('/delete', urlencodedParser, (request, response) => {
    let file = fs.readFileSync('public/users.json');
        file = JSON.parse(file);

        file.users.forEach((user, index, array) => {
            if(request.body.username === user.username){
                file.users.splice(index, 1)
                fs.writeFileSync('public/users.json', JSON.stringify( {"users":file.users} ));
                return response.json({
                    "users":file.users
                });
            }
        })
})

var kittySchema = new mongoose.Schema({
    name: String
  });
  var Kitten = mongoose.model('Kitten', kittySchema);
app.get('/auth', (request, response) => {
    // console.log('????', Authenticate)
    // Authenticate.find((error, kittens) => {
    //     console.log(kittens)
    // })
    // var kittySchema = new mongoose.Schema({
    //     name: String
    //   });

    var Kitten = mongoose.model('Kitten', kittySchema);
    var silence = new Kitten({ name: 'Silence' });
    silence.save();
    console.log(silence.name); // 'Silence'
        // .then((lol) => {
        //     console.log(lol)
        //     response.send({lol});
        // }, 
        // (e) => {
        //     response.status(400).send(e);
        // });
    response.send(621)
})

app.get('/and', (request, response) => {
    // kittySchema.update({ Silence: true }, fn);
    Kitten.update({ Silence: true }, function (err, raw) {
        if (err) return handleError(err);
        console.log('The raw response from Mongo was ', raw);
      });
    response.send(621)
})
// MyModel.update({ age: { $gt: 18 } }, { oldEnough: true }, fn);
app.get('/delete/:id', remove)
app.post('/create', urlencodedParser, create);
app.post('/edit/*?', urlencodedParser, edit);

app.listen(port, () => console.log(`App listening on port ${ port }!!!`));
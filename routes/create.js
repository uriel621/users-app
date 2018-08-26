const fs = require('fs');

const create = (request, response) => {
    if (!request.body) {
        return response.sendStatus(400);
    }

    // data collected from the form
    let info = {
        "birthday":request.body.birthday,
        "email":request.body.email,
        "favoriteColor":request.body.favoriteColor,
        "image":request.body.image,
        "name":request.body.name,
        "username":request.body.username
    }

    let user_string = fs.readFileSync('public/users.json');

    let user = JSON.parse(user_string);

    function makeid() {
        let text = "";
        let possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
        for (let i = 0; i < 5; i++){
            text += possible.charAt(Math.floor(Math.random() * possible.length));
        }
        return text;
    }
    info.id = makeid();

    let today = new Date();
    let dd = today.getDate();
    let mm = today.getMonth()+1;
    let yyyy = today.getFullYear();

    if(dd < 10) {
        dd = '0' + dd;
    } 
    if(mm < 10) {
        mm = '0' + mm;
    } 
    info.joinDate = yyyy + '-' + mm + '-' + dd;

    user.users.push(info);
    fs.writeFileSync('public/users.json', JSON.stringify(user));

    // var origin = request.get('origin');
    var host = request.get('host');
    if(host !== "http://localhost:4000"){
        return response.json(user);
    }
    else {
        return response.redirect('/');
    }
}

module.exports = create;
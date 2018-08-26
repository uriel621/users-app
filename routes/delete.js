const fs = require('fs');

let fetch_users = () => {
    try {
      let notesString = fs.readFileSync('public/users.json');
      return JSON.parse(notesString);
    } 
    catch (error) {
      return [];
    }
  };

let save_users = (users) => {
    fs.writeFileSync('public/users.json', JSON.stringify(users));
};

const remove = (request, response) => {
    if (!request.params.id){
        return response.sendStatus(400);
    }

    let file = fetch_users();
    let filteredUsers = file.users.filter((user) => user.username !== request.params.id);
    let users = {
        "users":filteredUsers
    }
    save_users(users);

    return response.redirect('/');
}

module.exports = remove;
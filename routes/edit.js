const edit = (request, response) => {
    console.log(621.87 + 'edit')

    if (!request.body){
        return response.sendStatus(400);
    }
    console.log(621)
    // Load data to inputs for editing users
    response.render('edit.hbs', {
        "birthday":request.body.birthday,
        "email":request.body.email,
        "favoriteColor":request.body.favoriteColor,
        "id":request.body.id,
        "image":request.body.image,
        "joinDate":request.body.joinDate,
        "name":request.body.name,
        "username":request.body.username
    });
}

module.exports = edit;

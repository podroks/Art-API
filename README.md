# Oeuvre-API
A usefull API used for store Oeuvre.

Some [reflection🔗](./reflection.md)

## ➲ Folders
**Controllers**\
Controllers are typically callback functions that corresponds to the routers to handle requests.

**Routes**\
Contain all routes that can be called. Use the controllers.

server.js > routes > controllers (answer)

## ➲ Server technologie

MongoDB\
Node.js\
Express\
Mongoose

## Usefull command

Command to add user for mongoDB
```
mongo oeuvre --eval "db.createUser({user:'podroks', pwd:'podroks987', roles: [{ role: 'readWrite', db: 'oeuvre' }]})"
```

# TODO
Lors de la suppression d'une oeuvre ou de la mise a jour d'une oeuvre
remove image si aucune oeuvre l'utilise. OU nommé avec le titre l'oeuvre (mais pas ouf en cas de update du titre).
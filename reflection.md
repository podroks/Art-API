[🡸 Back](./README.md)
# Oeuvre-API User Stories

1. I can `create` a new oeuvre object and add it to the database
2. I can `update` a existing oeuvre object and save it in database
3. I can `get` all the oeuvre from the database
4. I can `get` a single oeuvre from the database by querying its id 
5. I can `delete` a single oeuvre from the database by querying its id 
6. I can `delete` all oeuvre from the database  

# Oeuvre Object

```JSON
{
  "title": "Croquis de <span class='text-decoration-underline'>Zelda</span> 1/3",
  "description": "J’ai eu pour projet de confectionner ...",
  "keywords": ["Croquis", "Crayon de bois"],
  "date": "2019-09-07T15:50+01:00", // 15:50, le 07/09/2019
  "image": {
    "src": "oeuvre_x.jpg",
    "style": ""
  },
  "ref": {
    "image": {
      "src": "oeuvre_y.jpg",
      "style": ""
    }
  }
}
```

# Designing Structure for Oeuvre-API
| Routes | HTTP Methods | Description |
|-----|---|---|
| /oeuvre | GET | Display all oeuvre |
| /oeuvre | POST | Create a new oeuvre |
| /oeuvre | DELETE | Delete all oeuvre |
| /oeuvre/:id | GET | Display a specific oeuvre, given its id |
| /oeuvre/:id | PUT | Update a specific oeuvre, given its id |
| /oeuvre/:id | DELETE | Delete a specific oeuvre, given its id |
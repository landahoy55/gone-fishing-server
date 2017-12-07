var express = require('express');

//to route contents back to server.js
var router = express.Router();

//require mongoose functions and bodyparser middlewear
var bodyParser = require('body-parser');
var mongoose = require('mongoose');

//add database - don't worry if it isn't created, Mongoose will do that for us
var db = mongoose.connect('mongodb://localhost/swag-shop');

//Import models - thanks to using the export in the corresponding files
var Product = require('./model/product');
var Wishlist = require('./model/wishlist');
var Cart = require('./model/cart');

//The 'use' function binds our niddleware - Bodyparser
//Set up bodyParser - tell the app we will use JSON
router.use(bodyParser.json());
//false will only allow us to parse strings and arrays - not nested?
router.use(bodyParser.urlencoded({extended: false}));

//Now create endpoints. Using router rather than app.

//Product API

//Get API
//Here we are dealing with a get request from the client from a sub URL /product
router.get('/product', function(request, response) {

  //perform send within callback as these functions are async - as to only queue once.
  //.find returns an array, find one doesn't
  Product.find({}, function(err, products){

    //check for error.
    if (err) {
      response.status(500).send({error: "Could not save product"});
    } else {
      response.status(200).send(products);
    }

  });

});



//Post API
router.post('/product', function(request, response) {

  //Create an object...

  //Object is created from the mongoose model.
  var product = new Product();
  product.title = request.body.title;
  product.price = request.body.price;
  //product.likes = 0; replaced in the model

  //If you send the correct data shorthand can be shows as this... magic
  //var product = new Product(request.body);

  //Save it...
  product.save(function(err, savedProduct) {
    if (err) {
      //send an error message.
      response.status(500).send({error: "Could not save product"});
    } else {
      //send the information back to the user
      response.status(200).send(savedProduct)
      //can send JSON back
    }

  });

});



//Wishlist API

//Wishlist API

//Create new wishlist
router.post('/wishlist', function(request, response) {

  var wishList = new Wishlist();

  //should have error handling here
  wishList.title = request.body.title;


  wishList.save(function(err, newWishList){

    if (err) {
      //send an error message.
      response.status(500).send({error: "Could create wishlist"});
    } else {
      response.status(200).send(newWishList);
    }

  });

});

//Retrive all wishlists
router.get('/wishlist', function(request, response) {

  // Retrives wishlists, but only IDs
  // Wishlist.find({}, function(err, wishLists){
  //   response.send(wishLists);
  // });

  // .populate will fill the array with the related items
  //path is the products property in the product model.
  Wishlist.find({}).populate({path: 'products', model: 'Product'}).exec(function(err, wishLists){

    if (err) {
      response.status(500).send({error: "Could not fetch wishlists"});
    } else {
      response.send(wishLists);
    }

  });

});

//A more complex request, this time we are adding a product to a wishlist.
//First of all the product ID must be found before adding it to a wishlist.
router.put('/wishlist/product/add', function(request, response){

  //find a matching product using the product model.
  Product.findOne({_id: request.body.productId}, function(err, product) {

        if (err) {
          response.status(500).send({error: "Could not add item to wishlist"});
        } else {
          //update wish list, add verified product ID to array of products.
          Wishlist.update({_id: request.body.wishListId}, {$addToSet: {products: product._id}}, function(err, wishlist) {
            if (err) {
              response.status(500).send({error: "Could not add item to wishlist"});
            } else {
              //confirm
              response.send(wishlist);
            }

        });

      }

    })

});



//Create endpoints for /cart and create the ability for a user to store and remove things from their cart. You will need to create the appropriate Mongoose Models.




//Export
module.exports = router

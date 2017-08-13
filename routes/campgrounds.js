var express      =   require("express");
var router       =   express.Router();
var Campground   =   require("../models/campground");
var middleware   = require("../middleware");


router.get("/", function(req, res){
    //Get all campgrounds from db
    Campground.find({}, function(err, allcampgrounds){
        if (err){
            console.log(err);
        } else {
            //   res.render("campground/index", {campgrounds: allcampgrounds, currentUser: req.user});
               res.render("campground/index", {campgrounds: allcampgrounds, page: 'campgrounds'});
        }
    });
   
    
});

router.post("/", middleware.isLoggedIn, function(req, res){
    //Get data from form and add to campgrounds page
    //redirect back to campgrounds page
    var name = req.body.name;
    var price =req.body.price;
    var image = req.body.image;
     var desc = req.body.description;
     var author = {
         id: req.user._id,
         username : req.user.username
     };
    
    var newCampground = {name:name,price: price, image:image, description: desc,author: author};
 
    //create a new campground and save to DB
    Campground.create(newCampground, function(err, newlyCreated){
        if (err){
            console.log(err);
        } else{
            console.log(newlyCreated);
               res.redirect("/campgrounds");
        }
    });
   
    
 
});

router.get("/new", middleware.isLoggedIn,function(req, res){
    res.render("campground/new");
});

//show more info campground
router.get("/:id", function(req, res){
    Campground.findById(req.params.id).populate("comments").exec(function(err, foundCampgroud){
        if(err){
            console.log(err);
        } else {
            console.log(foundCampgroud);
            //render the campground with the unique id
            res.render("campground/show", {campground: foundCampgroud});
        }
    });
  
});

//Edit campground route
router.get("/:id/edit", middleware.checkCampgroundOwnership,function(req,res){
   
         //does user own campground
             Campground.findById((req.params.id),  function(err, foundCampground){
                 res.render("campground/edit", {campground: foundCampground} );
       });
});

//update campground route
router.put("/:id", middleware.checkCampgroundOwnership,function(req, res){
    Campground.findByIdAndUpdate(req.params.id, req.body.campground, function(err, updatedCampground){
        if(err){
            res.redirect("/campgrounds");
        } else {
            res.redirect("/campgrounds/" + req.params.id);
        }
    });
});

//destroy campground route
router.delete("/:id", middleware.checkCampgroundOwnership,function(req, res){
   Campground.findByIdAndRemove(req.params.id, function(err){
       if (err){
           res.redirect("/campgrounds");
       } else {
           res.redirect("/campgrounds");
       }
   });
});




module.exports = router;
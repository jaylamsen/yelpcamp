var  express      =      require ("express"),
  bodyParser      =      require ("body-parser"),
    mongoose      =      require("mongoose"),
    passport      =      require("passport"),
    LocalStrategy =      require("passport-local"),
         app      =      express(),
         User     =      require("./models/user"),
         seedDB   =      require("./seeds"),
         Comment  =      require("./models/comment"),
         flash    =      require("connect-flash"),
   methodOverride =      require("method-override");

 var indexRoutes          =  require("./routes/index"),
     campgroundRoutes     =  require("./routes/campgrounds"),
        commentRoutes     =  require("./routes/comments");


mongoose.connect(process.env.DATABASEURL);
// mongoose.connect("mongodb://localhost/yelp_camp12pw");
// mongoose.connect("mongodb://jay_lamsen:baby18Zazie@ds119728.mlab.com:19728/yelpcamp");

app.use(bodyParser.urlencoded({extended:true}));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
app.use(flash());
//seeding
// seedDB();



app.locals.moment = require('moment');

//PASSPORT CONFIGURATION
app.use(require("express-session")({
    secret: "jay lamsen",
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req, res, next){
    res.locals.currentUser = req.user;
    res.locals.error = req.flash("error");
    res.locals.success = req.flash("success");
    next();
});
//Requiring routes
app.use("/",indexRoutes);
app.use("/campgrounds",campgroundRoutes);
app.use("/campgrounds/:id/comments",commentRoutes);




app.listen(process.env.PORT, process.env.IP, function(){
    console.log("Server has started!");
});
var express = require('express');
var body_parser = require('body-parser');

var app = express();

app.disable('x-powered-by');// u response header se pojavnjuje ako se ovde ne ukloni

app.use(function(req,res,next){
  res.header("Access-Control-Allow-Origin","*");
  res.header("Access-Control-Allow-Methods","GET,PUT,POST,DELETE");
  res.header("Access-Control-Allow-Headers","Content-Type");
  next();
});

// Required when using POST to parse encoded data
app.use(require('body-parser').urlencoded({extended: true}));


//Work with mongoDB---------------------------------------------------------------------------------------------
var Locations = require("./DataLayer/locations");// kako se nazove promenjiva tako se i od nje pravi novi objekat
var Location = require("./DataLayer/location");
//npr da sam umesto Locations nazvao foo onda bi izlo var l = new foo(); -glupo za medalju
var locations = new Locations();
var location1 = new Location(43.318364, 21.891335,"Restoran1","Restaurant","018/561663","8-21h","nikolan92@hotmail.com");
var location2 = new Location(43.317365, 21.892333,"Pub1","Pub","018/561663","8-21h","nikolan92@hotmail.com");

//data insert
// locations.insertLocation(location1);
// locations.insertLocation(location2);

// locations.getAllLocations(function(doc){
//   console.log(doc);
//       console.log("-----------------------------");
// });


// var querry = ["Kafana","Pub"];//querry for getLocationsByType
// locations.getLocationsByType(querry,function(doc){
//   console.log(doc);
//       console.log("-----------------------------");
// });
locations.getLocationsByName('Re',function(doc){
  console.log(doc);
      console.log("-----------------------------");
});

//End of work with mongoDB---------------------------------------------------------------------------------------


//set port
app.set('port', process.env.PORT || 3000);

//Routes
app.get('/', function(req, res){
    res.send('Use /api/{Some_functions}');
});
//Route getAlllocations
app.get('/api/getAlllocations', function(req, res){
    var locations = new Locations();
    locations.getAllLocations(function(loc){
      res.send(loc);
    });
  });
//Route insertLocation
app.post('/api/insertLocation', function(req, res){
    var locations = new Locations();

    //var location = JSON.stringify(req.body);

    location = req.body;
    delete location._id;

    console.log("Body:" + JSON.stringify(location));
    locations.insertLocation(location,function(){
      res.send("Data successfuly inserted!");
    });

  });



//End of routes

app.listen(app.get('port'),function(){
  console.log('Express started press Ctrl-C to terminate');
});

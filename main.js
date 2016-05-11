var express = require('express');
var body_parser = require('body-parser');
var app = express();

var pushNotification = require("./OneSignalPushNotification/PushNotification");
//generic administrator
var username = "admin";
var password = "secret";
//

//Enable public directory
app.use(express.static(__dirname+'/public'));
//End of enable public directory

app.disable('x-powered-by');// u response header se pojavnjuje ako se ovde ne ukloni

app.use(function(req,res,next){
  res.header("Access-Control-Allow-Origin","*");
  res.header("Access-Control-Allow-Methods","GET,PUT,POST,DELETE");
  res.header("Access-Control-Allow-Headers","Content-Type");
  res.header('Access-Control-Allow-Credentials', false);
  next();
});
// Required when using POST to parse encoded data
app.use(require('body-parser').urlencoded({extended: true}));


//Work with mongoDB---------------------------------------------------------------------------------------------
var Locations = require("./DataLayer/locations");// kako se nazove promenjiva tako se i od nje pravi novi objekat
var Location = require("./DataLayer/location");
//npr da sam umesto Locations nazvao foo onda bi izlo var l = new foo(); -glupo za medalju

// var locations = new Locations();
// var location1 = new Location(43.318364, 21.891335,"Bolji zivot","Restaurant","018/561663","8-21h","nikolan92@hotmail.com");
// var location2 = new Location(43.317365, 21.892333,"Irish pub","Pub","018/561663","8-21h","nikolan92@hotmail.com");
// var location3 = new Location(43.316364, 21.893335,"Grand","Restaurant","018/265652","8-21h","dicic92@hotmail.com");
// var location4 = new Location(43.315365, 21.894333,"Stara Srbija","Kafana","018/1651546","8-21h","banjac92@hotmail.com");
// var location5 = new Location(43.314365, 21.895333,"Kod Rajka","Kafana","018/56161565","8-21h","nikolan92@hotmail.com");
// var location6 = new Location(43.313365, 21.896333,"Lagano","Caffe","018/56161565","8-21h","nikolan92@hotmail.com");
// var location7 = new Location(43.311365, 21.897333,"BlaBla","Caffe","018/56161565","8-21h","nikolan92@hotmail.com");
// //data insert
// locations.insertLocation(location1,function(){console.log("Data inserted");});
// locations.insertLocation(location2,function(){console.log("Data inserted");});
// locations.insertLocation(location3,function(){console.log("Data inserted");});
// locations.insertLocation(location4,function(){console.log("Data inserted");});
// locations.insertLocation(location5,function(){console.log("Data inserted");});
// locations.insertLocation(location6,function(){console.log("Data inserted");});
// locations.insertLocation(location7,function(){console.log("Data inserted");});

// locations.getAllLocations(function(doc){
//   console.log(doc);
//       console.log("-----------------------------");
// });


// var querry = ["Kafana","Pub"];//querry for getLocationsByType
// locations.getLocationsByType(querry,function(doc){
//   console.log(doc);
//       console.log("-----------------------------");
// });

// locations.getLocationsByName('Re',function(doc){
//   console.log(doc);
//       console.log("-----------------------------");
// });

//End of work with mongoDB---------------------------------------------------------------------------------------


//set port
server = app.listen(3000);// server je kao globalna promenjiva sad da bi socket io mogo da im pristupa (Kod je u haos ali ucimo se :) )
//app.set('port', process.env.PORT || 3000);

// //Sockets
var socket = require("./Socket.IO/socket");

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
//Route Search
app.get('/api/search', function(req, res){
    var locations = new Locations();
    var query = req.query["query"];
    var type = req.query["type"];

    console.log("---------------query------------------");
    console.log(query);
    console.log("---------------query------------------");

    locations.getLocationsSearchQuery(query,type,function(loc){
      res.send(loc);
    },5);//limit for 5 results
  });
//Route insertLocation
app.post('/api/insertLocation', function(req, res){
    var locations = new Locations();

    //var location = JSON.stringify(req.body);
    location = req.body;
    //console.log("Location from request body:" + JSON.stringify(location));
    locations.insertLocation(location,function(nameOfLocation){
      res.send("Data successfuly inserted!");
      //Push Notification New Location Added
      new pushNotification('*', "New Location added check in explore.\nLocation name: " + nameOfLocation);
      //end of push notifications
    });
  });
//Route deleteLocation
app.get('/api/deleteLocation', function(req, res){
    var id = req.query["id"];
    if(req.query["username"]==username && req.query["password"]==password){
      var locations = new Locations();
      locations.deleteLocation(id,function(){
        res.send("SUCCESS");
      });

    }else{
      res.send("WRONG USERNAME AND PASSWORD");
    }

    console.log(req.query["username"]);
    console.log(req.query["password"]);
    console.log(id);
  });

  // app.get('/images/temp.jpeg', function(req, res){
  //     var fs = require("fs");
  //
  //   });
//End of routes


app.listen(app.get('port'),function(){
  console.log('Express started press Ctrl-C to terminate');
});

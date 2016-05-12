//Sockets
var io = require('socket.io')(server);

var userCount = 0;
var userData = [];
//Connect to the socet io
io.on('connect', function(socket){
  userCount++;
  console.log("User connected to the socket.\nUsers count:" + userCount);
  socket.on("disconnect", function(){
    userCount--;
    //console.log("///////////////////////////////////-"+ JSON.stringify(userData[socket.id]));
    delete userData[socket.id];//brisanje usera iz liste usera koji se prate

    console.log("User disconnected from the socket.\nUsers count:" + userCount);
  });//end of disconnect event

  socket.on("myCurrentLocation", function(data){
    userData[socket.id] = data;
    //console.log(userData[socket.id].lat);
    console.log("User send data of his location:" + JSON.stringify(userData[socket.id]));

    // // //test
    // for(key in userData)
    //   console.log("\n [" + key + "] User data:"+ JSON.stringify(userData[key]));
    // //Test

  });//end of currentLocation event

  socket.on("userAddNewPicture",function(imgDataBase64){

    //console.log("User added new picture data:"+ JSON.stringify(imgDataBase64));

    var fs = require('fs');
    var finalImage = decodeBase64Image(imgDataBase64);

    var path = __dirname;
    path = path.replace("Socket.IO","public\\images\\temp.jpeg");
    //console.log(path);
    fs.writeFile(path, finalImage.data, "binary", function(err) {
      if(err) {
        console.log(err);
        socket.emit('error', "Falid to upload picture, try again.");
      } else {
        console.log("The file was saved!");

        socket.emit("success", "/images/temp.jpeg");//return success info to the sender of the picture

        //before emit chack to which user to send event

        //var tmpUserData = userData[socket.id];
        //delete userData[socket.id];//privremeno brisem korisnika koji je poslao sliku da se ne bi i njemu poslolo obavestenje o novoj slici
        //jer sigurno ispunjava kriterijum da je u blizini

        var distance = 1001;
        for(key in userData){
          console.log(userData[socket.id].lat);

          distance = getDistance(userData[socket.id].lat,userData[socket.id].lng,userData[key].lat,userData[key].lng);
          console.log("Distance between user who send and user with socket.id:"+ key +" is:" + distance);

          if(distance<1000.0 && key != socket.id )//ako je distanca manja od npr 1km onda se tom korisniku salje event da je slika dodata i ako to nije isti user koji je poslao tu sliku
            //socket.broadcast.to(key).emit('newPictureAdded', "/images/temp.jpeg");
            console.log("Send to socket.id:"+ key +" is:" + distance);
            socket.broadcast.to(key).emit('newPictureAdded', "/images/temp.jpeg");//send to all user exept to the sender
        }
        //userData[socket.id] = tmpUserData;//vracanje usera koji je poslao sliku u listu usera koji su konektovani
      }
    });


  });//end of addedNewPicture event

});//end of connect event

//Return distance between two coordinates
function getDistance(lat1, lon1, lat2, lon2){
  var R = 6378.137;
  var dLat = (lat2 - lat1) * Math.PI / 180;
  var dLon = (lon2 - lon1) * Math.PI / 180;
  var a = Math.sin(dLat/2) * Math.sin(dLat/2) +
  Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
  Math.sin(dLon/2) * Math.sin(dLon/2);
  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  var d = R * c;
  return d * 1000;
}

//End of Sockets
function decodeBase64Image(dataString) {
  var matches = dataString.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/),
    response = {};

  if (matches.length !== 3) {
    return new Error('Invalid input string');
  }

  response.type = matches[1];
  response.data = new Buffer(matches[2], 'base64');

  return response;
}

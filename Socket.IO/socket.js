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
    console.log(path);
    fs.writeFile(path, finalImage.data, "binary", function(err) {
      if(err) {
        console.log(err);
        socket.emit('error', "Falid to upload picture, try again.");
      } else {
        console.log("The file was saved!");

        //before emit chack to which user to send picture
        //io.emit('newPictureAdded', "/images/temp.jpeg");//emit to all user for now
        socket.broadcast.emit('newPictureAdded', "/images/temp.jpeg");
        socket.emit("success", "/images/temp.jpeg");
      }
    });


  });//end of addedNewPicture event

});//end of connect event

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

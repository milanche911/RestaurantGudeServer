function Locations(){
  var MongoClient = require('mongodb').MongoClient;
  var assert = require('assert');
  var ObjectId = require('mongodb').ObjectID;
  var url = 'mongodb://localhost:27017/RestaurantGuide';

  //InsertLocation
  this.insertLocation = function(location,callback) {
    MongoClient.connect(url, function(err, db) {//connect to the dataBase
      assert.equal(null, err);//error print
      console.log("DataBase open in function: insertLocations");
      //isert data
      db.collection('locations').insertOne(location, function(err, result) {
         assert.equal(err, null);
         console.log("Inserted a location into the locations collection.");
         db.close();
         console.log("DataBase closed in function: insertLocation");
         callback();
       //end of data insert
     });
   });//end of connect
  }
  //GetAllLocation
  this.getAllLocations = function(callback,limitForResult){
    if(!limitForResult){
      limitForResult = 0;
    }
    MongoClient.connect(url, function(err, db) {//connect to the dataBase
      assert.equal(null, err);//error print
      console.log("DataBase open in function: getAllLocations");
      //get data
      var cursor = db.collection("locations").find({},{limit:limitForResult});
      cursor.toArray(function(err,doc){
        assert.equal(null,err);//error print
        if(doc != null){
          //some work with data
          callback(doc);
        }
        db.close();
        console.log("DataBase closed in function: getAllLocations");
      });//end of each , end of get data
   });//end of connect
  }
  //GetLocationsByQuery
  var getLocationsByQuery = function(querry,callback,limitForResult){
    if(!limitForResult){
      limitForResult = 0;
    }
    MongoClient.connect(url, function(err, db) {//connect to the dataBase
      assert.equal(null, err);//error print
      console.log("DataBase open in function: getLocationsByQuery");
      //get data
      var cursor = db.collection("locations").find(querry,{limit:limitForResult});
      cursor.toArray(function(err,doc){
        assert.equal(null,err);//error print
        if(doc != null){
          //some work with data
          callback(doc);
        }
        db.close();
        console.log("DataBase closed in function: getLocationsQuery");
      });//end of each , end of get data
   });//end of connect
  }
  //GetLocationsByType
  this.getLocationsByType = function(query,callback,limitForResult){
    queryByType =    {type:{ $in: query } };
    console.log("Query in function: getLocationsByType is:");
    console.log(queryByType);
    getLocationsByQuery(queryByType,callback,limitForResult);
  }
  //GetLocationsSearchQuery
  this.getLocationsSearchQuery = function(query,types,callback,limitForResult){
    var query = "^" + query; //search startWith

    if(types){ // ako je type prosledjen onda se trazi i po njemu
      var queryFinal = {$and: [{name:{ $regex: query, $options: "i" }},{type:{ $in: types }}]};
    }else{
      var queryFinal = {name:{ $regex: query, $options: "i" } };
    }
    console.log("Query in function: getLocationsSearchQuery is:");
    console.log(queryFinal);
    console.log("\n");
    getLocationsByQuery(queryFinal,callback,limitForResult);
  }


}//Locations Object
module.exports = Locations;

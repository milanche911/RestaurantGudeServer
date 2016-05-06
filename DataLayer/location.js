function Location(lat,lng,name,type,tel,working_time,email){
  this.lat = lat;
  this.lng = lng;
  this.name = name;
  this.type = type;
  this.tel = tel;
  this.working_time = working_time;
  this.email = email;
}
module.exports = Location;

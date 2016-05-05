function Location(long,lat,name,type,tel,working_time,email){
  this.long = long;
  this.lat = lat;
  this.name = name;
  this.type = type;
  this.tel = tel;
  this.working_time = working_time;
  this.email = email;
}
module.exports = Location;

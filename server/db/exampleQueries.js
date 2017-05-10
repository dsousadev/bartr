let db = require('./server/db');
let User=db.User;
let Service=db.Service;

var UsersWithServices = User.findAll({ include: Service }).then(res=>{foundUsers2=res});
var ServicesWithUsers = Service.findAll({ include : [ {  model: User } ] }).then(res=>{foundServices=res});

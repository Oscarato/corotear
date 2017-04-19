angular.module('services', [])
.service('UserService', function() {
  // For the purpose of this example I will store user data on ionic local storage but you should save it on a database
  var setUser = function(user_data) {
      window.localStorage.starter_facebook_user = JSON.stringify(user_data);
      localStorage.gmailLogin = "true";
      localStorage.facebookLogin = "false";
      localStorage.id = user_data.id;
      localStorage.email = user_data.email;
      localStorage.name = user_data.given_name+' '+user_data.family_name;
      localStorage.picture = user_data.picture;
  };

  var getUser = function(){
    return JSON.parse(window.localStorage.starter_facebook_user || '{}');
  };

  return {
    getUser: getUser,
    setUser: setUser
  };
})

.service('url_base', function() {
  return {
    route:'http://localhost/corotear_phone/www/',
    api:'http://corotear.azurewebsites.net/Corotear.asmx'
  } 
})
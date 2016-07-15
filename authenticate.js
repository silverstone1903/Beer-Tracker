module.exports = {
  check: function(users, username, password) {
    var matched = [];
    users.forEach(function(user) {
      if (username === user.name) {
        matched.push(user);
      }
    });
    if (matched.length > 0) {
      if (matched[0].password === password) {
        return true;
      } else {
        return false;
      }
    }
  }
}

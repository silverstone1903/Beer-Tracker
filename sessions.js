module.exports = {
  sessions: [],

  check: function(id) {
    var matched = sessions.filter(session => session.id = id);
  }
};

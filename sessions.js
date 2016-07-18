module.exports = {
  sessions: [],

  check: function(id) {
    var matched = this.sessions.filter(session => session.id = id);
    return matched;
  }
};

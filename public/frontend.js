let userSession = [];

//Chart functionality
google.charts.load('current', {packages: ['corechart']});

let drawStyleChart = () => {
  $.ajax({
    url: "beer/profile/" + userSession,
    method: "GET",
    dataType: "json",
    success: function(json) {
      let data = new google.visualization.DataTable();
      let styles = [];
      let unique = [];
      let chart = new google.visualization.BarChart(document.getElementById('bar-chart'));
      let options = {
        'title': 'Your Beers by Style',
        legend: {position: 'none'}
      };

      data.addColumn('string', 'Style');
      data.addColumn('number', 'Beers');

      //take only the styles from the json data and store them in array styles
      json.forEach(function(beer) {
        styles.push(beer.style);
      });

      //in array styles, sort elements by name and how many times they occur
      let sorted = _.countBy(styles, _.identity);
      console.log(sorted);

      //turn data in var sorted into an acceptable format for google dataTable
      for (var prop in sorted) {
        let styleAndCount = {};
        styleAndCount.style = prop;
        styleAndCount.count = sorted[prop];
        unique.push(styleAndCount);
      }
      console.log(unique);

      for (let i = 0; i < unique.length; i++) {
        data.addRow([unique[i].style, unique[i].count]);
      }

      chart.draw(data, options);
    }
  });
}

let drawBreweryChart = () => {
  $.ajax({
    url: "beer/profile/" + userSession,
    method: "GET",
    dataType: "json",
    success: function(json) {
      let data = new google.visualization.DataTable();
      let breweries = [];
      let unique = [];
      let chart = new google.visualization.PieChart(document.getElementById('pie-chart'));
      let options = {
        title: 'Your Beers by Brewery',
        legend: {position: 'none'},
      }

      data.addColumn('string', 'Brewery');
      data.addColumn('number', 'Beers');

      //take only the breweries from the json data and store them in array breweries
      json.forEach(function(beer) {
        breweries.push(beer.brewery);
      });

      //in array breweries, sort elements by name and how many times they occur
      let sorted = _.countBy(breweries, _.identity);

      //turn data in var sorted into an acceptable format for google dataTable
      for (let prop in sorted) {
        let breweryCount = {};
        breweryCount.brewery = prop;
        breweryCount.count = sorted[prop];
        unique.push(breweryCount);
      }

      for (let i = 0; i < unique.length; i++) {
        data.addRow([unique[i].brewery, unique[i].count]);
      }

      chart.draw(data, options);
    }
  });
}

//Creates the DOM elements for each search result
let searchElements = data => {
  let container = document.createElement('div');
  let image = document.createElement('img');
  let stats = document.createElement('div');
  let name = document.createElement('div');
  let style = document.createElement('div');
  let abv = document.createElement('div');
  let checkButton = document.createElement('button');

  container.setAttribute('class', 'panel panel-default col-xs-12');
  container.setAttribute('id', 'search-panel');

  image.setAttribute('class', 'panel-body col-xs-2');
  image.setAttribute('id', 'beer-image');
  if(data.labels) {
    image.src = data.labels.icon;
  } else {
    image.src = '/images/icon-not-found.png';
  }

  stats.setAttribute('class', 'panel-body col-xs-8');

  name.setAttribute('id', 'beer-name');
  name.textContent = data.name + " -- " + data.breweries[0].name;

  //Accounts for missing styles in brewdb
  if(data.style) {
    style.textContent = data.style.name;
  } else {
    style.textContent = 'Style Unknown';
  }

  //Accounts for missing abv's in brewdb
  if(data.abv) {
    abv.textContent = data.abv + "% ABV";
  } else {
    abv.textContent = 'ABV Unknown';
  }

  //Allows check image to be used as button
  checkButton.setAttribute('type', 'button');
  checkButton.setAttribute('class', 'btn btn-warning pull-right check-button');
  checkButton.setAttribute('id', data.id);
  checkButton.setAttribute('data-target', '#myModal');
  checkButton.setAttribute('data-toggle', 'modal');
  checkButton.textContent = 'Check-In';

  container.appendChild(image);
  container.appendChild(stats);
  container.appendChild(checkButton);
  stats.appendChild(name);
  stats.appendChild(style);
  stats.appendChild(abv);

  return container;
}

//Creates the DOM layout for the recent beers on profile page
let recentElements = data => {
  let container = document.createElement('div');
  let names = document.createElement('div');
  let style = document.createElement('div');
  let stats = document.createElement('div');
  let statsRow = document.createElement('div');
  let rating = document.createElement('div');
  let location = document.createElement('div');
  let date = document.createElement('div');
  let notes = document.createElement('div');

  container.setAttribute('class', 'panel panel-default');

  names.setAttribute('class', 'panel-heading text-center');
  names.setAttribute('id', 'beer-name');
  names.textContent = data.name + ' -- ' + data.brewery;

  style.setAttribute('id', 'recent-style');
  style.textContent = data.style;

  stats.setAttribute('class', 'panel-body');

  statsRow.setAttribute('class', 'row');

  rating.setAttribute('class', 'col-xs-4 text-center');
  rating.setAttribute('id', 'rating-recent');
  rating.textContent = "Your Rating: " + data.rating;

  location.setAttribute('class', 'col-xs-4 text-center');
  location.textContent = "Where: " + data.location;

  date.setAttribute('class', 'col-xs-4 text-center');
  date.setAttribute('id', 'date-recent');
  date.textContent = "When: " + data.date;

  notes.setAttribute('class', 'panel-footer');
  notes.textContent = data.notes;

  container.appendChild(names);
  container.appendChild(stats);
  container.appendChild(notes);
  stats.appendChild(statsRow);
  statsRow.appendChild(rating);
  statsRow.appendChild(location);
  statsRow.appendChild(date);
  names.appendChild(style);

  return container;
}

//Toggles current page view
let swap = next => {
  let currentView = document.getElementsByClassName('current');
  currentView[0].classList.add('hide');
  currentView[0].classList.remove('current');

  let newView = document.getElementById(next);
  newView.classList.remove('hide');
  newView.classList.add('current');
}

//Provides number of total beers checked-in on profile
let totalCount = data => {
  let number = document.getElementById('total-checkins');
  let counter = 0;
  data.forEach(beer => {
    counter++;
  });

  number.textContent = "";
  number.textContent = " " + counter;
}

//Provides number of unique beers checked-in
let uniqueCount = data => {
  let number = document.getElementById('unique-beers');
  let unique = [];
  data.forEach(i => {
    if (unique.indexOf(i.name) == -1) {
      unique.push(i.name);
    }
  });
  number.textContent = "";
  number.textContent = " " + unique.length;
}

//Takes input from search bar and sends request to brewdb.  Returned info is then styled
//on the search results page
let submitSearch = () => {
  let beerSearch = document.getElementById('beer-search').value;
  let xhr = new XMLHttpRequest();

  xhr.open('GET', '/beer/search/:' + beerSearch);
  xhr.send();

  xhr.addEventListener('load', () => {
    let results = document.getElementById('results');
    let searchResults = JSON.parse(xhr.responseText);
    let noBeerModal = document.createElement('a');
    let noBeer = document.createElement('button');

    noBeerModal.setAttribute('data-target', '#addModal');
    noBeerModal.setAttribute('data-toggle', 'modal');

    noBeer.setAttribute('type', 'button');
    noBeer.setAttribute('class', 'btn btn-warning btn-lg btn-block');
    noBeer.setAttribute('id', 'no-beer');
    noBeer.textContent = "Don\'t see your beer?  Add it!";

    $("#results").empty();

    if(searchResults === null) {
      results.appendChild(noBeerModal);
    } else {
      searchResults.forEach(i => {
        results.appendChild(searchElements(i));
      });
    }

    results.appendChild(noBeerModal);
    noBeerModal.appendChild(noBeer);

  });
  swap('results', 'current');
}

let friendsList = data => {
  let container = document.createElement('div');
  let glyph = document.createElement('span');
  let user = document.createElement('div');

  container.setAttribute('class', 'panel panel-default');

  user.setAttribute('class', 'panel-body friends-panel');
  user.setAttribute('id', data);
  user.textContent = data;

  glyph.setAttribute('class', 'glyphicon glyphicon-remove pull-right remove');
  glyph.setAttribute('id', "remove-" + data);
  container.appendChild(user);
  user.appendChild(glyph);

  return container;

}

let styleConfirmation = data => {
  let container = document.createElement('div');
  let friend = document.createElement('div');
  let wrap = document.createElement('div');
  let accept = document.createElement('span');
  let deny = document.createElement('span');

  container.setAttribute('class', 'panel panel-default');

  friend.setAttribute('class', 'panel-body');
  friend.textContent = "Do you want to add " + data + " as a friend?";

  wrap.setAttribute('class', 'pull-right');

  accept.setAttribute('class', 'glyphicon glyphicon-ok accept');
  accept.setAttribute('id', data + '-accept');

  deny.setAttribute('class', 'glyphicon glyphicon-remove remove');
  deny.setAttribute('id', 'friend-deny');

  wrap.appendChild(accept);
  wrap.appendChild(deny);
  friend.appendChild(wrap);
  container.appendChild(friend);

  return container;
}

//--------------------------------------------------------------
//Begin event listeners
//--------------------------------------------------------------

$("#account-button").click(function() {
  let username = $("#new-username").val();
  let password = $("#new-password").val();
  let email = $("#new-email").val();
  let credentials = {};
  let xhr = new XMLHttpRequest();

  credentials.username = username;
  credentials.password = password;
  credentials.email = email;

  xhr.open('POST', '/login/new');
  xhr.setRequestHeader('Content-type', 'application/json');
  xhr.send(JSON.stringify(credentials));

  xhr.addEventListener('load', function() {
    if(xhr.responseText === 'Successful') {
      $("#login-message")
        .text('Account Created! Please sign in.')
        .addClass('login-message-success');
    }
    if(xhr.responseText === 'Unsuccessful') {
      $("#login-message")
        .text('This email address has already been used. Please try again.')
        .addClass('login-message-failed');
    }
    document.getElementById('account-form').reset();
  });
});

$("#signin-button").click(function() {
  let username = $("#username").val();
  let password = $("#password").val();
  let credentials = {};
  let xhr = new XMLHttpRequest();

  credentials.username = username;
  credentials.password = password;

  xhr.open('POST', '/login');
  xhr.setRequestHeader('Content-type', 'application/json');
  xhr.send(JSON.stringify(credentials));

  xhr.addEventListener('load', function() {
    if(xhr.responseText) {
      userSession.push(xhr.responseText);
      swap('opening-screen', 'current');
      $("#user").text(xhr.responseText);
      $("#top").removeClass('hide');
    } else {
      swap('login', 'current');
      $("#login-message").text('Login Unsuccessful. Please try again');
    }
  });
});

//Allow searches to be submitted with both clicking search button and pressing enter
$("#submit").click(submitSearch);
$('#search-form').keypress(function(e) {
  if (e.which == 13) {
    e.preventDefault();
    submitSearch();
  }
});

//Switches view to profile page when profile link is clicked
$("#profile-link").click(function() {
  let xhr = new XMLHttpRequest();
  xhr.open('GET', '/beer/profile/' + userSession[0]);
  xhr.send();

  xhr.addEventListener('load', function() {
    let beers = JSON.parse(xhr.responseText);

    $("#recent-beers").empty();
    totalCount(beers);
    uniqueCount(beers);
    $("#user-welcome").text(userSession[0]);

    beers.forEach(i => {
      $("#recent-beers").append(recentElements(i));
    });
  });
  swap('profile', 'current');
});

//Switches to stats page when clicked, draws graphs
$("#stats-link").click(function() {
  drawStyleChart();
  drawBreweryChart();
  swap('user-stats', 'current');
});

//Passes the ID of that particular beer to the modal's submit button
$("#results").click(function(e) {
  if (e.target.getAttribute('class') == 'btn btn-warning pull-right check-button'){
    let modalSubmit = document.getElementsByClassName('beer-submit')[0];
    modalSubmit.setAttribute('id', e.target.getAttribute('id'));
  }
});

$("#friends-list").click(function(e) {
  if(e.target.getAttribute('class') === 'glyphicon glyphicon-remove pull-right') {
    let id = e.target.getAttribute('id').toString().split('-');
    let friend = id[1];
    let xhr = new XMLHttpRequest();

    xhr.open('DELETE', '/friends/' + userSession[0] + '/' + friend);
    xhr.send();

    xhr.addEventListener('load', function() {
      if(xhr.responseText) {
        $(e.target).parent().parent().remove();
        console.log(friend + ' is no longer a friend');
      } else {
        console.log('Error');
      }
    });
  }

  if(e.target.getAttribute('class') === 'panel-body friends-panel') {
    let friend = e.target.getAttribute('id');
    console.log(friend);
    let xhr = new XMLHttpRequest();

    xhr.open('GET', '/beer/profile/' + friend);
    xhr.send();

    xhr.addEventListener('load', function() {
      let beers = JSON.parse(xhr.responseText);
      $("#friends-checkins").empty();
      console.log(beers);

      if(beers.length === 0) {
        $("#friends-checkins").text(friend + " has no checkins");
      } else {
        beers.forEach(function(beer) {
          $("#friends-checkins").append(recentElements(beer));
        });
      }
    });
  }
});

$("#friends-button").click(function() {
  let friend = $("#friends-search").val();
  let xhr = new XMLHttpRequest();

  xhr.open('GET', '/friends/search/' + friend);
  xhr.send();

  xhr.addEventListener('load', function() {
    let potentialFriend = xhr.responseText;
    $("#friend-confirmation").empty();

    if(potentialFriend !== 'User not found') {
      $("#friend-confirmation").append(styleConfirmation(potentialFriend));
    } else {
      $("#friend-confirmation").text('User not Found');
    }
  });
});

$("#friends-link").click(function() {
  let xhr = new XMLHttpRequest();

  $("#friends-list").empty();
  $("#friends-checkins").empty();
  $("#friend-confirmation").empty();

  xhr.open('GET', '/friends/' + userSession[0]);
  xhr.send();

  xhr.addEventListener('load', function() {
    if(xhr.responseText) {
      let friends = JSON.parse(xhr.responseText);
      friends.forEach(function(friend) {
        $("#friends-list").append(friendsList(friend));
      });
    } else {
      $("#friends-list").text("No friends found");
    }
    swap('user-friends', 'current');
  });
});

$("#friend-confirmation").click(function(e) {
  if(e.target.getAttribute('class') === 'glyphicon glyphicon-ok accept') {
    let id = e.target.getAttribute('id').toString().split('-');
    let friend = id[0];
    let xhr = new XMLHttpRequest();

    xhr.open('POST', '/friends/' + userSession[0] + '/' + friend);
    xhr.send();

    xhr.addEventListener('load', function() {
      $("#friends-list").append(friendsList(friend));
      $("#friend-confirmation").empty();
    });
  }

  if(e.target.getAttribute('class') === 'glyphicon glyphicon-remove remove') {
    $("#friend-confirmation").empty();
  }
});

//Sends the beer ID and user input to the checkin route
var submitCheckIn = document.getElementsByClassName('beer-submit')[0];
submitCheckIn.addEventListener('click', function(e) {
  let id = submitCheckIn.getAttribute('id');
  let checkIn = {};
  let xhr = new XMLHttpRequest();

  checkIn.user = userSession[0];
  checkIn.id = submitCheckIn.getAttribute('id');
  checkIn.notes = document.getElementById('tasting-notes').value;
  checkIn.location = document.getElementById('location').value;
  checkIn.date = document.getElementById('date').value;
  checkIn.rating = document.getElementById('rating').value;

  xhr.open('POST', '/beer/checkin/' + id);
  xhr.setRequestHeader('Content-type', 'application/json');
  xhr.send(JSON.stringify(checkIn));

  xhr.addEventListener('load', function() {
    document.getElementById('checkin-form').reset();
  });
});

$("#addBeer").click(function() {
  let addedBeer = {};
  let xhr = new XMLHttpRequest();

  addedBeer.user = userSession[0];
  addedBeer.name = document.getElementById('addName').value;
  addedBeer.brewery = document.getElementById('addBrewery').value;
  addedBeer.style = document.getElementById('addStyle').value;
  addedBeer.id = Math.floor(Math.random() * 10001);
  addedBeer.notes = document.getElementById('addNotes').value;
  addedBeer.location = document.getElementById('addLocation').value;
  addedBeer.date = document.getElementById('addDate').value;
  addedBeer.rating = document.getElementById('addRating').value;

  xhr.open('POST', '/beer/add');
  xhr.setRequestHeader('Content-type', 'application/json');
  xhr.send(JSON.stringify(addedBeer));

  xhr.addEventListener('load', function() {
    document.getElementById('add-form').reset();
  });
});

$("#profile-search-button").click(function() {
  let selector = $("#profile-select option:selected").val();
  let search = $("#profile-search").val();
  let xhr = new XMLHttpRequest();

  if(selector === 'Beer') {
    xhr.open('GET', '/search/beer/' + search + '/' + userSession);
  } else if(selector === 'Brewery') {
    xhr.open('GET', '/search/brewery/' + search + '/' + userSession);
  }

  xhr.send();

  xhr.addEventListener('load', function() {
    let beers = JSON.parse(xhr.responseText);
    $("#recent-beers").empty();

    if(beers.length === 0) {
      $("#recent-beers").append("<p>Not found. Please check your spelling/case and make sure you are using the right search selector</p>");
    } else {
      beers.forEach(i => {
        $("#recent-beers").append(recentElements(i));
      });
    }
  });
});

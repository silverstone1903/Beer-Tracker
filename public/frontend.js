let userSession = [];

//Chart functionality
google.charts.load('current', {packages: ['corechart']});

let drawChart = (specs) => {
  $.ajax({
    url: "beer/profile/" + userSession,
    method: "GET",
    dataType: "json",
    success: function(json) {
      let data = new google.visualization.DataTable();
      let chart = specs.chart;
      let options = {
        'title': specs.title,
        legend: {position: 'none'}
      };

      const unique = json
        //Take the needed metric from the json data (style, brewery, etc...)
        .map(beer => beer[specs.type])
        //Mold the data to be an array populated by arrays that contain a string and a count
        .reduce((acc, val) => {
          let added = false;
          acc.forEach(arr => {
            if (arr[0] === val) {
              arr[1]++;
              added = true;
            }
          })
          if (!added) {
            acc.push([val, 1]);
          }
          return acc;
        },[]);

      data.addColumn('string', specs.metric);
      data.addColumn('number', 'Beers');
      data.addRows(unique);
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
  if (data.labels) {
    image.src = data.labels.icon;
  } else {
    image.src = '/images/icon-not-found.png';
  }

  stats.setAttribute('class', 'panel-body col-xs-8');

  name.setAttribute('id', 'beer-name');
  name.textContent = data.name + " -- " + data.breweries[0].name;

  //Accounts for missing styles in brewdb
  if (data.style) {
    style.textContent = data.style.name;
  } else {
    style.textContent = 'Style Unknown';
  }

  //Accounts for missing abv's in brewdb
  if (data.abv) {
    abv.textContent = data.abv + "% ABV";
  } else {
    abv.textContent = 'ABV Unknown';
  }

  checkButton.setAttribute('type', 'button');
  checkButton.setAttribute('class', 'btn btn-warning pull-right check-button');
  checkButton.setAttribute('id', data.id);
  checkButton.setAttribute('data-target', '#myModal');
  checkButton.setAttribute('data-toggle', 'modal');
  checkButton.textContent = 'Check-In';

  //Build the whole element
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

  //Build the whole element
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
  let newView = document.getElementById(next);

  currentView[0].classList.add('hide');
  currentView[0].classList.remove('current');

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
    let noBeer = document.createElement('button');

    noBeer.setAttribute('type', 'button');
    noBeer.setAttribute('class', 'btn btn-warning btn-lg btn-block');
    noBeer.setAttribute('id', 'no-beer');
    noBeer.setAttribute('data-target', '#addModal');
    noBeer.setAttribute('data-toggle', 'modal');
    noBeer.textContent = "Don\'t see your beer?  Add it!";

    $("#results").empty();

    if (searchResults === null) {
      results.appendChild(noBeer);
    } else {
      searchResults.forEach(i => {
        results.appendChild(searchElements(i));
        results.appendChild(noBeer);
      });
    }
    swap('results', 'current');
  });
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

function sendXHR(options) {
  let xhr = new XMLHttpRequest();
  xhr.open(options.method, options.url);
  if (options.header) {
    xhr.setRequestHeader(options.header, options.headerType);
    xhr.send(JSON.stringify(options.payload));
  } else {
    xhr.send();
  }
  xhr.addEventListener('load', options.callback);
}

//--------------------------------------------------------------
//Begin event listeners
//--------------------------------------------------------------

$("#account-button").click(function() {
  let username = $("#new-username").val();
  let password = $("#new-password").val();
  let email = $("#new-email").val();
  let xhr = new XMLHttpRequest();
  let credentials = {
    username,
    password,
    email
  }

  let options = {
    method: 'POST',
    url: '/login/new',
    header: 'Content-type',
    headerType: 'application/json',
    payload: credentials,
    callback: onLoad
  }

  function onLoad() {
    if (this.responseText === 'Successful') {
      $("#login-message")
        .text('Account Created! Please sign in.')
        .addClass('login-message-success');
    }
    if (this.responseText === 'Unsuccessful') {
      $("#login-message")
        .text('This email address has already been used. Please try again.')
        .addClass('login-message-failed');
    }
    document.getElementById('account-form').reset();
  }
  sendXHR(options);
});

$("#signin-button").click(function() {
  let username = $("#username").val();
  let password = $("#password").val();
  let xhr = new XMLHttpRequest();
  let credentials = {
    username,
    password
  }

  let options = {
    method: 'POST',
    url: '/login',
    header: 'Content-type',
    headerType: 'application/json',
    payload: credentials,
    callback: onLoad
  }

  function onLoad() {
    if (this.responseText) {
      userSession.push(this.responseText);
      swap('opening-screen', 'current');
      $("#user").text(this.responseText);
      $("#top").removeClass('hide');
    } else {
      swap('login', 'current');
      $("#login-message").text('Login Unsuccessful. Please try again');
    }
  }
  sendXHR(options);
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
  let options = {
    method: 'GET',
    url: '/beer/profile/' + userSession[0],
    callback: onLoad
  }

  function onLoad() {
    let beers = JSON.parse(this.responseText);

    $("#recent-beers").empty();
    totalCount(beers);
    uniqueCount(beers);
    $("#user-welcome").text(userSession[0]);

    beers.forEach(i => {
      $("#recent-beers").append(recentElements(i));
    });
    swap('profile', 'current');
  }
  sendXHR(options);
});

//Switches to stats page when clicked, draws graphs
$("#stats-link").click(function() {
  const styleOptions = {
    title: 'Your Beers by Style',
    chart: new google.visualization.BarChart(document.getElementById('bar-chart')),
    type: 'style',
    metric: 'Style',
  }

  const breweryOptions = {
    title: 'Your Beers by Brewery',
    chart: new google.visualization.PieChart(document.getElementById('pie-chart')),
    type: 'brewery',
    metric: 'Brewery',
  }

  drawChart(styleOptions);
  drawChart(breweryOptions);
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
  if (e.target.getAttribute('class') === 'glyphicon glyphicon-remove pull-right') {
    let id = e.target.getAttribute('id').toString().split('-');
    let friend = id[1];
    let xhr = new XMLHttpRequest();

    xhr.open('DELETE', '/friends/' + userSession[0] + '/' + friend);
    xhr.send();

    xhr.addEventListener('load', function() {
      if (xhr.responseText) {
        $(e.target).parent().parent().remove();
      } else {
        console.log('Error');
      }
    });
  }

  if (e.target.getAttribute('class') === 'panel-body friends-panel') {
    let friend = e.target.getAttribute('id');
    let xhr = new XMLHttpRequest();

    xhr.open('GET', '/beer/profile/' + friend);
    xhr.send();

    xhr.addEventListener('load', function() {
      let beers = JSON.parse(xhr.responseText);
      $("#friends-checkins").empty();

      if (beers.length === 0) {
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

  let options = {
    method: 'GET',
    url: '/friends/search/' + friend,
    callback: onLoad
  }
  
  function onLoad() {
    let potentialFriend = this.responseText;
    $("#friend-confirmation").empty();

    if (potentialFriend !== 'User not found') {
      $("#friend-confirmation").append(styleConfirmation(potentialFriend));
    } else {
      $("#friend-confirmation").text('User not Found');
    }
  }
  sendXHR(options);
});

$("#friends-link").click(function() {
  let xhr = new XMLHttpRequest();
  let options = {
    method: 'GET',
    url: '/friends/' + userSession[0],
    callback: onLoad
  }

  function onLoad() {
    if (this.responseText) {
      let friends = JSON.parse(this.responseText);
      friends.forEach(function(friend) {
        $("#friends-list").append(friendsList(friend));
      });
    } else {
      $("#friends-list").text("No friends found");
    }
    swap('user-friends', 'current');
  }

  $("#friends-list").empty();
  $("#friends-checkins").empty();
  $("#friend-confirmation").empty();

  sendXHR(options);
});

$("#friend-confirmation").click(function(e) {
  if (e.target.getAttribute('class') === 'glyphicon glyphicon-ok accept') {
    let id = e.target.getAttribute('id').toString().split('-');
    let friend = id[0];
    let options = {
      method: 'POST',
      url: '/friends/' + userSession[0] + '/' + friend,
      callback: onLoad
    }

    function onLoad() {
      $("#friends-list").append(friendsList(friend));
      $("#friend-confirmation").empty();
    }
    sendXHR(options);
  }
  if (e.target.getAttribute('class') === 'glyphicon glyphicon-remove remove') {
    $("#friend-confirmation").empty();
  }
});

//Sends the beer ID and user input to the checkin route
var submitCheckIn = document.getElementsByClassName('beer-submit')[0];
submitCheckIn.addEventListener('click', function() {
  const user = userSession[0];
  const id = submitCheckIn.getAttribute('id');
  const notes = document.getElementById('tasting-notes').value;
  const location = document.getElementById('location').value;
  const date = document.getElementById('date').value;
  const rating = document.getElementById('rating').value;
  const checkIn = {
    user,
    id,
    notes,
    location,
    date,
    rating
  }

  let options = {
    method: 'POST',
    url: '/beer/checkin/' + id,
    header: 'Content-type',
    headerType: 'application/json',
    payload: checkIn,
    callback: onLoad
  }

  function onLoad() {
    document.getElementById('checkin-form').reset();
  }
  sendXHR(options);
});

$("#addBeer").click(function() {
  const user = userSession[0];
  const name = document.getElementById('addName').value;
  const brewery = document.getElementById('addBrewery').value;
  const style = document.getElementById('addStyle').value;
  const id = Math.floor(Math.random() * 10001);
  const notes = document.getElementById('addNotes').value;
  const location = document.getElementById('addLocation').value;
  const date = document.getElementById('addDate').value;
  const rating = document.getElementById('addRating').value;
  const addedBeer = {
    user,
    name,
    brewery,
    style,
    id,
    notes,
    location,
    date,
    rating
  }

  const options = {
    method: 'POST',
    url: '/beer/add',
    header: 'Content-type',
    headerType: 'application/json',
    payload: addedBeer,
    callback: onLoad
  }

  function onLoad() {
    document.getElementById('add-form').reset();
  }
  sendXHR(options);
});

$("#profile-search-button").click(function() {
  let selector = $("#profile-select option:selected").val();
  let search = $("#profile-search").val();
  let xhr = new XMLHttpRequest();

  if (selector === 'Beer') {
    xhr.open('GET', '/search/beer/' + search + '/' + userSession);
  } else if (selector === 'Brewery') {
    xhr.open('GET', '/search/brewery/' + search + '/' + userSession);
  }

  xhr.send();

  xhr.addEventListener('load', function() {
    let beers = JSON.parse(xhr.responseText);
    $("#recent-beers").empty();

    if (beers.length === 0) {
      $("#recent-beers").append("<p>Not found. Please check your spelling/case and make sure you are using the right search selector</p>");
    } else {
      beers.forEach(i => {
        $("#recent-beers").append(recentElements(i));
      });
    }
  });
});



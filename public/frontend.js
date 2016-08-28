//Chart functionality
google.charts.load('current', {packages: ['corechart']});

function check() {
  var xhr = new XMLHttpRequest();
  xhr.open('POST', '/login/check');
  xhr.send();

  xhr.addEventListener('load', function() {
    if (xhr.responseText) {
      swap('opening-screen', 'current');
      $("#user").text(xhr.responseText);
      $("#top").removeClass('hide');
    } else {
      swap('login', 'current');
    }
  });
}

function drawStyleChart() {
  $.ajax({
    url: "beer/profile",
    method: "GET",
    dataType: "json",
    success: function(json) {
      var data = new google.visualization.DataTable();
      data.addColumn('string', 'Style');
      data.addColumn('number', 'Beers');
      data.addColumn({ type: 'string', role: 'style'});

      var styles = [];
      var unique = [];

      function randomColor() {
        var letters = '0123456789ABCDEF'.split('');
        var color = '#';
        for (var i = 0; i < 6; i++ ) {
          color += letters[Math.floor(Math.random() * 16)];
        }
        return color;
      }

      //take only the styles from the json data and store them in array styles
      json.forEach(function(beer) {
        styles.push(beer.style);
      });

      //in array styles, sort elements by name and how many times they occur
      var sorted = _.countBy(styles, _.identity);

      //turn data in var sorted into an acceptable format for google dataTable
      for (var prop in sorted) {
        var styleAndCount = {};
        styleAndCount.style = prop;
        styleAndCount.count = sorted[prop];
        unique.push(styleAndCount);
      }

      for (var i = 0; i < unique.length; i++) {
        data.addRow([unique[i].style, unique[i].count, randomColor()]);
      }

      var options = {
        'title': 'Your Beers by Style',
        legend: {position: 'none'}
      };
      var chart = new google.visualization.BarChart(document.getElementById('bar-chart'));
      chart.draw(data, options);
    }
  });
}

function drawBreweryChart() {
  $.ajax({
    url: "beer/profile",
    method: "GET",
    dataType: "json",
    success: function(json) {
      var data = new google.visualization.DataTable();
      data.addColumn('string', 'Brewery');
      data.addColumn('number', 'Beers');
      data.addColumn({ type: 'string', role: 'style'});

      var breweries = [];
      var unique = [];

      function randomColor() {
        var letters = '0123456789ABCDEF'.split('');
        var color = '#';
        for (var i = 0; i < 6; i++ ) {
          color += letters[Math.floor(Math.random() * 16)];
        }
        return color;
      }

      //take only the breweries from the json data and store them in array breweries
      json.forEach(function(beer) {
        breweries.push(beer.brewery);
      });

      //in array breweries, sort elements by name and how many times they occur
      var sorted = _.countBy(breweries, _.identity);

      //turn data in var sorted into an acceptable format for google dataTable
      for (var prop in sorted) {
        var breweryCount = {};
        breweryCount.brewery = prop;
        breweryCount.count = sorted[prop];
        unique.push(breweryCount);
      }

      for (var i = 0; i < unique.length; i++) {
        data.addRow([unique[i].brewery, unique[i].count, randomColor()]);
      }

      var options = {
        title: 'Your Beers by Brewery',
        legend: {position: 'none'},
      };

      var chart = new google.visualization.PieChart(document.getElementById('pie-chart'));
      chart.draw(data, options);
    }
  });
}

//Creates the DOM elements for each search result
function searchElements(data) {
  var container = document.createElement('div');
  container.setAttribute('class', 'panel panel-default col-xs-12');
  container.setAttribute('id', 'search-panel');

  var image = document.createElement('img');
  image.setAttribute('class', 'panel-body col-xs-2');
  image.setAttribute('id', 'beer-image');
  if(data.labels) {
    image.src = data.labels.icon;
  } else {
    image.src = '/images/icon-not-found.png';
  }

  var stats = document.createElement('div');
  stats.setAttribute('class', 'panel-body col-xs-8');

  var name = document.createElement('div');
  name.setAttribute('id', 'beer-name');

  var style = document.createElement('div');
  var abv = document.createElement('div');

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
  var checkButton = document.createElement('button');
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
function recentElements(data) {
  var container = document.createElement('div');
  container.setAttribute('class', 'panel panel-default');

  var names = document.createElement('div');
  names.setAttribute('class', 'panel-heading text-center');
  names.setAttribute('id', 'beer-name');
  names.textContent = data.name + ' -- ' + data.brewery;

  var style = document.createElement('div');
  style.setAttribute('id', 'recent-style');
  style.textContent = data.style;

  var stats = document.createElement('div');
  stats.setAttribute('class', 'panel-body');

  var statsRow = document.createElement('div');
  statsRow.setAttribute('class', 'row');

  var rating = document.createElement('div');
  rating.setAttribute('class', 'col-xs-4 text-center');
  rating.setAttribute('id', 'rating-recent');
  rating.textContent = "Your Rating: " + data.rating;

  var location = document.createElement('div');
  location.setAttribute('class', 'col-xs-4 text-center');
  location.textContent = "Where: " + data.location;

  var date = document.createElement('div');
  date.setAttribute('class', 'col-xs-4 text-center');
  date.setAttribute('id', 'date-recent');
  date.textContent = "When: " + data.date;

  var notes = document.createElement('div');
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
function swap(next, current) {
  var currentView = document.getElementsByClassName('current');
  currentView[0].classList.add('hide');
  currentView[0].classList.remove('current');

  var newView = document.getElementById(next);
  newView.classList.remove('hide');
  newView.classList.add('current');
}

//Provides number of total beers checked-in on profile
function totalCount(data) {
  var number = document.getElementById('total-checkins');
  var counter = 0;
  data.forEach(function(beer) {
    counter++;
  });

  number.textContent = "";
  number.textContent = " " + counter;
}

//Provides number of unique beers checked-in
function uniqueCount(data) {
  var number = document.getElementById('unique-beers');
  var unique = [];
  data.forEach(function(i) {
    if (unique.indexOf(i.name) == -1) {
      unique.push(i.name);
    }
  });
  number.textContent = "";
  number.textContent = " " + unique.length;
}

//Takes input from search bar and sends request to brewdb.  Returned info is then styled
//on the search results page
function submitSearch() {
  var beerSearch = document.getElementById('beer-search').value;

  var xhr = new XMLHttpRequest();
  xhr.open('GET', '/beer/search/:' + beerSearch);
  xhr.send();

  xhr.addEventListener('load', function() {
    var results = document.getElementById('results');
    var searchResults = JSON.parse(xhr.responseText);
    var noBeerModal = document.createElement('a');
    noBeerModal.setAttribute('data-target', '#addModal');
    noBeerModal.setAttribute('data-toggle', 'modal');

    var noBeer = document.createElement('button');
    noBeer.setAttribute('type', 'button');
    noBeer.setAttribute('class', 'btn btn-warning btn-lg btn-block');
    noBeer.setAttribute('id', 'no-beer');
    noBeer.textContent = "Don\'t see your beer?  Add it!";

    $("#results").empty();

    if(searchResults === null) {
      results.appendChild(noBeerModal);
    } else {
      searchResults.forEach(function(i) {
        results.appendChild(searchElements(i));
      });
    }
    results.appendChild(noBeerModal);
    noBeerModal.appendChild(noBeer);
  });
  swap('results', 'current');
}

$("#account-button").click(function() {
  var username = $("#new-username").val();
  var password = $("#new-password").val();

  var credentials = {};
  credentials.username = username;
  credentials.password = password;

  var xhr = new XMLHttpRequest();
  xhr.open('POST', '/login/new');
  xhr.setRequestHeader('Content-type', 'application/json');
  xhr.send(JSON.stringify(credentials));

});

$("#signin-button").click(function() {
  var username = $("#username").val();
  var password = $("#password").val();

  var credentials = {};
  credentials.username = username;
  credentials.password = password;

  var xhr = new XMLHttpRequest();
  xhr.open('POST', '/login');
  xhr.setRequestHeader('Content-type', 'application/json');
  xhr.send(JSON.stringify(credentials));

  xhr.addEventListener('load', function() {
    check();
  });
});

window.addEventListener('load', function() {
  check();
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
  var xhr = new XMLHttpRequest();
  xhr.open('GET', '/beer/profile');
  xhr.send();

  xhr.addEventListener('load', function(){
    var beers = JSON.parse(xhr.responseText);
    var recentBeers = document.getElementById('recent-beers');
    var beerList = document.createElement('div');

    $("#recent-beers").empty();
    totalCount(beers);
    uniqueCount(beers);

    beerList.setAttribute('class', 'container');

    beers.forEach(function(i) {
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
    var modalSubmit = document.getElementsByClassName('beer-submit')[0];
    modalSubmit.setAttribute('id', e.target.getAttribute('id'));
  }
});

//Sends the beer ID and user input to the checkin route
var submitCheckIn = document.getElementsByClassName('beer-submit')[0];
submitCheckIn.addEventListener('click', function(e) {
  var id = submitCheckIn.getAttribute('id');
  var checkIn = {};

  checkIn.id = submitCheckIn.getAttribute('id');
  checkIn.notes = document.getElementById('tasting-notes').value;
  checkIn.location = document.getElementById('location').value;
  checkIn.date = document.getElementById('date').value;
  checkIn.rating = document.getElementById('rating').value;

  var xhr = new XMLHttpRequest();
  xhr.open('POST', '/beer/checkin/' + id);
  xhr.setRequestHeader('Content-type', 'application/json');
  xhr.send(JSON.stringify(checkIn));

  xhr.addEventListener('load', function() {
    document.getElementById('checkin-form').reset();
  });
});

$("#addBeer").click(function() {
  var addedBeer = {};

  addedBeer.name = document.getElementById('addName').value;
  addedBeer.brewery = document.getElementById('addBrewery').value;
  addedBeer.style = document.getElementById('addStyle').value;
  addedBeer.id = Math.floor(Math.random() * 10001);
  addedBeer.notes = document.getElementById('addNotes').value;
  addedBeer.location = document.getElementById('addLocation').value;
  addedBeer.date = document.getElementById('addDate').value;
  addedBeer.rating = document.getElementById('addRating').value;

  var xhr = new XMLHttpRequest();
  xhr.open('POST', '/beer/add');
  xhr.setRequestHeader('Content-type', 'application/json');
  xhr.send(JSON.stringify(addedBeer));

  xhr.addEventListener('load', function() {
    document.getElementById('add-form').reset();
  });
});

$("#profile-search-button").click(function() {
  var selector = $("#profile-select option:selected").val();
  var search = $("#profile-search").val();

  var xhr = new XMLHttpRequest();
  if(selector === 'Beer') {
    xhr.open('GET', '/search/beer/' + search);
  } else if(selector === 'Brewery') {
    xhr.open('GET', '/search/brewery/' + search);
  }
  xhr.send();

  xhr.addEventListener('load', function() {
    console.log(xhr.responseText);
  });
});

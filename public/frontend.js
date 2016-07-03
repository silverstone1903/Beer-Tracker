function clear(area) {
  while(area.firstChild) {
    area.removeChild(area.firstChild);
  }
}

function searchElements(data) {
  console.log(data);
  var container = document.createElement('div');
  container.setAttribute('class', 'panel panel-default col-xs-12');
  container.setAttribute('id', 'search-panel');


  var image = document.createElement('img');
  image.setAttribute('class', 'panel-body col-xs-2')
  image.setAttribute('id', 'beer-image');
  if(data.labels) {
    image.src = data.labels.icon;
  } else {
    image.src = '/images/icon-not-found.png'
  }

  var stats = document.createElement('div');
  stats.setAttribute('class', 'panel-body col-xs-8');

  var name = document.createElement('div');
  name.setAttribute('id', 'beer-name');

  var style = document.createElement('div');
  var abv = document.createElement('div');

  name.textContent = data.name + " -- " + data.breweries[0].name;

  if(data.style) {
    style.textContent = data.style.name;
  } else {
    style.textContent = 'Style Unknown';
  }

  if(data.abv) {
  abv.textContent = data.abv + "% ABV";
} else {
  abv.textContent = 'ABV Unknown';
}

  var aTag = document.createElement('a');
  aTag.setAttribute('data-target', '#myModal');
  aTag.setAttribute('data-toggle', 'modal');

  var checkButton = document.createElement('img');
  checkButton.setAttribute('class', 'panel-body pull-right col-xs-2 check-button');
  checkButton.setAttribute('id', data.id);
  checkButton.src = '/images/check.png';

  container.appendChild(image);
  container.appendChild(stats);
  container.appendChild(aTag);
  aTag.appendChild(checkButton);
  stats.appendChild(name);
  stats.appendChild(style);
  stats.appendChild(abv);

  return container;
}

function recentElements(data) {
  var container = document.createElement('div');
  container.setAttribute('class', 'panel panel-default');
  container.setAttribute('id', 'box-shadow');

  var names = document.createElement('div');
  names.setAttribute('class', 'panel-heading text-center');
  names.textContent = data.name + ' -- ' + data.brewery;

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

  return container;
}

function swap(next, current) {
  var currentView = document.getElementsByClassName('current');
  currentView[0].classList.add('hide');
  currentView[0].classList.remove('current');

  var newView = document.getElementById(next);
  newView.classList.remove('hide');
  newView.classList.add('current');
}

var submit = document.getElementById('submit');
submit.addEventListener('click', function() {
  var beerSearch = document.getElementById('beer-search').value;

  var xhr = new XMLHttpRequest();
  xhr.open('GET', '/search/:' + beerSearch);
  console.log(beerSearch);
  xhr.send();

  xhr.addEventListener('load', function() {
    var results = document.getElementById('results');
    var searchResults = JSON.parse(xhr.responseText);
    console.log(searchResults);
    clear(results);

    searchResults.forEach(function(i) {
      results.appendChild(searchElements(i));
    });
  })
  swap('results', 'current');
})

var switchToProfile = document.getElementById('profile-link');
switchToProfile.addEventListener('click', function() {
  swap('profile', 'current');

  var xhr = new XMLHttpRequest();
  xhr.open('GET', '/profile');
  xhr.send();

  xhr.addEventListener('load', function(){
    var beers = JSON.parse(xhr.responseText);
    var recentBeers = document.getElementById('recent-beers');
    var beerList = document.createElement('div');

    clear(recentBeers);

    beerList.setAttribute('class', 'container');

    beers.forEach(function(i) {
      recentBeers.appendChild(recentElements(i));
    })
  })
})

var checkIn = document.getElementById('results');
checkIn.addEventListener('click', function(e) {
  if (e.target.getAttribute('class') == 'panel-body pull-right col-xs-2 check-button'){
    var modalSubmit = document.getElementsByClassName('beer-submit')[0];
    modalSubmit.setAttribute('id', e.target.getAttribute('id'));
  }
})

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
  xhr.open('POST', '/checkin/' + id);
  xhr.setRequestHeader('Content-type', 'application/json');
  xhr.send(JSON.stringify(checkIn));

  xhr.addEventListener('load', function() {
    document.getElementById('checkin-form').reset();
  })
})

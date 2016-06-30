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
  var checkIn = {};

  checkIn.id = submitCheckIn.getAttribute('id');
  checkIn.notes = document.getElementById('tasting-notes').value;
  checkIn.location = document.getElementById('location').value;
  checkIn.date = document.getElementById('date').value;
  checkIn.rating = document.getElementById('rating').value;

  var xhr = new XMLHttpRequest();
  xhr.open('POST', '/checkin/');
  xhr.setRequestHeader('Content-type', 'application/json');
  xhr.send(JSON.stringify(checkIn));

  xhr.addEventListener('load', function() {
    document.getElementById('checkin-form').reset();
  })
})

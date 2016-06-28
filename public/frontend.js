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
    searchResults.forEach(function(result) {
      var name = document.createElement('div');
      name.textContent = result.name + " - " + result.breweries[0].name;
      results.appendChild(name);
    })
  })
})

function clear(area) {
  while(area.firstChild) {
    area.removeChild(area.firstChild);
  }
}

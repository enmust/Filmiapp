var apiKey = "f6e9099ea367aae389133db80fde6b80";

function goBack() {
    window.history.back();
}

function reloadPage() {
    location.reload(true);
}

function getPopularMovies() {
    var url = "https://api.themoviedb.org/3/movie/popular?api_key=" + apiKey + "&language=en-US&page=1"
    
    $.get(url, function (data) {
        $('#menu').empty();
        
        var count = 0;
        while (count < data.results.length) {
            var movieId = JSON.stringify(data.results[count].id).replace(/"/g, "");
            var movieTitle = JSON.stringify(data.results[count].title).replace(/"/g, "");
            var movieOverview = JSON.stringify(data.results[count].overview).replace(/"/g, "");
            var moviePoster = JSON.stringify(data.results[count].poster_path).replace(/"/g, "");
            var moviePosterAlt = JSON.stringify(data.results[count].backdrop_path).replace(/"/g, "");
            var moviePosterSrc = "http://image.tmdb.org/t/p/w185/" + moviePoster;
            
            if (moviePoster == "null") {
                    if (moviePosterAlt == "null") {
                        moviePosterSrc = "img/NoImage.png";
                    } else {
                        moviePoster = moviePosterAlt;
                        moviePosterSrc = "http://image.tmdb.org/t/p/w185/" + moviePoster;
                    }
                }
            
            document.getElementById('menu').innerHTML += "<li class='ui-li-has-thumb'><a href='#page2' movie-id='" + movieId + "' data-transition='fade' class='ui-btn' onclick='getMovieInfo()'><img src='" + moviePosterSrc + "' movie-id='" + movieId + "'><h2 movie-id='" + movieId + "'>" + movieTitle + "</h2><p movie-id='" + movieId + "'>" + movieOverview + "</p></a></li>";
            count += 1;
        }
    })
}

function searchMovie() {
    var getSearch = document.getElementById('searchBox').value.trim();
    
    if (getSearch.length === 0) {
        getPopularMovies();
    } else {
        var url = "https://api.themoviedb.org/3/search/movie?api_key=" + apiKey + "&language=en-US&query=" + getSearch + "&page=1&include_adult=false";

        $.get(url, function (data) {
            $('#menu').empty();

            var count = 0;
            while (count < data.results.length) {
                var movieId = JSON.stringify(data.results[count].id).replace(/"/g, "");
                var movieTitle = JSON.stringify(data.results[count].original_title).replace(/"/g, "");
                var movieOverview = JSON.stringify(data.results[count].overview).replace(/"/g, "");
                var moviePoster = JSON.stringify(data.results[count].poster_path).replace(/"/g, "");
                var moviePosterAlt = JSON.stringify(data.results[count].backdrop_path).replace(/"/g, "");
                var moviePosterSrc = "http://image.tmdb.org/t/p/w185/" + moviePoster;
                
                if (moviePoster == "null") {
                    if (moviePosterAlt == "null") {
                        moviePosterSrc = "img/NoImage.png";
                    } else {
                        moviePoster = moviePosterAlt;
                        moviePosterSrc = "http://image.tmdb.org/t/p/w185/" + moviePoster;
                        
                    }
                }
                
                document.getElementById('menu').innerHTML += "<li class='ui-li-has-thumb'><a href='#page2' movie-id='" + movieId + "' data-transition='fade' class='ui-btn' onclick='getMovieInfo()'><img src='" + moviePosterSrc + "' movie-id='" + movieId + "'><h2 movie-id='" + movieId + "'>" + movieTitle + "</h2><p movie-id='" + movieId + "'>" + movieOverview + "</p></a></li>";
                count += 1;
            }
        })
    }
}

function getMovieInfo() {
    var movieId = $(event.target).attr('movie-id');
    var url = "https://api.themoviedb.org/3/movie/" + movieId + "?api_key=" + apiKey;
    
    $.get(url, function(data) {
        $('#movieTitle').empty();
        $('#moviePage').empty();
        
        var movieTitle = JSON.stringify(data.original_title).replace(/"/g, "");
        var movieYear = JSON.stringify(data.release_date).replace(/"/g, "").substring(0, 4);
        
        if (movieYear.length == 0) {
            movieYear = "";
        } else {
            movieYear = " (" + movieYear + ") ";
        }
        
        var movieOverview = JSON.stringify(data.overview).replace(/"/g, "");
        
        var moviePoster = JSON.stringify(data.poster_path).replace(/"/g, "");
        var moviePosterAlt = JSON.stringify(data.backdrop_path).replace(/"/g, "");
        var moviePosterSrc = "http://image.tmdb.org/t/p/w185/" + moviePoster;
                
        if (moviePoster == "null") {
            if (moviePosterAlt == "null") {
                moviePosterSrc = "img/NoImage.png";
            } else {
                moviePoster = moviePosterAlt;
                moviePosterSrc = "http://image.tmdb.org/t/p/w185/" + moviePoster;
                        
            }
        }
        
        var buttonValue = "Add to Watchlist";
        var onClick = 'addToWatchlist('+"'"+movieTitle+"'"+","+"'"+movieId+"'"+')';
        
        if (isMovieInWatchlist(movieTitle)) {
            buttonValue = "Remove from Watchlist";
            onClick = 'removeFromWatchlist('+"'"+movieTitle+"'"+","+"'"+movieId+"'"+')';
        }
        
        document.getElementById('movieTitle').innerHTML = movieTitle + " " + movieYear + " ";
        document.getElementById('moviePage').innerHTML = "<div id='picAndText'><img id='moviePoster' align='left' src='" + moviePosterSrc + "'><p>" + movieOverview + "</p></div><div id='actorDiv' data-role='main' class='ui-content'><p id='actorTitle'><b>Top actors: </b></p><ul id='actors' data-role='listview'></ul></div>" + '<input class="watchlistButton" id="watchlistButton" type="submit" value="' + buttonValue +'" onclick="' + onClick +'"><div id="trailerView"><iframe id="movieTrailer" src="" width="100%" height="298" frameborder=0 allowfullscreen></iframe></div>';
        
        if (document.getElementById('watchlistButton').value === "Remove from Watchlist") {
            document.getElementById('watchlistButton').style.background = '#f44336';
        }
        
        getActors(movieId);
        getTrailer(movieId);
    })
    
}

function isMovieInWatchlist(movieTitle) {
    if (typeof(localStorage) !== 'undefined') {
        if (localStorage['Watchlist'] === undefined) {
            return false;
        } else {
            var watchlistArray = JSON.parse(localStorage.Watchlist);
            for (i = 0; i < watchlistArray.length; i++) {
                if (watchlistArray[i].title === movieTitle) {
                    return true;
                }
            }
            return false;
        }
    }
}

function getActors(movieId) {
    var url = "https://api.themoviedb.org/3/movie/" + movieId + "/credits?api_key=" + apiKey;
    
    $.get(url, function(data) {
        
        if (data.cast.length == 0) {
            return document.getElementById('actors').innerHTML = "<li><b style='color:red'>No actors data!</b></li>"
        }

        var numOfIteration = 10;        
        if (data.cast.length < 10) {
            numOfIteration = data.cast.length;
        }
        
        for (i = 0; i < numOfIteration; i++) {
            var actor = JSON.stringify(data.cast[i].name).replace(/"/g, "");
            
            document.getElementById('actors').innerHTML += "<li>" + actor + "</li>";
        }
    })
}

function getTrailer(movieId) {
    var url = "https://api.themoviedb.org/3/movie/" + movieId + "/videos?api_key=" + apiKey + "&language=en-US";
    
    $.get(url, function(data) {
        if (data.results.length === 0) {
            document.getElementById('trailerView').innerHTML = "<p style='color: red; font-weight: bold;'>No trailer data!</p>";
        } else {
            document.getElementById('movieTrailer').src = "https://www.youtube.com/embed/" + data.results[0].key;       
        }
    })
}

function addToWatchlist(movieTitle, movieId) {    
    if (typeof(localStorage) !== 'undefined') {
        if (localStorage['Watchlist'] === undefined) {
            var watchlistArray = [];
        } else {
            var watchlistArray = JSON.parse(localStorage.Watchlist);
        }
        
        var movie = {};
        movie.title = movieTitle;
        movie.id = movieId;
        
        watchlistArray.push(movie);
        localStorage['Watchlist'] = JSON.stringify(watchlistArray);
        document.getElementById('watchlistButton').value = "Remove from Watchlist";
        document.getElementById('watchlistButton').setAttribute('onclick','removeFromWatchlist('+"'"+movieTitle+"'"+","+"'"+movieId+"'"+')');
        document.getElementById('watchlistButton').style.background = '#f44336';
        //document.getElementById('watchlistButton').onclick = function(){ removeFromWatchlist(movieTitle,movieId); }; works but does not show change in html
        document.activeElement.blur();
        }
}

function removeFromWatchlist(movieTitle, movieId) {
    if (typeof(localStorage) !== 'undefined') {
        if (localStorage['Watchlist'] === undefined) {
            var watchlistArray = [];
            return false;
        } else {
            var watchlistArray = JSON.parse(localStorage.Watchlist);
        }
        
        for (i = 0; i < watchlistArray.length; i++) {
            if (watchlistArray[i].title == movieTitle && watchlistArray[i].id == movieId) {
                watchlistArray.splice(i,1);
            }
        }
        localStorage['Watchlist'] = JSON.stringify(watchlistArray);
        
        
        document.getElementById('watchlistButton').value = "Add to Watchlist";
        document.getElementById('watchlistButton').setAttribute('onclick','addToWatchlist('+"'"+movieTitle+"'"+","+"'"+movieId+"'"+')');
        document.getElementById('watchlistButton').style.background = '#008CBA';
        //document.getElementById('watchlistButton').onclick = function(){ removeFromWatchlist(movieTitle,movieId); }; works but does not show change in html
        document.activeElement.blur();
        }
}

function generateWatchlist() {
    $('#watchlistMenu').empty();
    if (typeof(localStorage) !== 'undefined') {
        if (localStorage['Watchlist'] === undefined) {
            var watchlistArray = [];
        } else {
            var watchlistArray = JSON.parse(localStorage.Watchlist);        
        }

        var count = 0;
        while (count < watchlistArray.length) {        

            document.getElementById('watchlistMenu').innerHTML += "<li><a movie-id='" + watchlistArray[count].id + "' href='#page2' data-transition='fade' class='ui-btn' onclick='getMovieInfo()'><h2 movie-id='" + watchlistArray[count].id + "'>" + watchlistArray[count].title + "</h2></a></li>";
            count += 1;
        }
    }
}

function pressEnterToSearch() {
    $("#searchBox").keyup(function(event){
        if(event.keyCode == 13){
            searchMovie();
            document.activeElement.blur();
        }
    });
}

getPopularMovies();
generateWatchlist();
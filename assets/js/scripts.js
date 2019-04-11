$(function() {
    $(".movies-list__slider").slick({
        variableWidth: true,
        prevArrow: '<button type="button" class="slick-prev"><i class="fas fa-chevron-left"></i></button>',
        nextArrow: '<button type="button" class="slick-next"><i class="fas fa-chevron-right"></i></button>'
    });

    var API = "https://api.themoviedb.org/3/";
    var KEY = "4ba13f07eb7d66f818df7d9bf080d2e8";
    var BACKDROP ="http://image.tmdb.org/t/p/original";
    var POSTER ="http://image.tmdb.org/t/p/w342";
   
 /* filmes populares*/

     $.ajax(API + "discover/movie?api_key=" + KEY + "&language=pt-BR")
    .done(function(res){
        //Filme pricipal//        
        var mainMovie = res.results[0];       
        mountMainMovie(mainMovie);

        //lista de filmes populares//
        var listMovies = res.results.slice(1);          
       mountListSlider(listMovies, "#slider-popular");
        });


  
    function mountMainMovie(movie){
        $("#main-backdrop").css("background-image", "url('"+ BACKDROP + movie.backdrop_path +"')")
        $("#main-title").html(movie.title);
        $("#main-vote").html(movie.vote_average);
    }

    function moutPoster(image, title, vote){
        
        var movieItem = '<div class="movies-list__slider">';
        movieItem+= ' <div class="movies-list__item">';
        movieItem+= ' <img src="'+image+'">';
        movieItem+= ' <div class="movies-list__action">';
        movieItem+= ' <div class="movies-list__action">';
        movieItem+= '   <i class="far fa-play-circle"></i>';
        movieItem+= ' <h3>'+title+'</h3> ';
        movieItem+= ' <div class="rating"> ';
        movieItem+= ' <div class="rating__score">'+vote+'</div> ';
        movieItem+= ' </div> </div> </div>  ';

        return movieItem;
    }

    function mountListSlider(list,element){
        list.forEach(function(movie){
            var image = POSTER + movie.poster_path;
            var title = movie.title;
            var vote = movie.vote_average;
    
                $(element).slick("slickAdd", moutPoster(image, title, vote));
            });

    }

});
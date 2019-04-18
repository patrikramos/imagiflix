$(function() {
	$(".movies-list__slider").slick({
		variableWidth: true,
		prevArrow: '<button type="button" class="slick-prev"><i class="fas fa-chevron-left"></i></button>',
		nextArrow: '<button type="button" class="slick-next"><i class="fas fa-chevron-right"></i></button>'
	});


	var API = "https://api.themoviedb.org/3/";
	var KEY = "4ba13f07eb7d66f818df7d9bf080d2e8";
	var BACKDROP = "http://image.tmdb.org/t/p/original";
	var POSTER = "http://image.tmdb.org/t/p/w342";
	var MODAL_POSTER = "http://image.tmdb.org/t/p/w500";

	$.ajax(API + "discover/movie?api_key=" + KEY + "&language=pt-BR")
		.done(function(res){
			// Filme principal
			var mainMovie = res.results[0];
			mountMainMovie(mainMovie);

			// Lista de filmes populares
			var listMovies = res.results.slice(1);
			mountListSlider(listMovies, "#slider-popular");
		});

	$.ajax(API + "discover/tv?api_key=" + KEY + "&language=pt-BR")
		.done(function(res){
			mountListSlider(res.results, "#slider-tv");
		});
	
	$.ajax(API + "discover/movie?api_key=" + KEY + "&language=pt-BR&with_genres=10751")
		.done(function(res){
			mountListSlider(res.results, "#slider-family");
		});

	$("#play-featured, .movies-list__slider").click(function(event) {
		if ( $(this).data("id") ){
			var id = $(this).data("id");
		} else {
			var id = $(event.target).closest("[data-id]").data("id");
		}

		$("#modal").fadeIn();
		
		var getMovie = API + "movie/" + id + "?api_key=" + KEY + "&language=pt-BR";

		$.ajax(getMovie).done(function(res) {
			mountModal(res);
		});
	});

	$("#modal .modal-close").click(function() {
		$("#modal").fadeOut();
	});

	function mountMainMovie(movie) {
		$("#main-backdrop").css("background-image", "url('"+ BACKDROP + movie.backdrop_path +"')");
		$("#main-title").html(movie.title);
		$("#main-vote").html(movie.vote_average);
		$("#play-featured").attr("data-id", movie.id);
	}

	function mountPoster(image, title, vote, id) {
		var movieItem = '<div class="movies-list__item" data-id="'+ id +'">';
			movieItem += '<img src="'+image+'">';
			movieItem += '<div class="movies-list__action">';
			movieItem += '<i class="far fa-play-circle"></i>';
			movieItem += '<h3>'+title+'</h3>';
			movieItem += '<div class="rating">';
			movieItem += '<div class="rating__score">'+vote+'</div>';
			movieItem += '</div></div></div>';
		
		return movieItem;
	}

	function mountListSlider(list, element) {
		list.forEach(function(movie){
			var id = movie.id;
			var image = POSTER + movie.poster_path;
			var title;
			if (movie.title) {
				title = movie.title;
			} else {
				title = movie.name;
			}
			var vote = movie.vote_average;

			$(element).slick("slickAdd", mountPoster(image, title, vote, id));
		});
	}

	function mountModal(res) {
		console.log(res);
		var poster = MODAL_POSTER + res.poster_path;
		var title = res.title;
		var originalTitle = res.original_title;
		var description = res.overview;
		var vote = res.vote_average;
		var duration = res.runtime;
		var site = res.homepage;

		$("#modal .modal-poster img").attr("src", poster);
		$("#modal .modal-title").text(title);
		$("#modal .modal-original-title").text(originalTitle);
		$("#modal .modal-description").text(description);
		$("#modal .rating__score").text(vote);
		$("#modal .modal-duration").html('<i class="far fa-clock"></i> ' + duration + 'min');
		$("#modal .modal-link").attr("href", site).text(site);
	}

	$(document).ajaxComplete(function(){
		setTimeout(function(){
			$("#loading").fadeOut();
		}, 500);
	});

	$(document).ajaxStart(function(){
		$("#loading").fadeIn();
	});
});
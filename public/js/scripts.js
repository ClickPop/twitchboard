$(document).ready(function() {
    $('.range-slider.background-opacity').slider({
    	formatter: function(value) {
    		return value + "%";
    	}
    });

    $('.theme-select').on('change', function() {
        console.log('changed');
        var $select = $(this);
        var theme = $select.val().trim();
        var $container = $('.admin-preview .container')
        var currentTheme = $container.data('current-theme');
        var channel = $select.data('channel');

        $.ajax({
          type: "POST",
          url: "/admin/" + channel + "/set-theme/" + theme,
          success: function(data) {
              console.log(data);
              if (data.hasOwnProperty('success') && data.success == true) {
                  $('.leaderboard').removeClass(currentTheme).addClass(theme);
                  $container.data('current-theme', theme);
              }
          },
        });

    });

});

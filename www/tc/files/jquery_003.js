(function($){
     $.fn.tick = function(message){
        return this.each(function(){
           var $this = $(this);

           var $thisTick = $this.children('.tick').first();
           var $thisCross = $this.children('.cross').first();
           
           $thisTick.show();
           $thisCross.hide();
        });
     };
})(jQuery);

(function($){
    $.fn.cross = function(message){
       return this.each(function(){
          var $this = $(this);

          var $thisTick = $this.children('.tick').first();
          var $thisCross = $this.children('.cross').first();
          
          $thisTick.hide();
          $thisCross.show();
       });
    };
})(jQuery);

(function($){
    $.fn.neither = function(message){
       return this.each(function(){
          var $this = $(this);

          var $thisTick = $this.children('.tick').first();
          var $thisCross = $this.children('.cross').first();
          
          $thisTick.hide();
          $thisCross.hide();
       });
    };
})(jQuery);

(function($){
    $.fn.none = $.fn.neither;
})(jQuery);

// Thanks to http://www.brian-driscoll.com/2010/11/jqueryui-plugin-highlight-and-error.html

(function($){
     $.fn.writeError = function(message){
        return this.each(function(){
           var $this = $(this);
           var errorHtml = "<div class=\"ui-state-error ui-corner-all\" style=\"padding: 0 .7em;\">";
           errorHtml+= "<p>";
           errorHtml+= "<span class=\"ui-icon ui-icon-alert\" style=\"float:left; margin-right: .3em;\"></span>";
           errorHtml+= "<span>" + message + "</span>";
           errorHtml+= "</p>";
           errorHtml+= "</div>";
           
           $this.html(errorHtml);
           $this.show();
        });
     };
})(jQuery);

(function($){
     $.fn.writeAlert = function(message){
        return this.each(function(){
           var $this = $(this);
           var alertHtml = "<div class=\"ui-state-highlight ui-corner-all\" style=\"padding: 0 .7em;\">";
           alertHtml+= "<p>";
           alertHtml+= "<span class=\"ui-icon ui-icon-info\" style=\"float:left; margin-right: .3em;\"></span>";
           alertHtml+= message;
           alertHtml+= "</p>";
           alertHtml+= "</div>";
           
           $this.html(alertHtml); 
           $this.show();
        });
     };
})(jQuery);

(function($){
    $.fn.writeSuccess = function(message){
       return this.each(function(){
          var $this = $(this);
          var successHtml = "<div class=\"ui-state-success ui-corner-all\" style=\"padding: 0 .7em;\">";
          successHtml+= "<p>";
          successHtml+= "<span class=\"ui-icon ui-icon-check\" style=\"float:left; margin-right: .3em;\"></span>";
          successHtml+= message;
          successHtml+= "</p>";
          successHtml+= "</div>";

          $this.html(successHtml); 
          $this.show();
       });
    };
})(jQuery);
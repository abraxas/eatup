'use strict';

var $scope = {};

require(['config'], function (config) {
    var app = {
        initialize: function () {
            new RecipeFormController();
            // Your code here
        }
    };
    app.initialize();
});

var RecipeFormController = function() {
  require(['jquery','dust-helpers','view-model'], function($,dust,view) {


    var ctrl = {
    };




    console.log("Controller Done!");
  });
};


define('view-model',[
    "jquery","dust-helpers",
    "text!/templates/US/en/recipes/partials/_recipe_form.js",
    "text!/templates/US/en/recipes/partials/_recipe_form_ingredient.js",
    "text!/templates/US/en/recipes/partials/_recipe_form_ingredients.js",
    "text!/templates/US/en/recipes/partials/_recipe_form_step.js",
    "text!/templates/US/en/recipes/partials/_recipe_form_steps.js",
    "text!/templates/US/en/recipes/partials/_recipe_view_contents.js"],function($,dust,a,b,c,d,e,f,g) {
      dust.loadSource(a);
      dust.loadSource(b);
      dust.loadSource(c);
      dust.loadSource(d);
      dust.loadSource(e);
      dust.loadSource(f);
      dust.loadSource(g);
     
$.fn.selectRange = function(start, end) {
    return this.each(function() {
        if (this.setSelectionRange) {
            this.focus();
            this.setSelectionRange(start, end);
        } else if (this.createTextRange) {
            var range = this.createTextRange();
            range.collapse(true);
            range.moveEnd('character', end);
            range.moveStart('character', start);
            range.select();
        }
    });
};


      var viewmodel = {
        clear_steps: function() {
               $("#recipe-steps").html("");
             },  
          add_step: function(step,offset) {
               offset = offset || $scope.offset || $("#recipe-steps textarea").length + 1;
               var render_data = {step: "",offset: offset};              
               $scope.offset = offset+1;

               dust.render("recipes/partials/_recipe_form_step",
                   render_data,function(err,out) {
                   if(err) {
                     console.log(err);
                   }
                   $('#recipe-steps').append(out);
                   });
               return false;
             },
          add_ingredient: function(ingredient,offset) {
               var render_data = ingredient

               dust.render("recipes/partials/_recipe_form_ingredient",
                   render_data,function(err,out) {
                   if(err) {
                     console.log(err);
                   }
                   $('#recipe-ingredients').append(out);
                   });
               return false;
             },
          re_number: function() {
            var _$steplabels = $("#recipe-steps label.step-label");
            var offset = 1;
            _$steplabels.each(function(ind,Element) {
              $(Element).html(''+ offset++ + ".");                            
            });
            $scope.offset = offset;
            
          }

      };

      $('#steps-wrapper').on('click','#add_step',viewmodel.add_step);
      $('#ingredients-wrapper').on('click','#add_ingredient',viewmodel.add_ingredient);

      //step binding and auto-full
      $("#recipe-steps").on('keyup','textarea',function() {
          viewmodel.add_step()
          return false;
      });
      $("#recipe-steps").on('click','a.remove-step',function() {
          $(this).parents("div.recipe-step").remove();
          viewmodel.re_number();
          return false;
      });


      //some setup

      console.log("View Done!");      
      return viewmodel;
    });

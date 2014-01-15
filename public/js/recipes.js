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
    $scope.steps = $("#recipe-steps").data("steps-value") || [""];
    console.log("SS = " + JSON.stringify($scope.steps))

    view.render_steps();

    var ctrl = {
      add_step: function() {
        $scope.steps.push('');
        view.render_steps();
      }
    };

    $(document).on('click','#add_step',ctrl.add_step);

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
        render_steps: function(data) {
                var steps = data || $scope.steps;
                var i = 1;
                var focus = $(":focus").parent().index();

                viewmodel.clear_steps();

                steps = [].concat(steps);

                steps.forEach(function(step) {
                    viewmodel.render_step(step,i++);                    
                    });
                if(focus) {
                  var bar = $("#recipe-steps :nth-child("+focus+") input");

                  var x = $("#recipe-steps :nth-child("+focus+") input");
                  x.focus().selectRange(0,0);
                }

              },
          render_step: function(step,offset) {
               offset = offset || $scope.steps.length;
               var render_data = {step: step,offset: offset};              

               console.log("WTF " + JSON.stringify(render_data));
               dust.render("recipes/partials/_recipe_form_step",
                   render_data,function(err,out) {
                   if(err) {
                   console.log(err);
                   }
                   console.log("WOOT " + out);
                   $('#recipe-steps').append(out);
                   });
             }

      };

      //step binding and auto-full
      $("#recipe-steps").on('keyup','input',function() {
          var new_steps = $("#recipe-steps input").map(function() {
            return $(this).val();
          }).get();
          console.log("RS " + JSON.stringify(new_steps));

          $scope.steps = new_steps;          
          while($scope.steps.length > 1 && ($scope.steps[new_steps.length -1] === "") && ($scope.steps[new_steps.length -2] === "") ) {
              $scope.steps.pop();
              viewmodel.render_steps()
          } 
          if($scope.steps[new_steps.length -1] !== "") {
              $scope.steps.push("");
              viewmodel.render_step()
          } 




      });

      console.log("View Done!");      
      return viewmodel;
    });

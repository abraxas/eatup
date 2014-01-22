"use strict";

var $scope = {};

require([ "config" ], function(config) {
    var app = {
        initialize: function() {
            new RecipeFormController();
        }
    };
    app.initialize();
});

var RecipeFormController = function() {
    require([ "jquery", "dust-helpers", "view-model" ], function($, dust, view) {
        var ctrl = {};
        console.log("Controller Done!");
    });
};

define("view-model", [ "jquery", "dust-helpers", "upload", "text!/templates/US/en/recipes/partials/_recipe_form.js", "text!/templates/US/en/recipes/partials/_recipe_form_ingredient.js", "text!/templates/US/en/recipes/partials/_recipe_form_ingredient_inner.js", "text!/templates/US/en/recipes/partials/_recipe_form_step.js", "text!/templates/US/en/recipes/partials/_recipe_form_steps.js", "text!/templates/US/en/recipes/partials/_recipe_view_contents.js" ], function($, dust, a, b, c, d, e, f) {
    dust.loadSource(a);
    dust.loadSource(b);
    dust.loadSource(c);
    dust.loadSource(d);
    dust.loadSource(e);
    dust.loadSource(f);
    $.fn.selectRange = function(start, end) {
        return this.each(function() {
            if (this.setSelectionRange) {
                this.focus();
                this.setSelectionRange(start, end);
            } else if (this.createTextRange) {
                var range = this.createTextRange();
                range.collapse(true);
                range.moveEnd("character", end);
                range.moveStart("character", start);
                range.select();
            }
        });
    };
    var viewmodel = {
        add_step: function(step, offset) {
            offset = offset || $scope.offset || $("#recipe-steps textarea").length + 1;
            var render_data = {
                step: "",
                offset: offset
            };
            $scope.offset = offset + 1;
            dust.render("recipes/partials/_recipe_form_step", render_data, function(err, out) {
                if (err) {
                    console.log(err);
                }
                $("#recipe-steps").append(out);
            });
            return false;
        },
        add_ingredient: function(ingredient, offset) {
            var render_data = ingredient;
            dust.render("recipes/partials/_recipe_form_ingredient", render_data, function(err, out) {
                if (err) {
                    console.log(err);
                }
                $("#recipe-ingredients").append(out);
            });
            return false;
        },
        re_number: function() {
            var _$steplabels = $("#recipe-steps label.step-label");
            var offset = 1;
            _$steplabels.each(function(ind, Element) {
                $(Element).html("" + offset++ + ".");
            });
            $scope.offset = offset;
        },
        get_data: function() {
            var rval = {};
            console.log("GETDATA!");
            rval.name = $('#recipe-form input[name="name"]').val();
            rval.desc = $('#recipe-form input[name="description"]').val();
            rval.ingredients = viewmodel.get_ingredients_data();
            rval.steps = viewmodel.get_steps_data();
            rval.image = $("#recipe-form #recipe-image-upload").val();
            return rval;
        },
        get_ingredients_data: function() {
            console.log("WTF " + $("div.ingredient-row").length);
            return $("div.ingredient-row").map(function() {
                var rval = {};
                $(this).find("input").each(function() {
                    rval[$(this).attr("name")] = $(this).val();
                });
                return rval;
            }).get();
        },
        get_steps_data: function() {
            var $tex = $("#recipe-steps").find("textarea");
            var steps = $tex.map(function(i, E) {
                return $(E).val();
            }).get();
            if (steps[steps.length - 1] == "") {
                steps.pop();
            }
            return steps;
        },
        swap_ingredient_type: function(target) {
            var $target = $(target);
            var $div = $target.parents(".ingredient-row");
            var render_data;
            if ($div.hasClass("custom")) {
                console.log("Toggle from custom to non-custom.");
                $div.removeClass("custom");
                var cval = $div.find("input").val();
                $div.data("custom", cval);
                var render_data = $div.data("ingredient-data") || {};
            } else {
                console.log("Toggle from non-custom to custom.");
                $div.addClass("custom");
                var cvals = {};
                $div.find("input").each(function() {
                    cvals[$(this).attr("name")] = $(this).val();
                });
                $div.data("ingredient-data", cvals);
                var cust = $div.data("custom") || "";
                var render_data = {
                    custom_ingredient: cust,
                    show_custom: 1
                };
            }
            dust.render("recipes/partials/_recipe_form_ingredient_inner", render_data, function(err, out) {
                if (err) {
                    console.log(err);
                }
                $div.html(out);
            });
            return false;
        },
        submit: function(imagedata) {
            var data = viewmodel.get_data();

            data._csrf = $("#csrf").val();
            
            console.log("SUBMIT! " + JSON.stringify(data));
            console.log("AND IMAGE " + imagedata);            
//            console.log("TO: " + location.pathname + "/" + url);
    
            if(imagedata) {
              imagedata.formData =  function(form) {
                    console.log("REALLY?" + form.serializeArray());
                    console.log("FORMING + " + $(this).parents('form').serializeArray());
                    return form.serializeArray();
                };
              imagedata.submit().always(function() {
                console.log("SUCK_WHAT_IMG?");
              });

            }
            else {
              $.ajax({
                  type: "POST",
                  data: data,
                  success: function() {
                      console.log("SUCK_WHAT?");
                  }
              });
            }
            return false;
        },
        progress: function(p) {
            console.log("PROGRESS... " + p);
        }
    };
    function readURL(input) {
        if (input.files && input.files[0]) {
            var reader = new FileReader();
            reader.onload = function(e) {
                $("#recipe-image-preview").attr("src", e.target.result);
            };
            reader.readAsDataURL(input.files[0]);
        }
    }
    $("#recipe-image-upload").change(function() {
        readURL(this);
    });
    $("#steps-wrapper").on("click", "#add_step", viewmodel.add_step);
    $("#ingredients-wrapper").on("click", "#add_ingredient", viewmodel.add_ingredient);
    $("#recipe-steps").on("keyup", "textarea", function() {
        if ($("#recipe-steps textarea").last().val() !== "") {
            viewmodel.add_step();
        }
        return false;
    });
    $("#recipe-steps").on("click", "a.remove-step", function() {
        $(this).parents("div.recipe-step").remove();
        viewmodel.re_number();
        return false;
    });
    $("#recipe-ingredients").on("click", "a.remove-ingredient", function() {
        $(this).parents("div.recipe-ingredient").remove();
        return false;
    });
    $("#recipe-ingredients").on("click", "a.swap-ingredient", function() {
        viewmodel.swap_ingredient_type(this);
        return false;
    });
    $("#submit").click(function(event) {
        event.preventDefault();
        viewmodel.submit(null);
        return false;
    });
    $("#recipe-image-upload").fileupload({
        dataType: "json",
        autoUpload: false,
        maxFileSize: 1e7,
        done: function(e, data) {
            console.log("DONE!");
        },
        add: function(e, data) {
            $("#submit").unbind('click');
            $("#submit").click(function(event) {
                viewmodel.submit(data);
                return false;
            });
        }
    });
    console.log("View Done!");
    return viewmodel;
});

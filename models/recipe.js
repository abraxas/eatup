"use strict";

var mongoose = require("mongoose"), 
    Schema = mongoose.Schema, 
    autoIncrement = require("mongoose-auto-increment"),
    ObjectId = Schema.ObjectId, fs = require("fs"), 
    Grid = require("gridfs-stream");

autoIncrement.initialize(mongoose.connection);


//Migration path...
// db.recipes.update({},{$set: {user_email: "mirthlady@aol.com"} });
// db.recipes.getIndexes()            //<-- get the index
// db.recipes.dropIndex({ "_id": 1});

var recipeModel = function() {
    var ingredientSchema = new Schema({
        raw_amount: String,
        amount: Number,
        measure: String,
        ingredient: {
            type: String,
            required: true
        }
    });
    var recipeSchema = new Schema({
        user_email: {
            type: String,
            required: true,
            ref: "User"
        },
        name: {
            type: String,
            required: true
        },
        description: {
            type: String
        },
        ingredients: [ ingredientSchema ],
        steps: [ String ],
        image_id: {
            type: ObjectId
        }
    });
    recipeSchema.methods.saveImage = function(upload, callback) {
        var recipe = this;
        var gfs = Grid(mongoose.connection.db, mongoose.mongo);
        var args = {
            mode: "w",
            filename: "recipe"
        };
        if (this.image_id) {
            args._id = this.image_id;
        }
        console.log("ARGH " + JSON.stringify(args));
        var writestream = gfs.createWriteStream(args);
        fs.createReadStream(upload.path).pipe(writestream);
        writestream.on("close", function(file) {
            console.log("Uploaded ID = " + file._id);
            console.log("SAVING " + recipe._id);
            recipe.image_id = file._id;
            recipe.save(function(err) {
                console.log("CABBA");
                callback(err, file);
            });
        });
    };
    recipeSchema.methods.getImageStream = function(res, fof) {
        var image_id = this.image_id;
        if (!image_id) {
            if (fof) {
                res.send(404, fof);
                return;
            } else {
                if (res) {
                    res.send(404, "File not found");
                }
                return null;
            }
        }
        var gfs = Grid(mongoose.connection.db, mongoose.mongo);
        var readstream = gfs.createReadStream({
            _id: image_id
        });
        if (res) {
            readstream.pipe(res);
        } else {}
        return readstream;
    };

    recipeSchema.plugin(autoIncrement.plugin, {
        model: "Recipe",
        startAt: 1
    });

    mongoose.model("Ingredient",ingredientSchema);
    return mongoose.model("Recipe",recipeSchema);
};

module.exports = new recipeModel();

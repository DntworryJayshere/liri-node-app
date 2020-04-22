require("dotenv").config();

var keys = require("./keys.js");
var Spotify = require("node-spotify-api");
var axios = require("axios");
var fs = require("fs");
var moment = require("moment")
//var inquirer = require('inquirer');
//var request = require("request");

var spotify = new Spotify(keys.spotify);

//array to hold all of the node arguments
var nodeArgs = process.argv;
var action = process.argv[2];
var valueName = "";
var divider = "\n------------------------------------------------------------------------------------\n\n";


for (var i = 3; i < nodeArgs.length; i++) {
    if (i > 3 && i < nodeArgs.length) {
        valueName = valueName + "+" + nodeArgs[i];
    } else {
        valueName += nodeArgs[i];
    }
}


function userCommand(action, valueName) {
    switch (action) {
        case "concert-this":
            concertThis(valueName);
            break;
        case "spotify-this-song":
            spotifyThis(valueName);
            break;
        case "movie-this":
            movieThis(valueName);
            break;
        case "do-what-it-says":
            doWhatItSays();
            break;
        default:
            console.log("Im sorry, I dont understand");
            break;
    }
}

userCommand(action, valueName);

//================================================================================================================================================
function concertThis(valueName) {
    var queryUrl = "https://rest.bandsintown.com/artists/" + valueName + "/events?app_id=codingbootcamp";
    //console.log(queryUrl);

    axios.get(queryUrl).then(function (response) {
        var showData = [];
        //var data = JSON.stringify(response.data, null, 2)
        for (let i = 0; i < response.data.length; i++) {
            let location = response.data[i].venue.location;
            // console.log(location)
            let venue = response.data[i].venue.name;
            // console.log(venue)
            let datetime = moment(response.data[i].datetime).format('MMMM Do YYYY, h:mm a');
            // console.log(datetime)
            let count = i + 1;

            let event = [
                "Count: " + count,
                "Venue: " + venue,
                "Location: " + location,
                "Date: " + datetime,
            ].join("\n");
            showData.push("\n\n"+event);
        }

        fs.appendFile("log.txt", showData + divider, function (err) {
            if (err) throw err;
            console.log(showData);
        });
    })
        .catch(function (err) {
            console.log(err);
        });
}


//================================================================================================================================================
function spotifyThis(valueName) {
    if (!valueName) {
        valueName = "The Sign";
    }

    spotify.search({ type: 'track', query: valueName }).then(function (resp) {
        var showData = [];

        for (let i = 0; i < resp.tracks.items.length; i++) {
            let track = resp.tracks.items[i].name
            let songUrl = resp.tracks.items[i].href
            let albumName = resp.tracks.items[i].album.name
            let artists = []
            for (let j = 0; j < resp.tracks.items[i].artists.length; j++) {
                let artistName = resp.tracks.items[i].artists[j].name
                artists.push(artistName)
            }
            let count = i + 1;
            let song = [
                "Count: " + count,
                "Artist(s): " + artists.join(","),
                "Song Name: " + track,
                "Preview Song: " + songUrl,
                "Ablbum: " + albumName,
            ].join("\n");
            showData.push("\n\n"+song);
        }
        fs.appendFile("log.txt", showData + divider, function (err) {
            if (err) throw err;
            console.log(showData);
        });
    })
        .catch(function (err) {
            console.log(err);
        });
}


//================================================================================================================================================
function movieThis(valueName) {
    if (!valueName) {
        valueName = "Mr. Nobody";
        console.log("If you haven't watched Mr. Nobody, then you should: http://www.imdb.com/title/tt0485947/");
    }

    var queryUrl = "http://www.omdbapi.com/?t=" + valueName + "&y=&plot=short&apikey=trilogy";
    //console.log(queryUrl);
    axios.get(queryUrl).then(
        function (response) {
            var movie = [
                "Title: " + response.data.Title,
                "Release Year: " + response.data.Year,
                "IMDB Rating: " + response.data.imdbRating,
                "Country: " + response.data.Country,
                "Language: " + response.data.Language,
                "Plot: " + response.data.Plot,
                "Actors: " + response.data.Actors
            ].join("\n");

            fs.appendFile("log.txt", movie + divider, function(err) {
                if (err) throw err;
                console.log(movie);
              });
        })
        .catch(function (err) {
            console.log(err);
        });
}


//================================================================================================================================================
function doWhatItSays() {
    fs.readFile("random.txt", "utf8", function (err, data) {
        if (err) {
            return console.log(err);
        }
        var output = data.split(",");
        action = output[0]
        valueName = output[1]
        userCommand(action, valueName);
    });
}
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
        //var data = JSON.stringify(response.data, null, 2)
        for (let i = 0; i < response.data.length; i++) {
            let location = response.data[i].venue.location;
            // console.log(location)
            let venue = response.data[i].venue.name;
            // console.log(venue)
            let datetime = moment(response.data[i].datetime).format('MMMM Do YYYY, h:mm a');
            // console.log(datetime)
            console.log(`${i + 1}
                    ${"Venue: " + venue}
                    ${"Location: " + location}
                    ${"Date: " + datetime}`)
        }
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
        for (let i = 0; i < resp.tracks.items.length; i++) {
            let track = resp.tracks.items[i].name
            let songUrl = resp.tracks.items[i].href
            let albumName = resp.tracks.items[i].album.name
            let artists = []
            for (let j = 0; j < resp.tracks.items[i].artists.length; j++) {
                let artistName = resp.tracks.items[i].artists[j].name
                artists.push(artistName)
            }
            console.log(`${i + 1}
                ${"Artist(s): " + artists.join(",")}
                ${"Song Name: " + track}
                ${"Preview Song: " + songUrl}
                ${"Ablbum: " + albumName}`)
        }
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
            console.log("Title: " + response.data.Title +
                "\nRelease Year: " + response.data.Year +
                "\nIMDB Rating: " + response.data.imdbRating +
                "\nCountry: " + response.data.Country +
                "\nLanguage: " + response.data.Language +
                "\nPlot: " + response.data.Plot +
                "\nActors: " + response.data.Actors);
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
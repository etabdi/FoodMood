$(document).ready(function () {
  var mapQuestKey = "wUnd0Bo4VFnAAn1TbHBgyoaEY3vhgkD6";

  var address, addressLatitude, addressLongitude, mapVar;

  L.mapquest.key = mapQuestKey;

  $("#cuisine, #address").keyup(function (event) {
    if (event.keyCode === 13) {
      $("#search").click();
    };
  });

  $("#search").on("click", function () {

    window.location.hash = '<a href="app.js';

    address = $("#address").val();

    var cuisines = $('#cuisine').val();

    $("body").css('background', 'white');

    $(".carousel-inner").hide();

    $(".jumbotron m-0").css({ 'background-color': 'none' });

    if (address === "" & cuisines === "") {
      return;
    }

    var longLatQueryURL = "https://www.mapquestapi.com/geocoding/v1/address?key=" + mapQuestKey + "&location=" + address;

    // location.reload() for changing pages?

    $.ajax({
      url: longLatQueryURL,
      method: "GET"
    })
      .then(function (response) {
        addressLatitude = response.results[0].locations[0].latLng.lat;

        addressLongitude = response.results[0].locations[0].latLng.lng;

        console.log("lat = " + addressLatitude + " while long = " + addressLongitude);


        /// --option two for zip-code vs logtide and  Latitude-----var url=" https://www.zipcodeapi.com/rest/<api_key>/info.<format>/<zip_code>/<units>",

        CustomEvent = "";


        console.log(cuisines);


        console.log(address);

        ///..."https://developers.zomato.com/api/v2.1/search?entity_id=280&sort=rating&order=asc&q=" +addressLatitude + "cuisines=" + cuisines + "&apikey=967e2e08ce22588b1668ae3b432bf765";
        ///...test api....https://developers.zomato.com/api/v2.1/search?entity_id=%2094741&entity_type=zone&cuisines=55&establishment_type=1
        var queryURL = "https://developers.zomato.com/api/v2.1/search?lat=" + addressLatitude + "&lon=" + addressLongitude + "&q=" + cuisines + "&sort=rating" + "&apikey=967e2e08ce22588b1668ae3b432bf765";
        $.ajax({
          url: queryURL,
          method: "get",
          headers: {
            'user-key': "967e2e08ce22588b1668ae3b432bf765",
          }
        })

          .then(function (data) {

            data = data.restaurants;

            var result = "";

            $(".result").empty();

            $.each(data, function (index, value) {
              var res = data[index];

              $.each(res, function (index, value) {

                var location = res.restaurant.location;

                var userRating = res.restaurant.user_rating;

                console.log(location);

                var result = "";

                result += "<div class='dataImg'>";

                result += "</div>";

                result += "<p " + "<strong>" + userRating.aggregate_rating + "<h7>" + "/5.0" + "</h7>" + "</strong></p><br>";

                result += "<a href=" + value.url + " target='_blank' class='action_link'>" + "<h2>" + value.name + "</strong></h2></a>";

                result += "<h4>" + '<strong>' + "Cuisines: " + '</strong>' + value.cuisines + "</h4>" + "<h6>" + location.address + "</h6>";

                result += "<h7>" + value.phone_numbers + "</h7>";

                result += "<a href=" + value.menu_url + " target='_blank' class='action_link'>" + "Menu" + "</a>";

                var newRow = $("<div>");

                var columnOne = $("<div>");

                var columnTwo = $("<div>");

                var columnThree = $("<div>");

                newRow.addClass("row");

                var foodImage = $("<img>");

                foodImage.attr("alt", "'coming soon'").attr("src", value.thumb).addClass("rest-img");

                columnOne.addClass("col-md-3").append(foodImage);

                columnTwo.addClass("col-md-6").html(result);

                var currentLocation = address.replace(/ /g, "+");

                var destinationAddress = location.address;

                destinationAddress = destinationAddress.replace(/ /g, "+");

                var mapImage = $("<img>");

                var mapQueryURL = "https://www.mapquestapi.com/staticmap/v5/map?start=" + currentLocation + "&end=" + destinationAddress + "&size=170,170@2x&key=" + mapQuestKey;

                mapImage.attr("src", mapQueryURL).attr("height", "200px").attr("width", "200px").addClass("mapImage").attr("restAddress", location.address).attr("restName", value.name);

                var mapInstruct = $("<h2>");

                mapInstruct.text("Click for Interactive Map").addClass("mapImage").css("opacity", ".7").css("background", "grey").css("color", "white").css("width", "200px").css("position", "absolute").css("bottom", "-2px").css("font-size", "16px").css("text-align", "center").css("padding", "8px 0");

                columnThree.addClass("col-md-3").addClass("mapColumn").append(mapImage, mapInstruct);

                newRow.append(columnOne, columnTwo, columnThree);

                $(".result").append(newRow, "<hr size='330'>");
              });
            });
          });
      });
  });

  $(".result").on("click", ".mapImage", function (event) {
    var currentRestaurant = $(this).attr("restName");

    $("#interactiveMapHeader").text("Map to " + currentRestaurant);

    $("#interactiveMap").modal("show");

    console.log(this);

    var endAddress = $(this).attr("restAddress");

    var targetLatLongQueryURL = "https://www.mapquestapi.com/geocoding/v1/address?key=" + mapQuestKey + "&location=" + endAddress;

    $.ajax({
      url: targetLatLongQueryURL,
      method: "GET"
    })
      .then(function (response) {
        var computeLatitude = response.results[0].locations[0].latLng.lat;

        var computeLongitude = response.results[0].locations[0].latLng.lng;

        computeLatitude += addressLatitude;

        computeLatitude = computeLatitude / 2;

        computeLongitude += addressLongitude;

        computeLongitude = computeLongitude / 2;

        if (mapVar) {
          mapVar.remove();
        }

        mapVar = L.mapquest.map("mapGoesHere", {
          center: [computeLatitude, computeLongitude],
          layers: L.mapquest.tileLayer("map"),
          zoom: 12
        });

        var directions = L.mapquest.directions();

        directions.setLayerOptions({
          startMarker: {
            icon: "marker",
            iconOptions: {
              size: "md",
              primaryColor: "#000000",
              secondaryColor: "#008000",
              symbol: "A"
            }
          },

          endMarker: {
            icon: "marker",
            iconOptions: {
              size: "md",
              primaryColor: "#000000",
              secondaryColor: "#ff4500",
              symbol: "B"
            }
          }
        });

        directions.route({
          start: address,
          end: endAddress
        });

        mapVar.addControl(L.mapquest.control());
      });
  });
});
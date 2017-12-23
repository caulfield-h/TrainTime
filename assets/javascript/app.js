$(document).ready(function() {

    var config = {
        apiKey: "AIzaSyA6U_I7e0flbghJCcHGmAd2PaZ0HWXYJds",
        authDomain: "traintime-54181.firebaseapp.com",
        databaseURL: "https://traintime-54181.firebaseio.com",
        projectId: "traintime-54181",
        storageBucket: "traintime-54181.appspot.com",
        messagingSenderId: "870925258283"
    };
    firebase.initializeApp(config);

    var dataReference = firebase.database();
    $("#add-train").on("click", function() {

        var name = $("#name-input").val().trim();
        var destination = $("#destination-input").val().trim();
        var firstTrainT = moment($("#first-train-input").val().trim(), "HH:mm").subtract(10, "years").format("X");
        var frequency = $("#frequency-input").val().trim();


        var trainObj = {

            name: name,
            destination: destination,
            firstTrain: firstTrainT,
            frequency: frequency
        };

        dataReference.ref().push(trainObj);

        $("name-input").val("");
        $("#destination-input").val("");
        $("#first-train-input").val("");
        $("#frequency-input").val("");
        console.log("cleared vals");

        return false;
    });

    dataReference.ref().on("child_added", function(childSnapshot, prevChildKey) {
            var cs = childSnapshot.val();

            var trainName = cs.name;
            var trainDest = cs.destination;
            var trainFreq = cs.frequency;
            var firstTrain = cs.firstTrain;


            var differenceTimes = moment().diff(moment.unix(firstTrain), "minutes");
            var remainder = moment().diff(moment.unix(firstTrain), "minutes") % trainFreq;
            var trainMins = trainFreq - remainder;

            var arrivalTime = moment().add(trainMins, "m").format("hh:mm A");
            console.log("calculated maths");

            var tableRow = $("<tr>").attr("data-key", cs);

            $("<td>").text(trainName).appendTo(tableRow);
            $("<td>").text(trainDest).appendTo(tableRow);
            $("<td>").text(trainFreq).appendTo(tableRow);
            $("<td>").text(arrivalTime).appendTo(tableRow);
            $("<td>").text(trainMins).appendTo(tableRow);
            $("#trains").append(tableRow);

            console.log("appended tds");
        },
        function(errorObject) {
            console.log("oh sh*t!" + errorObject.code);
        }
    );
})
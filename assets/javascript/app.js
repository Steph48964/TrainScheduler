
$(document).ready(function() {

    console.log("hello");

    var config = {
    
        apiKey: "AIzaSyA0esS1Bdbfq3v6jZ_QdIumOCeZpFdioqI",
        authDomain: "train-scheduler-8fe3b.firebaseapp.com",
        databaseURL: "https://train-scheduler-8fe3b.firebaseio.com",
        projectId: "train-scheduler-8fe3b",
        storageBucket: "",
        messagingSenderId: "106117211799"
  
    };
  
  	firebase.initializeApp(config);

    var database = firebase.database();
    var trainName = "";
    var destination = "";
    var firstTrainTime = ""; 
    var frequency = 0; 
  
	$("#add-trainSchedule").on("click", function(event) {

	   console.log("trains");

	   event.preventDefault();

	   trainName = $("#trainName-input-value").val().trim();
	   destination = $("#destination-input-value").val().trim();
	   firstTrainTime = moment($("#firstTrainTime-input-value").val().trim(), "HH:mm").format("X");
	   frequency = $("#frequency-input-value").val().trim();

        var newTrain = {

            name: trainName,
            destination: destination,
            firstTime: firstTrainTime, 
            frequency: frequency

        };

        console.log('new train', newTrain);
        console.log('new train first time display', moment.unix(newTrain.firstTime).format("HH:mm"))
   
        database.ref().push(newTrain);
        resetFormFields();
      
	});

	database.ref().on("child_added", function(snapshot) {
       
        var newTrain = {

            name: snapshot.val().name,
            destination: snapshot.val().destination,
            firstTime: snapshot.val().firstTime,
            frequency: snapshot.val().frequency,

        };

        addTrainToScheduleDisplay(newTrain);

	}, 

	function(errorObject) {
	
		console.log("Errors handled: " + errorObject.code);

	});

    function addTrainToScheduleDisplay (train) {

        var trainArrival = getNextArrival (train);
        
    $("#train-schedule > tbody").append("<tr><td>" 
        + train.name + "</td><td>" 
        + train.destination + "</td><td>" 
        + moment.unix(train.firstTime).format("HH:mm") + "</td><td>" 
        + train.frequency + "</td><td>" 
        + moment(trainArrival.nextArrival).format("HH:mm") + "</td><td>" 
        + trainArrival.minutesAway + "</td></tr>");

    }

    function getNextArrival (train) {

        var trainArrival = { nextArrival: '', minutesAway: 0 }; 
        var firstTimeConverted = moment(train.firstTime, "HH:mm").subtract(1, "years");
        var currentTime = moment();

        console.log('current:', currentTime.format("HH:mm"));

        var diffTime = moment().diff(moment(firstTimeConverted), "minutes");

        console.log(diffTime);

        var tRemainder = diffTime % train.frequency;
        trainArrival.minutesAway = train.frequency - tRemainder;
        trainArrival.nextArrival = moment().add(trainArrival.minutesAway, "minutes");

        console.log (train.name, 'next arrival', trainArrival);

        return trainArrival;
    
    }

    function resetFormFields () {

        $("#trainName-input-value").val("");
        $("#destination-input-value").val("");
        $("#firstTrainTime-input-value").val("");
        $("#frequency-input-value").val("");

    }

});



// Senior Design JTEN ROMET electrolarynx necklace code spring 2021
// Ernesto Olivas, Jimson Kurian, Thomas Magenalles, Nathan Bueno
// 
// Server with Google API Speech-to-Text and Text-to-Speech code
// 
// 


// local server declarations
var fs = require("file-system");
const http = require("http");
const server = http.createServer();
const fileName = "./resources/recording.wav";// declare mic recording file to load


// creating local server 
server.on("request", (request, response) => {
	if (request.method == "POST" && request.url === "/uploadAudio") { //audio encoding detected and post request met
		var recordingFile = fs.createWriteStream(fileName, { encoding: "utf8" });
		request.on("data", function(data) { // event handler for audio detection file
			recordingFile.write(data); //write audio context
		});

		request.on("end", async function() { 
			recordingFile.end();
			const transciption = await speechToTextAPI(); // this variable stores desired output calling on fuciton 
			response.writeHead(200, { "Content-Type": "text/plain" });
			response.end(transciption);  //
		});
	} else {
		console.log("Error Check your POST request"); // if POST data is not accepted
		response.writeHead(405, { "Content-Type": "text/plain" });
	}
});





// instead of creating two separate funcitons for speech-to-text and text-to-speech, we decided to
// create a function with both modules integrated to avoid any confusion for global and local variables
//with our output (the transcription variable) 


//GOOGLE API CONFIGURATION FOR SPEECH TO TEXT AND TEXT TO SPEECH
// speech-to-text function with text-to-speech integration 
async function speechToTextAPI() {

	// Imports the Google Cloud client library
	const speech = require("@google-cloud/speech");
	const fs = require("fs");

	// Creates a client
	const client = new speech.SpeechClient();

	// Reads a local audio file and converts it to base64
	const file = fs.readFileSync(fileName);
	const audioBytes = file.toString("base64");

	// The audio file's encoding, sample rate in hertz, and BCP-47 language code
	// file encoding
	const audio = {
		content: audioBytes
	};
	// sample rate in hertz
	const config = {
		encoding: "LINEAR16",
		sampleRateHertz: 16000,
		languageCode: "en-US"
	};
	// BCP-47 language code
	const request = {
		audio: audio,
		config: config
	};

	// Detects speech in the audio file
	const [response] = await client.recognize(request);
	const transcription = response.results.map((result) => result.alternatives[0].transcript).join("\n");
	console.log(`Transcription: ${transcription}`); // output to command line the speech to text transcription

	
	// save transcription file to txt file
	'use strict'
	const fss = require('fs');

	let fileContent = transcription;
	fss.writeFileSync('message.txt', fileContent);// trancription written to local computer 
	// transcription saved as message.txt 




//******************************************** 
// end of speech-to-text module





// begin text-to-speech module ****************************


// text to speech module  
	// Imports the Google Cloud client library
	const textToSpeech = require('@google-cloud/text-to-speech');

	// Import other required libraries
	const fsss = require('fs');
	const util = require('util');

	// Creates a client
	const client1 = new textToSpeech.TextToSpeechClient();


	async function quickStart() {
  	// The text to synthesize
	const text = fileContent;

  	// Construct the request
  	const request = {
    	input: {text: text},

    	// Select the language and SSML voice gender (optional)
    	voice: {languageCode: 'en-US', ssmlGender: 'NEUTRAL'},

    	// select the type of audio encoding
    	audioConfig: {audioEncoding: 'LINEAR16'}, // changed from mp3 extenison to wav (LINEAR16)
		//wav encoding is linear 16 (uncompressed 16-bit signed little-endian (Linear PCM) )
  	};

  	// Performs the text-to-speech request
  	const [response] = await client1.synthesizeSpeech(request);
	  
  	// Write the binary audio content to a local file
  	const writeFile = util.promisify(fsss.writeFile);
  	await writeFile('message.wav', response.audioContent, 'binary'); //creating message.wav file output 
  	console.log('Audio content written to file: message.wav'); // command line output saved to local computer as .wav file 
	}
	quickStart();
	
	//********************** 
	// end of text-to-speech module


	

	// return speech to text module at the end of the funciton
	// so server can call on function and have an output
	return transcription; 
}





// command line output
// declare port on computer
const port = 8888;
server.listen(port); // listen on that port
console.log(`Listening at ${port}`) // server output listening





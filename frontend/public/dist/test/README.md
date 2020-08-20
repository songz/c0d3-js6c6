hello! can you see?

hi

is there a way to make your monitor a little bigger?

thanks... so this site is accessible on student.a0d3.com/test

my vision.... you go to that site, and you immediately group audio chat with whomever is in the chat.

ok

so lets go over the audio chat piece...

index.html
-> #myTitle displays your socket id
thats it... everything else was used for testing...

-> socket.io.js library is provided by the socket.io
middleware.

any questions about the html so far?

none sof ar

-> song.js
when the page loads:
* recordAudio function is called.
  * gets the microphone, creates mediaRecorder to record
  * starts recording with mediaRecorder.start
    * Every 3000ms, and audio stream is created and the
      dataavailable event is fired with the audio data
    * This audio blob needs to be converted into 
      arrayBuffer using fileReader.
      Then once we have arrayBuffer,
      we emit to the socket
        * server takes the audio buffer and sends it
          to everyone else connected to the same socket
    * make sense so far?  so far so good
* listens to socket events

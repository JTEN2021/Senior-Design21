
#include "sound_data.h"
#include "XT_DAC_Audio.h"

//create an object of type XT_Wav_Class that is used by
// the dac audio class (below), passing wav data as parameter.
XT_Wav_Class Speaker(rawData);     


// Create the main player class object. 
// Use GPIO 25, one of the 2 DAC pins and timer 0                                      
XT_DAC_Audio_Class DacAudio(25,0);

void setup() {
  
  // speed is set to this speed also.
  Serial.begin(115200);
  
}


void loop() {
  
  // Fill the sound buffer with data
  DacAudio.FillBuffer(); 
  if(Speaker.Playing==false) // if not playing,
      DacAudio.Play(&Speaker); // play it, this will cause it to repeat and repeat...
  
}

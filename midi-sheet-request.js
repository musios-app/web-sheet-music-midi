
function initMidiSheetRequest(midiDeviceName, callback, errorCallback) {
    let _midiAccess = null;
    let _pdfDevice = null;

    let inMessage = false;
    let songName = null;

    function processEvent(message) {
        if (message.data[0] === 0xB0 && message.data[1] === 110 && message.data[2] === 0x7F) {
            inMessage = true;
            songName = "";
            console.log("Start new song name");
        }
        else if (message.data[0] === 0xB0 && message.data[1] === 110 && message.data[2] === 0x00) {
            inMessage = false;
            console.log("Song name: " + songName);
            selectSong(songName);
        }
        else if (message.data[0] === 0xB0 && message.data[1] === 111) {
            songName += String.fromCharCode(message.data[2]);
        }
    }


    function onMIDISuccess(midiAccess) {
        _midiAccess = midiAccess;

        console.log("onMIDISuccess")
        console.log(_midiAccess);

        _midiAccess.inputs.forEach(input => {
            if (input.name === midiDeviceName) {
                _pdfDevice = input;
                input.onmidimessage = (message) => {
                    processEvent(message);
                };
            }
        });
    }

    function onMIDIFailure() {
        alert('ERROR: could not access MIDI devices');
        console.error('ERROR: could not access MIDI devices');
    }

    if (navigator.requestMIDIAccess) {
        console.log("requesting MIDI access")
        navigator.requestMIDIAccess().then(onMIDISuccess, onMIDIFailure);
    } else {
        alert('MIDI is not supported by this browser.');
    }
}

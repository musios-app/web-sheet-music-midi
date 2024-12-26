---
layout: default
title: Sheet Music Viewer with MIDI Control
description: (WIP) Build a browser-based viewer for charts and sheet music that is controlled by MIDI
---

# Sheet Music Viewer with MIDI Control by musios.app

## Goals

The goal is a useful viewer for rehearsing and playing live.

0. Simplicity
1. Display sheet music in a web browser
2. Support a reasonable variety of file formats (starting with PDF and images)
3. Select sheet music with MIDI control
4. Support offline usage

Why a web app? Because it's so flexible.

## How to use standalone

1. Go to: https://www.musios.app/projects/web-sheet-music-midi
2. Drag and drop PDF and/or image files onto the drop panel (top right)
3. Select sheet music from the drop-down list (top center)

Notes:

* It's easier to use if your filenames are clear. e.g. "In Your Eyes - Peter Gabriel.pdf"
* The uploads are stored in your browser's local storage. You don't need to upload the files for each session.
* Current supported file formats are PDF, PNG, and JPEG.

## How to use with MIDI Control - Gig Performer / Mac

[1] set up the files as standalone.

[2] On MacOS, create a dedicated IAC device for the communication.

1. Open the Audio MIDI Setup app
2. Go to Window -> Show MIDI Studio
3. Double click on the IAC Driver icon to open the IAC Driver Properties
4. Check the "Device is online" checkbox.
5. Create a new port by clicking the "+" button
6. Rename the port to "PDFBrowser"
7. In Gig Performer, add the following code to the Gig script and compile it

Important: the names of the Songs in your setlist must match the start of filenames of the sheet files that you uploaded.  However the match doesn't care about upper/lowercase For example, a song names "In Your Eyes" will match any of:

* "In Your Eyes.pdf"
* "in your eyes.pdf"
* "in your eyes.png"
* "In Your Eyes - Peter Gabriel.pdf"
* "In Your Eyes - Peter Gabriel - live version with cellos.pdf"

```gpscript
var pdfDeviceName : String = "IAC Driver PDFBrowser"

Function HexCharToInteger(char : String) Returns Integer
    // There has to be a better way to do this!
    If    char == "0" Then result = 0
    Elsif char == "1" Then result = 1
    Elsif char == "2" Then result = 2
    Elsif char == "3" Then result = 3
    Elsif char == "4" Then result = 4
    Elsif char == "5" Then result = 5
    Elsif char == "6" Then result = 6
    Elsif char == "7" Then result = 7
    Elsif char == "8" Then result = 8
    Elsif char == "9" Then result = 9
    Elsif char == "A" || char == "a" Then result = 10
    Elsif char == "B" || char == "b" Then result = 11
    Elsif char == "C" || char == "c" Then result = 12
    Elsif char == "D" || char == "d" Then result = 13
    Elsif char == "E" || char == "e" Then result = 14
    Elsif char == "F" || char == "f" Then result = 15
    Else result = 16
    End
End


Function SendSongNameToPDFBrowser(deviceName : String, songNumber : Integer, songName : String)
    Var
        hexSongName : String = StringToHexString(songName)
        idx : Integer
        byte : Integer
        msg : ControlChangeMessage 
        concat : String = ""


    // Start message
    SendNowToMidiOutDevice(deviceName, MakeControlChangeMessage(110, 127))

    // Send song name one byte at a time
    For idx = 0; idx < Length(hexSongName); idx = idx + 2
    Do
        byte = HexCharToInteger(CopySubstring(hexSongName, idx, 1)) * 16 + 
            HexCharToInteger(CopySubstring(hexSongName, idx + 1, 1))
        concat = concat + IntToHexString(byte)

        SendNowToMidiOutDevice(deviceName, MakeControlChangeMessage(111, byte))
    End

    // End message
    SendNowToMidiOutDevice(deviceName, MakeControlChangeMessage(110, 0))
End


On Song(oldSongIndex : integer, newSongIndex : integer)
    Print("Song #" + newSongIndex + ": " + GetSongName(newSongIndex))
    SendSongNameToPDFBrowser(pdfDeviceName, newSongIndex, GetSongName(newSongIndex))
End
```


## Roadmap

* Work well on tablets and (maybe) phones
* Add file management capabilities
  * Delete files
  * Delete database
* Extra MIDI capabilities
  * Selectable MIDI device/channel
  * PC for file changes
  * Sysex for file changes
  * CC for scroll, zoom, pan, etc.
* Display controls (zoom, pan, etc.)
* Annotations
* Add support for more file formats
  * More image formats
  * ChordPro
  * Maybe MuseScore, MusicXML
  * Maybe MIDI file support
  * Maybe Word and Excel
* Downloadable offline app


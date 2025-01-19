---
layout: default
title: Sheet Music Viewer with MIDI Control
description: (WIP) Build a browser-based viewer for charts and sheet music that is controlled by MIDI
tags: utility gig-performer charts sheet-music
gitrepo: https://github.com/musios-app/web-sheet-music-midi
---

# Sheet Music Viewer with MIDI Control by musios.app

<div class="alert alert-warning" role="alert">
<b>Work In Progress</b>

This is an early version. I've been using it for rehearsals without issue but won't use it live quite yet.

I'll consider it "good enough" when the doc is better, it's been tested in more browsers, been tested on Windows and Mac. 

It could benefit from PC controls, song orders & numbers and other normal MIDI song change details.
</div>

## Purpose

The goal is a simple, useful viewer for rehearsing and playing live.

1. Display sheet music, charts, song lists and other content in a web browser
2. Support a reasonable variety of file formats.  PDF and images are first. After that consider Chord Pro.
3. Select sheet music with MIDI controls
4. Support offline usage

Why a web app? Because it's so flexible (and easy to develop).


## How to use standalone

<div class="alert alert-warning" role="alert">
<b>Oops - not working at the moment</b>
I'm migrating content to the site <a href="https://musios.app">musios.app</a> and haven't set up the operational version yet.
</div>

<div style="display: none">
1. Go to: https://www.musios.app/projects/web-sheet-music-midi
2. Drag and drop PDF and/or image files onto the drop panel (top right)
3. Select sheet music from the drop-down list (top center)
</s>

Notes:

* It's easier to use if your filenames are clear. e.g. "In Your Eyes - Peter Gabriel.pdf"
* The uploads are stored in your browser's local storage. You don't need to upload the files for each session.
* Current supported file formats are PDF, PNG, and JPEG.
</div>


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

```
var pdfDeviceName : String = "IAC Driver PDFBrowser"


Function HexCharToInteger(char : String) Returns Integer
  Const HexString : String = "0123456789ABCDEF"
  result = IndexOfSubstring(HexString, char, False)
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


## Security and running on localhost

This application uses MIDI to receive commands to change sheets.
There are security requirements for all browser MIDI access to be via HTTPS.
This means that the app cannot be run (a) as a file:// URL or (b) on a localhost web server without HTTPS.

To run on localhost, you can use a tool like [http-server](https://github.com/http-party/http-server#readme) which will serve the files over HTTPS.

A localhost version also has the advantage that no internet access is needed during a rehearsal or performance.


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


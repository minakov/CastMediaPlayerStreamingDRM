# CastMediaPlayerStreamingDRM
===============================

This Google Cast sample app demonstrates how to play streaming media on Chromecast.  It uses Cast Receiver SDK and Media Player Library.  It highlights the following features.

* Streaming: MPEG-DASH, Smooth Streaming, and HLS
* Enable live streaming
* Captions: external and in-stream
* Adaptive Bitrate Streaming
* DRM license server URL
* CORS and cross domain policy
 
It uses a Chrome sender but can work with Android or iOS senders as well.  It also provides debugging features with live code snippets to illustrate interactions between sender and receiver.  

## Setup Instructions

# Pre-requisites
1. Get a Chromecast device
2. Install the latest Chrome browser
3. Install the latest Chrome Cast extension

 See the developer guide and release notes at https://developers.google.com/cast/ for more details.
 
# Steps to setup:
1. Put all files on your own server
2. Change YOUR_APP_ID in sender.js to your own application ID
3. Point your receiver app URL in Developer Console to http://[YOUR_SERVER_LOCATION]/CastMediaPlayerStreamingDRM/mpl.html
4. Open a browser and point to your page at http://[YOUR_SERVER_LOCATION]/CastMediaPlayerStreamingDRM/index.html

# Instructions:
* Launch app and load/play media streams
* Show/hide receiver debug message on TV
* Show/hide video element on TV
* Watch the following in debug message on receiver side:
  * App State, Sender Count, Media Element State and Volume State
  * Cast Receiver Manager Message
  * Media Manager Message
  * Message Bus Message
  * Media Player: Host, Protocol, Player
  * Streams: bitrates, codecs, captions
* Experiment on sender side:
  * Enable live streaming
  * Set max bandwidth
  * Set custom license server URL
  * Enable/Disable captions
  * Inspect code snippets live

##Documentation
* Cast Chrome Sender APIs: http://developers.google.com/cast/docs/chrome_sender
* Cast Receiver APIs: https://developers.google.com/cast/docs/reference/receiver/
* Cast Receiver Media Player Library: https://developers.google.com/cast/docs/reference/player/

## References and How to report bugs
* Design Checklist (http://developers.google.com/cast/docs/design_checklist)
* If you find any issues, please open a bug here on GitHub

How to make contributions?
Please read and follow the steps in the CONTRIBUTING.md

License
See LICENSE.md

## Google+
 Google Cast Developers Community on Google+ [http://goo.gl/TPLDxj](http://goo.gl/TPLDxj)

// Copyright 2014 Google Inc. All Rights Reserved.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
// http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

var senders = {};
var liveStreaming = false;
var maxBW = null;
var videoStreamIndex = null;
var licenseUrl = null;

var castReceiverManager = null;
var mediaManager = null;
var messageBus = null;
var mediaElement = null;
var mediaHost = null;
var mediaProtocol = null;
var mediaPlayer = null;

onload = function() {
  mediaElement = document.getElementById('receiverVideoElement');
  mediaElement.autoplay = true;

  /**
  play – The process of play has started
  waiting – When the video stops due to buffering
  volumechange – volume has changed
  stalled – trying to get data, but not available
  ratechange – some speed changed
  canplay – It is possible to start playback, but no guarantee of not buffering
  canplaythrough – It seems likely that we can play w/o buffering issues
  ended – the video has finished
  error – error occured during loading of the video
  playing – when the video has started playing
  seeking – started seeking
  seeked – seeking has completed
  **/

  mediaElement.addEventListener('loadstart', function(e){
    console.log("######### MEDIA ELEMENT LOAD START");
    setDebugMessage('mediaElementState','Load Start');
  });
  mediaElement.addEventListener('loadeddata', function(e){
    console.log("######### MEDIA ELEMENT DATA LOADED");
    setDebugMessage('mediaElementState','Data Loaded');
    var streamCount = protocol.getStreamCount();
    var streamInfo;
    var streamVideoCodecs;
    var streamVideoBitrates;
    var streamAudioCodecs;
    var streamAudioBitrates;
    var captions = {};
    for (var c = 0; c < streamCount; c++) {
      streamInfo = protocol.getStreamInfo(c);
      if( streamInfo.mimeType === 'text' ) {
        captions[c] = streamInfo.language;
      } else if( streamInfo.mimeType === 'video/mp4' || streamInfo.mimeType === 'video/mp2t' ) {
        streamVideoCodecs = streamInfo.codecs;
        streamVideoBitrates = JSON.stringify(streamInfo.bitrates);
        if( maxBW ) {
          var qLevel = protocol.getQualityLevel(c, maxBW);
        }
        else {
          var qLevel = protocol.getQualityLevel(c);
        }
        setDebugMessage('streamVideoQuality', streamInfo.bitrates[qLevel]);
        videoStreamIndex = c;
        setDebugMessage('videoStreamIndex', videoStreamIndex);
      } else if( streamInfo.mimeType === 'audio/mp4' ) {
        streamAudioCodecs = streamInfo.codecs;
        streamAudioBitrates = JSON.stringify(streamInfo.bitrates);
      }
      else {
      }
    }
    setDebugMessage('streamCount', streamCount);
    setDebugMessage('streamVideoCodecs', streamVideoCodecs);
    setDebugMessage('streamVideoBitrates', streamVideoBitrates);
    setDebugMessage('streamAudioCodecs', streamAudioCodecs);
    setDebugMessage('streamAudioBitrates', streamAudioBitrates);
    setDebugMessage('captions', JSON.stringify(captions));
    console.log(JSON.stringify(captions));
    var caption_message = {};
    if( Object.keys(captions).length > 0 ) {
      caption_message['captions'] = captions;
    }
    //messageSender(senders[0], JSON.stringify(caption_message));
    broadcast(JSON.stringify(caption_message));
    getPlayerState();

  });
  mediaElement.addEventListener('canplay', function(e){
    console.log("######### MEDIA ELEMENT CAN PLAY");
    setDebugMessage('mediaElementState','Can Play');
    getPlayerState();
  });
  mediaElement.addEventListener('ended', function(e){
    console.log("######### MEDIA ELEMENT ENDED");
    setDebugMessage('mediaElementState','Ended');
    getPlayerState();
  });
  mediaElement.addEventListener('playing', function(e){
    console.log("######### MEDIA ELEMENT PLAYING");
    setDebugMessage('mediaElementState','Playing');
  });
  mediaElement.addEventListener('waiting', function(e){
    console.log("######### MEDIA ELEMENT WAITING");
    setDebugMessage('mediaElementState','Waiting');
    getPlayerState();
  });
  mediaElement.addEventListener('stalled', function(e){
    console.log("######### MEDIA ELEMENT STALLED");
    setDebugMessage('mediaElementState','Stalled');
    getPlayerState();
  });
  mediaElement.addEventListener('error', function(e){
    console.log("######### MEDIA ELEMENT ERROR " + e);
    setDebugMessage('mediaElementState','Error');
    getPlayerState();
  });
  mediaElement.addEventListener('abort', function(e){
    console.log("######### MEDIA ELEMENT ABORT " + e);
    setDebugMessage('mediaElementState','Abort');
    getPlayerState();
  });
  mediaElement.addEventListener('susppend', function(e){
    console.log("######### MEDIA ELEMENT SUSPEND " + e);
    setDebugMessage('mediaElementState','Suspended');
    getPlayerState();
  });
  mediaElement.addEventListener('progress', function(e){
    setDebugMessage('mediaElementState','Progress');
    getPlayerState();
  });

  mediaElement.addEventListener('seeking', function(e){
    console.log("######### MEDIA ELEMENT SEEKING " + e);
    setDebugMessage('mediaElementState','Seeking');
    getPlayerState();
  });
  mediaElement.addEventListener('seeked', function(e){
    console.log("######### MEDIA ELEMENT SEEKED " + e);
    setDebugMessage('mediaElementState','Seeked');
    getPlayerState();
  });

  /**
  * Sets the log verbosity level.
  *
  * Debug logging (all messages).
  * DEBUG
  *
  * Verbose logging (sender messages).
  * VERBOSE
  *
  * Info logging (events, general logs).
  * INFO
  *
  * Error logging (errors).
  * ERROR
  *
  * No logging.
  * NONE
  **/
  cast.receiver.logger.setLevelValue(cast.receiver.LoggerLevel.DEBUG);
  cast.player.api.setLoggerLevel(cast.player.api.LoggerLevel.DEBUG);

  castReceiverManager = cast.receiver.CastReceiverManager.getInstance();

  /**
  * Called to process 'ready' event. Only called after calling castReceiverManager.start(config) and the
  * system becomes ready to start receiving messages.
  *
  * @param {cast.receiver.CastReceiverManager.Event} event - can be null
  *
  * There is no default handler
  */
  castReceiverManager.onReady = function(event) {
    console.log("### Cast Receiver Manager is READY: " + JSON.stringify(event));
    setDebugMessage('castReceiverManagerMessage', 'READY: ' + JSON.stringify(event));
    setDebugMessage('applicationState','Loaded. Started. Ready.');
  }

  /**
  * If provided, it processes the 'senderconnected' event.
  * Called to process the 'senderconnected' event.
  * @param {cast.receiver.CastReceiverManager.Event} event - can be null
  *
  * There is no default handler
  */
  castReceiverManager.onSenderConnected = function(event) {
    console.log("### Cast Receiver Manager - Sender Connected : " + JSON.stringify(event));
    setDebugMessage('castReceiverManagerMessage', 'Sender Connected: ' + JSON.stringify(event));

    senders = castReceiverManager.getSenders();
    setDebugMessage('senderCount', '' + senders.length);
  }

  /**
  * If provided, it processes the 'senderdisconnected' event.
  * Called to process the 'senderdisconnected' event.
  * @param {cast.receiver.CastReceiverManager.Event} event - can be null
  *
  * There is no default handler
  */
  castReceiverManager.onSenderDisconnected = function(event) {
    console.log("### Cast Receiver Manager - Sender Disconnected : " + JSON.stringify(event));
    setDebugMessage('castReceiverManagerMessage', 'Sender Disconnected: ' + JSON.stringify(event));

    senders = castReceiverManager.getSenders();
    setDebugMessage('senderCount', '' + senders.length);
  }

  /**
  * If provided, it processes the 'systemvolumechanged' event.
  * Called to process the 'systemvolumechanged' event.
  * @param {cast.receiver.CastReceiverManager.Event} event - can be null
  *
  * There is no default handler
  */
  castReceiverManager.onSystemVolumeChanged = function(event) {
    console.log("### Cast Receiver Manager - System Volume Changed : " + JSON.stringify(event));
    setDebugMessage('castReceiverManagerMessage', 'System Volume Changed: ' + JSON.stringify(event));

    // See cast.receiver.media.Volume
    console.log("### Volume: " + event.data['level'] + " is muted? " + event.data['muted']);
    setDebugMessage('volumeMessage', 'Level: ' + event.data['level'] + ' -- muted? ' + event.data['muted']);
  }

  /**
  * Use the messageBus to listen for incoming messages on a virtual channel using a namespace string.
  * Also use messageBus to send messages back to a sender or broadcast a message to all senders.
  * You can check the cast.receiver.CastMessageBus.MessageType that a message bus processes though a call
  * to getMessageType. As well, you get the namespace of a message bus by calling getNamespace()
  */
  messageBus = castReceiverManager.getCastMessageBus('urn:x-cast:com.google.cast.sample.mediaplayer');
  /**
  * The namespace urn:x-cast:com.google.cast.sample.mediaplayer is used to identify the protocol of showing/hiding
  * the heads up display messages (The messages defined at the beginning of the html).
  *
  * The protocol consists of one string message: show
  * In the case of the message value not being show - the assumed value is hide.
  **/
  messageBus.onMessage = function(event) {
    console.log("### Message Bus - Media Message: " + JSON.stringify(event));
    setDebugMessage('messageBusMessage', event);

    console.log("### CUSTOM MESSAGE: " + JSON.stringify(event));
    // show/hide messages
    console.log(event['data']);
    var payload = JSON.parse(event['data']);
    if(payload['type']==='show') {
      if(payload['target']==='debug') {
        document.getElementById('messages').style.display = 'block';
      } else {
        document.getElementById('receiverVideoElement').style.display = 'block';
      }
    } else if(payload['type']==='hide') {
      if(payload['target']==='debug') {
        document.getElementById('messages').style.display = 'none';
      } else {
        document.getElementById('receiverVideoElement').style.display = 'none';
      }
    } else if(payload['type']==='ENABLE_CC') {
      var trackNumber = payload['trackNumber'];
      setCaption(trackNumber);
    } else if(payload['type']==='WebVTT') {
      mediaPlayer.enableCaptions(false);
      mediaPlayer.enableCaptions(true,'webvtt','captions.vtt');
    } else if(payload['type']==='TTML') {
      mediaPlayer.enableCaptions(false);
      mediaPlayer.enableCaptions(true,'ttml','captions.ttml');
    } else if(payload['type']==='live') {
      if(payload['value']===true) {
        liveStreaming = true;
      } else {
        liveStreaming = false;
      }
    } else if(payload['type']==='maxBW') {
        maxBW = payload['value'];
    } else if(payload['type']==='license') {
        licenseUrl = payload['value'];
    } else {
        licenseUrl = null;
    }
    broadcast(event['data']);
  }


  mediaManager = new cast.receiver.MediaManager(mediaElement);

  /**
  * Called when the media ends.
  *
  * mediaManager.resetMediaElement(cast.receiver.media.IdleReason.FINISHED);
  **/
  mediaManager['onEndedOrig'] = mediaManager.onEnded;
  /**
  * Called when the media ends
  */
  mediaManager.onEnded = function() {
    console.log("### Media Manager - ENDED: " + JSON.stringify(event));
    setDebugMessage('mediaManagerMessage', 'ENDED');

    mediaManager['onEndedOrig']();
  }

  /**
  * Default implementation of onError.
  *
  * mediaManager.resetMediaElement(cast.receiver.media.IdleReason.ERROR)
  **/
  mediaManager['onErrorOrig'] = mediaManager.onError;
  /**
  * Called when there is an error not triggered by a LOAD request
  * @param obj
  */
  mediaManager.onError = function(obj) {
    console.log("### Media Manager - error: " + JSON.stringify(obj));
    setDebugMessage('mediaManagerMessage', 'ERROR - ' + JSON.stringify(obj));

    mediaManager['onErrorOrig'](obj);
    if(mediaPlayer) {
      mediaPlayer.unload();
      mediaPlayer = null;
    }
  }

  /**
  * Processes the get status event.
  *
  * Sends a media status message to the requesting sender (event.data.requestId)
  **/
  mediaManager['onGetStatusOrig'] = mediaManager.onGetStatus;
  /**
  * Processes the get status event.
  * @param event
  */
  mediaManager.onGetStatus = function(event) {
    console.log("### Media Manager - GET STATUS: " + JSON.stringify(event));
    setDebugMessage('mediaManagerMessage', 'GET STATUS ' + JSON.stringify(event));

    mediaManager['onGetStatusOrig'](event);
  }

  /**
  * Default implementation of onLoadMetadataError.
  *
  * mediaManager.resetMediaElement(cast.receiver.media.IdleReason.ERROR, false);
  * mediaManager.sendLoadError(cast.receiver.media.ErrorType.LOAD_FAILED);
  **/
  mediaManager['onLoadMetadataErrorOrig'] = mediaManager.onLoadMetadataError;
  /**
  * Called when load has had an error, overridden to handle application specific logic.
  * @param event
  */
  mediaManager.onLoadMetadataError = function(event) {
    console.log("### Media Manager - LOAD METADATA ERROR: " + JSON.stringify(event));
    setDebugMessage('mediaManagerMessage', 'LOAD METADATA ERROR: ' + JSON.stringify(event));

    mediaManager['onLoadMetadataErrorOrig'](event);
  }

  /**
  * Default implementation of onMetadataLoaded
  *
  * Passed a cast.receiver.MediaManager.LoadInfo event object
  * Sets the mediaElement.currentTime = loadInfo.message.currentTime
  * Sends the new status after a LOAD message has been completed succesfully.
  * Note: Applications do not normally need to call this API.
  * When the application overrides onLoad, it may need to manually declare that
  * the LOAD request was sucessful. The default implementaion will send the new
  * status to the sender when the video/audio element raises the
  * 'loadedmetadata' event.
  * The default behavior may not be acceptable in a couple scenarios:
  *
  * 1) When the application does not want to declare LOAD succesful until for
  *    example 'canPlay' is raised (instead of 'loadedmetadata').
  * 2) When the application is not actually loading the media element (for
  *    example if LOAD is used to load an image).
  **/
  mediaManager['onLoadMetadataOrig'] = mediaManager.onLoadMetadataLoaded;
  /**
  * Called when load has completed, overridden to handle application specific logic.
  * @param event
  */
  mediaManager.onLoadMetadataLoaded = function(event) {
    console.log("### Media Manager - LOADED METADATA: " + JSON.stringify(event));
    setDebugMessage('mediaManagerMessage', 'LOADED METADATA: ' + JSON.stringify(event));
    mediaManager['onLoadMetadataOrig'](event);
  }

  /**
  * Processes the pause event.
  *
  * mediaElement.pause();
  * Broadcast (without sending media information) to all senders that pause has happened.
  **/
  mediaManager['onPauseOrig'] = mediaManager.onPause;
  /**
  * Process pause event
  * @param event
  */
  mediaManager.onPause = function(event) {
    console.log("### Media Manager - PAUSE: " + JSON.stringify(event));
    setDebugMessage('mediaManagerMessage', 'PAUSE: ' + JSON.stringify(event));
    mediaManager['onPauseOrig'](event);
  }

  /**
  * Default - Processes the play event.
  *
  * mediaElement.play();
  *
  **/
  mediaManager['onPlayOrig'] = mediaManager.onPlay;
  /**
  * Process play event
  * @param event
  */
  mediaManager.onPlay = function(event) {
    console.log("### Media Manager - PLAY: " + JSON.stringify(event));
    setDebugMessage('mediaManagerMessage', 'PLAY: ' + JSON.stringify(event));

    mediaManager['onPlayOrig'](event);
  }

  /**
  * Default implementation of the seek event.
  * Sets the mediaElement.currentTime to event.data.currentTime.
  * If the event.data.resumeState is cast.receiver.media.SeekResumeState.PLAYBACK_START and the mediaElement is paused then
  * call mediaElement.play(). Otherwise if event.data.resumeState is cast.receiver.media.SeekResumeState.PLAYBACK_PAUSE and
  * the mediaElement is not paused, call mediaElement.pause().
  * Broadcast (without sending media information) to all senders that seek has happened.
  **/
  mediaManager['onSeekOrig'] = mediaManager.onSeek;
  /**
  * Process seek event
  * @param event
  */
  mediaManager.onSeek = function(event) {
    console.log("### Media Manager - SEEK: " + JSON.stringify(event));
    setDebugMessage('mediaManagerMessage', 'SEEK: ' + JSON.stringify(event));

    mediaManager['onSeekOrig'](event);
  }

  /**
  * Default implementation of the set volume event.
  * Checks event.data.volume.level is defined and sets the mediaElement.volume to the value
  * Checks event.data.volume.muted is defined and sets the mediaElement.muted to the value
  * Broadcasts (without sending media information) to all senders that the volume has changed.
  **/
  mediaManager['onSetVolumeOrig'] = mediaManager.onSetVolume;
  /**
  * Process set volume event
  * @param event
  */
  mediaManager.onSetVolume = function(event) {
    console.log("### Media Manager - SET VOLUME: " + JSON.stringify(event));
    setDebugMessage('mediaManagerMessage', 'SET VOLUME: ' + JSON.stringify(event));

    mediaManager['onSetVolumeOrig'](event);
  }

  /**
  * Processes the stop event.
  *
  * mediaManager.resetMediaElement(cast.receiver.media.IdleReason.CANCELLED, true, event.data.requestId);
  *
  * Resets Media Element to IDLE state. After this call the mediaElement
  * properties will change, paused will be true, currentTime will be zero and
  * the src attribute will be empty. This only needs to be manually called if the
  * developer wants to override the default behavior of onError, onStop or
  * onEnded, for example.
  **/
  mediaManager['onStopOrig'] = mediaManager.onStop;
  /**
  * Process stop event
  * @param event
  */
  mediaManager.onStop = function(event) {
    console.log("### Media Manager - STOP: " + JSON.stringify(event));
    setDebugMessage('mediaManagerMessage', 'STOP: ' + JSON.stringify(event));

    mediaManager['onStopOrig'](event);
  }

  /**
  * Default implementation for the load event.
  *
  * Sets the mediaElement.autoplay to false.
  * Checks that data.media and data.media.contentId are valid then sets the mediaElement.src to the
  * data.media.contentId.
  *
  * Checks the data.autoplay value:
  *   - if undefined sets mediaElement.autoplay = true
  *   - if has value then sets mediaElement.autoplay to that value
  **/
  mediaManager['onLoadOrig'] = mediaManager.onLoad;
  /**
  * Processes the load event.
  * @param event
  */
  mediaManager.onLoad = function(event) {
    console.log("### Media Manager - LOAD: " + JSON.stringify(event));
    setDebugMessage('mediaManagerMessage', 'LOAD ' + JSON.stringify(event));

    if(mediaPlayer !== null) {
      mediaPlayer.unload(); // Ensure unload before loading again
    }

    if (event.data['media'] && event.data['media']['contentId']) {
      var url = event.data['media']['contentId'];

      setDebugMessage('mediaPlayerState', '-');

      mediaHost = new cast.player.api.Host({
        'mediaElement': mediaElement,
        'url': url
      });
     
      if( licenseUrl ) {
        mediaHost['updateLicenseRequestInfoOrig'] = mediaHost.updateLicenseRequestInfo;
        mediaHost.updateLicenseRequestInfo = function(requestInfo) {
          mediaHost.licenseUrl = licenseUrl;
          mediaHost['updateLicenseRequestInfoOrig'](requestInfo); // Call on the original
        }
      }

      mediaHost.onError = function (errorCode, requestStatus) {
        console.error('### HOST ERROR - Fatal Error: code = ' + errorCode);
        setDebugMessage('mediaHostState', 'Fatal Error: code = ' + errorCode);
        if (mediaPlayer !== null) {
          mediaPlayer.unload();
        }
      }

      var initialTimeIndexSeconds = event.data['media']['currentTime'] || 0;
      protocol = null;
      var ext = null;
      if (url.lastIndexOf('.m3u8') >= 0) {
        protocol =  cast.player.api.CreateHlsStreamingProtocol(mediaHost);
        ext = 'HLS';
      } else if (url.lastIndexOf('.mpd') >= 0) {
        protocol = cast.player.api.CreateDashStreamingProtocol(mediaHost);
        ext = 'MPEG-DASH';
      } else if (url.lastIndexOf('.ism/') >= 0) {
        protocol = cast.player.api.CreateSmoothStreamingProtocol(mediaHost);
        ext = 'Smooth Streaming';
      }
      console.log('### Media Protocol Identified as ' + ext);
      setDebugMessage('mediaProtocol', ext);

      // Advanced Playback - HLS, MPEG DASH, SMOOTH STREAMING
      // Player registers to listen to the media element events through the mediaHost property of the
      // mediaElement
      mediaPlayer = new cast.player.api.Player(mediaHost);
      if( liveStreaming ) {
        mediaPlayer.load(protocol, Infinity);
      }
      else {
        mediaPlayer.load(protocol, initialTimeIndexSeconds);
      }
      setDebugMessage('mediaHostState', 'success');
    }
  }

  console.log('### Application Loaded. Starting system.');
  setDebugMessage('applicationState','Loaded. Starting up.');

  /**
  * Application config
  **/
  var appConfig = new cast.receiver.CastReceiverManager.Config();

  /**
  * Text that represents the application status. It should meet
  * internationalization rules as may be displayed by the sender application.
  * @type {string|undefined}
  **/
  appConfig.statusText = 'Ready to play';

  /**
  * Maximum time in seconds before closing an idle
  * sender connection. Setting this value enables a heartbeat message to keep
  * the connection alive. Used to detect unresponsive senders faster than
  * typical TCP timeouts. The minimum value is 5 seconds, there is no upper
  * bound enforced but practically it's minutes before platform TCP timeouts
  * come into play. Default value is 10 seconds.
  * @type {number|undefined}
  **/
  appConfig.maxInactivity = 6000; // 10 minutes for testing, use default 10sec in prod by not setting this value

  /**
  * Initializes the system manager. The application should call this method when
  * it is ready to start receiving messages, typically after registering
  * to listen for the events it is interested on.
  */
  castReceiverManager.start(appConfig);
}

function setCaption(trackNumber) {
  var current, next;
  var streamCount = protocol.getStreamCount();
  var streamInfo;
  for (current = 0; current < streamCount; current++) {
    if (protocol.isStreamEnabled(current)) {
      streamInfo = protocol.getStreamInfo(current);
      if (streamInfo.mimeType.indexOf('text') === 0) {
        protocol.enableStream(current, false);
        mediaPlayer.enableCaptions(false);
        break;
      }
    }
  }
  if( trackNumber ) {
    protocol.enableStream(trackNumber, true);
    mediaPlayer.enableCaptions(true);
  }
}

function nextCaption() {
  var current, next;
  var streamCount = protocol.getStreamCount();
  var streamInfo;
  for (current = 0; current < streamCount; current++) {
    if (protocol.isStreamEnabled(current)) {
      streamInfo = protocol.getStreamInfo(current);
      if (streamInfo.mimeType.indexOf('text') === 0) {
        break;
      }
    }
  }

  if (current === streamCount) {
    next = 0;
  } else {
    next = current + 1;
  }

  while (next !== current) {
    if (next === streamCount) {
      next = 0;
    }

    streamInfo = protocol.getStreamInfo(next);
    if (streamInfo.mimeType.indexOf('text') === 0) {
      break;
    }

    next++;
  }

  if (next !== current) {
    if (current !== streamCount) {
      protocol.enableStream(current, false);
      mediaPlayer.enableCaptions(false);
    }

    if (next !== streamCount) {
      protocol.enableStream(next, true);
      mediaPlayer.enableCaptions(true);
    }
  }
}

function messageSender(senderId, message) {
  messageBus.send(senderId, message);
}

function broadcast(message) {
  messageBus.broadcast(message);
}

function setDebugMessage(elementId, message) {
  document.getElementById(elementId).innerHTML = '' + JSON.stringify(message);
}

function getPlayerState() {
  var playerState = mediaPlayer.getState();
  setDebugMessage('mediaPlayerState', 'underflow: ' + playerState['underflow']);
}

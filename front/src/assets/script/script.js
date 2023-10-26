import { BinaryClient } from './binary.js';

function initApp() {
    var worker = new Worker('./worker/resampler-worker.js'),
        bStream,
        sampleRate = (new AudioContext()).sampleRate;
    var
        resampleRate = sampleRate,
        client,
        context,
        recorder;

    worker.postMessage({cmd:"init",from:sampleRate,to:sampleRate});

    worker.addEventListener('message', function (e) {
      if (bStream && bStream.writable)
          bStream.write(convertFloat32ToInt16(e.data.buffer));
  }, false);

  window.startRec = () => {
    close();
    client = new BinaryClient('wss://'+'localhost:9192');

    client.on('open', function () {
      bStream = client.createStream({sampleRate: resampleRate});
    });

    if (context) {
      recorder.connect(context.destination);
      return;
    }

    var session = {
        audio: true,
        video: false
    };


    navigator.getUserMedia(session, function (stream) {
          context = new AudioContext();
          var audioInput = context.createMediaStreamSource(stream);
          var bufferSize = 0; // let implementation decide

          recorder = context.createScriptProcessor(bufferSize, 1, 1);

          recorder.onaudioprocess = onAudio;

          audioInput.connect(recorder);

          recorder.connect(context.destination);

      }, function (e) {

    });

  }

  function onAudio(e) {
    var left = e.inputBuffer.getChannelData(0);

    worker.postMessage({cmd: "resample", buffer: left});

    // drawBuffer(left);
  }

  function convertFloat32ToInt16(buffer) {
      var l = buffer.length;
      var buf = new Int16Array(l);
      while (l--) {
          buf[l] = Math.min(1, buffer[l]) * 0x7FFF;
      }
      return buf.buffer;
  }

  window.stopRec = () => {
    close();
  }
  
  function close(){
    if(recorder)
        recorder.disconnect();
    if(client)
        client.close();
  }
}

document.addEventListener("readystatechange", (event) => {
    if (event.target.readyState === "interactive") {
      initLoader();
    } else if (event.target.readyState === "complete") {
      initApp();
    }
});

navigator.getUserMedia = navigator.getUserMedia ||
    navigator.webkitGetUserMedia ||
    navigator.mozGetUserMedia ||
    navigator.msGetUserMedia;

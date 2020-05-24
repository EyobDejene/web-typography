var player;

function onYouTubeIframeAPIReady() {
	player = new YT.Player('video-placeholder', {
		width: 600,
		height: 400,
		videoId: 'vrP-_T-h9YM',
		playerVars: {
			color: 'white',
			//start: 
			//autoplay: '1'
			//playlist: 'taJ60kskkns,FG0fTKAqZ5g'
		},
		events: {
			onReady: initialize
		}
	});
}

function initialize(){
	// Update the controls on load
	addSpans();
}
function addSpans(){
	var ps = document.querySelectorAll('#closed-captions p');
	var i = 0;
	var regex = /\S+/g;
	while ( i < ps.length ) {
		var str = ps[i].innerText;
		var result = str.replace(regex, function(a) {
			return "<span>" + a + "</span>";
		});
		ps[i].innerHTML = result;
		ps[i].classList.add('p' + i);
		i++;
	}
	updateTimerDisplay();
}

function updateTimerDisplay(){
	var t = player.getCurrentTime();
	t = Math.floor10(t,-1);
	// for each paragraph we want to know:
	// (paragraph number, start time, end time, current time)

	//Officer K D 6 - 3 . 7. Let’s begin. Ready?
	var i = 0;
	while( i < captions.length) {
		pTimes(i,captions[i][0],captions[i][1],t);
		i++;
	}
	var i = 0;
	while( i < sounds.length) {
		sTimes(i,sounds[i],t);
		i++;
	}
// Change 136.1 to the length of your own video in seconds
	if ( t < 136.1) {
		setTimeout(() => {
			updateTimerDisplay();
		}, 100);
	}
  onPlayerStateChange();
}
function pTimes(num,startT,endT,curT) {
	var curP = document.querySelector('.p' + num);
	if(curT > endT && !curP.classList.contains('off')) {
		curP.classList.add('off');
	}
	if(curT < endT && curP.classList.contains('off')) {
		curP.classList.remove('off');
	}
	if( curT > startT && !curP.classList.contains('on')) {
		curP.classList.add('on');
	}
	if( curT < startT && curP.classList.contains('on')) {
		curP.classList.remove('on');
	}
}

function sTimes(num,soundStarts,curT) {
	var soundClass = 'sound' + num;
	var b = document.querySelector('body');
	if( curT > soundStarts && !b.classList.contains(soundClass)) {
		b.classList.add(soundClass);
	}
	if( curT < soundStarts && b.classList.contains(soundClass)) {
		b.classList.remove(soundClass);
	}
}

(function() {
	/**
	 * Decimal adjustment of a number.
	 *
	 * @param {String}  type  The type of adjustment.
	 * @param {Number}  value The number.
	 * @param {Integer} exp   The exponent (the 10 logarithm of the adjustment base).
	 * @returns {Number} The adjusted value.
	 */
	function decimalAdjust(type, value, exp) {
	// If the exp is undefined or zero...
		if (typeof exp === 'undefined' || +exp === 0) {
			return Math[type](value);
		}
		value = +value;
		exp = +exp;
		// If the value is not a number or the exp is not an integer...
		if (isNaN(value) || !(typeof exp === 'number' && exp % 1 === 0)) {
			return NaN;
		}
		// Shift
		value = value.toString().split('e');
		value = Math[type](+(value[0] + 'e' + (value[1] ? (+value[1] - exp) : -exp)));
		// Shift back
		value = value.toString().split('e');
		return +(value[0] + 'e' + (value[1] ? (+value[1] + exp) : exp));
	}

	// Decimal round
	if (!Math.round10) {
		Math.round10 = function(value, exp) {
			return decimalAdjust('round', value, exp);
		};
	}
	// Decimal floor
	if (!Math.floor10) {
		Math.floor10 = function(value, exp) {
			return decimalAdjust('floor', value, exp);
		};
	}
	// Decimal ceil
	if (!Math.ceil10) {
		Math.ceil10 = function(value, exp) {
			return decimalAdjust('ceil', value, exp);
		};
	}
})();


let bigPlayer = document.querySelector('#video-placeholder');
let backgroundPlayer = document.querySelector('.bg-video');
//
// bigPlayer.addEventListener()
//   player.playVideo();
// });


function onPlayerStateChange(event) {
  // console.log('video started');
  let state = player.getPlayerState();
  // console.log(state);
  var t = player.getCurrentTime();
  t = t.toString();
  t = t.split(".");
  // console.log(t);
  // console.log("playtime"+ t);
  if(state == 3){
    backgroundPlayer.src += "&autoplay=1";
    // backgroundPlayer.src += "https://www.youtube.com/embed/vrP-_T-h9YM?controls=0&amp;start="+t[0]+"&enablejsapi=1&autoplay=1&mute=1";

    // var playAllYouTubeVideos = () => {
    //   var iframes = document.querySelectorAll('iframe');
    //   Array.prototype.forEach.call(iframes, iframe => {
    //     iframe.contentWindow.postMessage(JSON.stringify({ event: 'command',
    //       func: 'playVideo' }), '*');
    //   });
    // }
    // playAllYouTubeVideos();

	}
	if(state == 2){
      // console.log("playtime" + t);
      // console.log('paused');
      var stopAllYouTubeVideos = () => {
        var iframes = document.querySelectorAll('iframe');
        let command = {
          "event": "command",
          "func": "pauseVideo"
        };
        Array.prototype.forEach.call(iframes, iframe => {
          iframe.contentWindow.postMessage(JSON.stringify(command), "*");
          // iframe.contentWindow.postMessage(JSON.stringify({ event: 'command',
          //   func: 'pauseVideo' }), '*');
        });
      };
      stopAllYouTubeVideos();
      backgroundPlayer.src = "https://www.youtube.com/embed/vrP-_T-h9YM?controls=0&amp;start="+t[0]+"&enablejsapi=1&mute=1&autoplay=1";
	}

}

// function onPlayerStateChange(event) {
//   if (event.data == YT.PlayerState.PLAYING) {  // If video is playing…
//     var stop = document.getElementsByClassName('bx-stop');
//     stop[0].click();
//   }
//   else{    // If video – pause
//     var start = document.getElementsByClassName('bx-start');
//     start[0].click();
//   }
// }


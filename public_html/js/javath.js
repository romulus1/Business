$(document).ready(function() {
   $('a[href*=#]').bind('click', function(e) {
	e.preventDefault(); //prevent the "normal" behaviour which would be a "hard" jump
       
	var target = $(this).attr("href"); //Get the target
			
	// perform animated scrolling by getting top-position of target-element and set it as scroll target
	$('html, body').stop().animate({ scrollTop: $(target).offset().top}, 500, function() {
	     location.hash = target;  //attach the hash (#jumptarget) to the pageurl
	});
			
	return false;
   });
});

var master = new TimelineMax({delay:1.2}),
    bg = $("#featureBackground"),
    centerY = $("#featureAnimation").height() / 2,
    centerX = $("#featureAnimation").width() / 2,
    radius = Math.max(centerX, centerY) + 50,
    slider = $("#ctrl_slider"),
    sliderValue = {value:0},
    _isOldIE = (document.all && !document.addEventListener);

slider.slider({
  range: false,
  min: 0,
  max: 100,
  step:.1,
  start:function() {
    master.pause();
  },
  slide: function ( event, ui ) {
    master.progress( ui.value / 100 );
  },
  stop:function() {
    master.play();
  }
});

master.eventCallback("onUpdate", function() {
  sliderValue.value = master.progress() * 100;
  slider.slider(sliderValue);
});
master.eventCallback("onComplete", function() {
  TweenLite.to(slider, 1, {autoAlpha:1});
  replayReveal();
});
$("#featureClick").on("click", function() {
  window.location.href = "http://www.greensock.com/gsap-js/";
});

TweenLite.set(".featureTextGreen", {textShadow:"0px 0px 8px #91e600"});
master.add( whyGSAP() )
.add( performance(), "-=1")
.add( compatibility(), "-=0.5")
.add( transforms(), "-=3.6")
.add( animateAnything(), "-=0.5")
.add( control(), "-=0.5")
.add( newStandard());

function whyGSAP() {
  var tl = new TimelineLite(),
      text = $("#whyGSAP"),
      split = new SplitText("#whyGSAP", {type:"chars,words"}),
      chars = split.chars,
      centerIndex = Math.floor(chars.length / 2),
      i;
  for (i = 0; i < chars.length; i++) {
    tl.from(chars[i], 1.8, {x:(i - centerIndex) * 40, opacity:0, ease:Power2.easeOut}, i * 0.1);
  }
  tl.fromTo(text, 4, {z:500, y:74, visibility:"visible"}, {z:-1000, ease:SlowMo.ease.config(0.1, 0.9)}, 0);
  tl.to(text, 1.5, {rotationX:-720, autoAlpha:0, scale:0.3, ease:Power2.easeInOut}, "-=1.5");
  return tl;
}

function performance() {
  var tl = new TimelineLite(),
      text = $("#performance"),
      duration = 0.6,
      i = 45,
      repeats = 2,
      stars = [],
      star, angle, delay;
  while (--i > -1) {
    star = $("<img class='star' src='http://www.greensock.com/js/img/dot.png'/>").appendTo(bg);
    stars.push(star);
    angle = Math.random() * Math.PI * 2;
    delay = Math.random() * duration;
    tl.set(star, {display:"block"}, delay);
    if (_isOldIE) {
      //IE8 and earlier perform better when animating top/left/width/height instead of x/y/scale.
      TweenLite.set(star, {width:1, height:1, top:centerY, left:centerX});
      tl.add( new TweenMax(star, duration, {
        top:(centerY + Math.sin(angle) * radius) | 0,
        left:(centerX + Math.cos(angle) * radius) | 0,
        width:22,
        height:22,
        ease:Cubic.easeIn,
        repeat:repeats,
        repeatDelay:Math.random() * duration}),
             delay);
    } else {
      TweenLite.set(star, {scale:0.05, top:centerY, left:centerX, z:0.1});
      tl.add( new TweenMax(star, duration, {
        y:Math.sin(angle) * radius,
        x:Math.cos(angle) * radius,
        scale:1.5,
        ease:Cubic.easeIn,
        repeat:repeats,
        repeatDelay:Math.random() * duration}),
             delay);
    }
  }
  tl.fromTo(text, 3, {scale:0.1, y:centerY-36, z:0.1}, {scale:1.8, ease:SlowMo.ease.config(0.5, 0.4)}, 0.3);
  tl.fromTo(text, 3, {opacity:0}, {autoAlpha:1, ease:SlowMo.ease.config(0.5, 0.4, true)}, 0.3);
  tl.set(stars, {display:"none"});
  return tl;
}

function compatibility() {
  var tl = new TimelineLite(),
      iconTimeline = new TimelineMax({repeat:1}),
      icons = $("#browserIcons img"),
      text = $("#compatibility"),
      split = new SplitText(text, {split:"chars", absolute:true}),
      rough = RoughEase.ease.config({strength:2, clamp:true}),
      i;
  for (i = 0; i < icons.length; i++) {
    iconTimeline.fromTo(icons[i], 0.6, {scaleX:0, opacity:0.4, z:0.1}, {autoAlpha:1, scaleX:1, ease:Power2.easeOut});
    iconTimeline.to(icons[i], 0.6, {scaleX:0, opacity:0.4, ease:Power2.easeIn});
    iconTimeline.set(icons[i], {visibility:"hidden"});
  }
  tl.add(iconTimeline, 0);
  tl.fromTo("#browserIcons", 2.8, {transformOrigin:"center -160px", rotation:170, z:0.1}, {rotation:0, ease:Elastic.easeOut}, 0);
  tl.set(text, {y: centerY-35, x:10, autoAlpha:1}, 0);
  for (i = 0; i < split.chars.length; i++) {
    tl.fromTo(split.chars[i], 2.4, {transformOrigin:"center -160px", z:0.1, rotation:((Math.random() < 0.5) ? 90 : -90)}, {rotation:0, ease:Elastic.easeOut}, 0.3 + i * 0.06);
    
    tl.to(split.chars[i], 0.6, {y:97, ease:Bounce.easeOut}, 3.4 + Math.random() * 0.6);
    tl.to(split.chars[i], 0.6, {autoAlpha:0, ease:rough}, 4.5 + Math.random());
  }
  TweenLite.set("#fallDown", {width:420, left:300, top:-35, autoAlpha:0, textAlign:"left"});
  tl.to("#fallDown", 0.5, {top:81, autoAlpha:1, ease:Back.easeOut}, 3.9);
  tl.to("#browserIcons", 0.5, {autoAlpha:0}, 8);
  tl.to("#fallDown", 0.5, {left:"-=100", autoAlpha:0, ease:Power1.easeIn}, 8);
  return tl;
}

function transforms() {
  var tl = new TimelineLite(),
      split = new SplitText("#transform", {split:"words", absolute:true}),
      box = document.getElementById("transformBox"),
      transformSub = document.getElementById("transformSub"),
      scale = split.words[0],
      rotate = split.words[1],
      move = [split.words[2], split.words[3]],
      independently = split.words[4];
  TweenLite.set(split.words, {autoAlpha:0, rotationX:-90});
  TweenLite.set(box, {scale:0.1, rotation:0.1, autoAlpha:0});
  tl.to(box, 0.3, {autoAlpha:1});
  tl.to(box, 7, {scale:1, ease:Linear.easeNone, autoRound:false}, 0);
  tl.to(scale, 0.5, {autoAlpha:1, rotationX:0, transformOrigin:"50% 50% -35px"}, 0);
  tl.to(box, 6, {rotation:360.2}, 1);
  tl.to(rotate, 0.5, {autoAlpha:1, rotationX:0, transformOrigin:"50% 50% -35px"}, 1);
  tl.to(box, 0.3, {x:60, ease:Power1.easeInOut}, 2.2);
  tl.to(box, 1.8, {x:0, ease:Elastic.easeOut}, 2.5);
  tl.to(move, 0.5, {autoAlpha:1, rotationX:0, transformOrigin:"50% 50% -35px"}, 2);
  tl.to(independently, 0.5, {autoAlpha:1, rotationX:0, transformOrigin:"50% 50% -35px"}, 2.5);
  tl.to(box, 3, {rotationX:360, ease:Elastic.easeOut}, 3.5);
  tl.from(transformSub, 0.5, {top:"-=16", autoAlpha:0}, 4.5);
  tl.to([transformSub, box], 0.5, {autoAlpha:0}, 7.4);
  tl.staggerTo(split.words.slice(0, 4), 0.5, {rotationX:90, autoAlpha:0}, 0.2, 7);
  tl.to(independently, 0.5, {rotationX:-90, autoAlpha:0}, 7.3);
  return tl;
}

function animateAnything() {
  var tl = new TimelineLite(),
      anything = document.getElementById("anything"),
      icon = document.getElementById("anythingIcon"),
      sub = document.getElementById("anythingSub");
  TweenLite.set([anything,icon], {autoAlpha:0});
  tl.to([anything, icon], 0.9, {autoAlpha:1});
  tl.to(anything, 2.5, {scrambleText:{text:"Animate anything", revealDelay:0.7}}, 0);
  tl.from(sub, 0.5, {top:"-=20", autoAlpha:0}, 2.5);
  tl.staggerTo([anything, sub, icon], 0.6, {left:"-=150", autoAlpha:0, ease:Power1.easeIn}, 0.1, 6);
  return tl;
}

function control() {
  var dots = new TimelineLite({paused:true}),
      tl = new TimelineLite(),
      qty = 30,
      duration = 2.5,
      xProp = _isOldIE ? "left" : "x",
      yProp = _isOldIE ? "top" : "y",
      colors = ["#91e600","#84d100","#73b403","#528003"],
      startVars = {css:{}},
      initialVars = {css:{borderRadius:"50%", width:100, z:0.1}, immediateRender:true},
      split = new SplitText("#controlSub", {split:"words", absolute:"true"}),
      pause = split.words[0],
      play = split.words[1],
      reverse = split.words[2],
      timeScale = [split.words[3], split.words[4]],
      subEnd = [split.words[5], split.words[6], split.words[7], split.words[8]],
      dot, i, delay;
  startVars.css[xProp] = initialVars.css[xProp] = 680;
  startVars.css[yProp] = initialVars.css[yProp] = 220;
  for (i = 0; i < qty; i++) {
    dot = $("<div class='dot'/>").appendTo(bg)[0];
    initialVars.css.width = initialVars.css.height = ((Math.random() * 15 + 10) | 0);
    initialVars.css.backgroundColor = colors[(Math.random() * colors.length) | 0];
    TweenLite.set(dot, initialVars);
    delay = Math.random() * duration;
    dots.to(dot, duration, {physics2D:{velocity:Math.random() * 300 + 150, angle:Math.random() * 40 + 250, gravity:400, xProp:xProp, yProp:yProp}}, delay);
    dots.fromTo(dot, duration, startVars, {physics2D:{velocity:Math.random() * 300 + 150, angle:Math.random() * 60 + 240, gravity:400, xProp:xProp, yProp:yProp}, immediateRender:false, overwrite:"none"}, delay + duration);
    dots.fromTo(dot, duration, startVars, {physics2D:{velocity:Math.random() * 300 + 150, angle:Math.random() * 60 + 240, gravity:400, xProp:xProp, yProp:yProp}, immediateRender:false, overwrite:"none", display:"none"}, delay + duration * 2);
  }
  tl.to(dots, 2.2, {time:2.2, ease:Linear.easeNone}, 0);
  tl.from("#control", 0.5, {left:"+=100", autoAlpha:0}, 0);
  tl.from(pause, 0.4, {autoAlpha:0, scale:2}, 2);
  tl.from(play, 0.4, {autoAlpha:0, scale:2}, 4);
  tl.to(dots, 2, {time:4.2, ease:Linear.easeNone}, 4.2);
  tl.from(reverse, 0.4, {autoAlpha:0, scale:2}, 6);
  tl.to(dots, 2, {time:2.2, ease:Linear.easeNone}, 6.2);
  tl.from(timeScale, 0.4, {autoAlpha:0, scale:2}, 8);
  tl.to(dots, 2, {time:3.2, ease:Linear.easeNone}, 8.2);
  tl.from(subEnd, 0.4, {autoAlpha:0}, 10);
  tl.to(dots, 3, {time:dots.duration(), ease:Linear.easeNone}, 10.2);
  tl.staggerTo(["#control", "#controlSub"], 0.8, {left:"-=100", autoAlpha:0, ease:Power1.easeIn}, 0.15, 12.6);
  return tl;
}

function newStandard() {
  var tl = new TimelineLite(),
      GSAP = document.getElementById("GSAP"),
      split = new SplitText(GSAP, {type:"chars", position:"absolute"}),
      chars = split.chars,
      positions = [chars[0].offsetLeft],
      i, xOffset;
  positions[5] = chars[1].offsetLeft;
  positions[9] = chars[2].offsetLeft;
  positions[18] = chars[3].offsetLeft;
  split.revert();
  GSAP.innerHTML = "GreenSock Animation Platform";
  split.split({type:"words,chars"});
  tl.staggerFrom(split.words, 1.5, {z:-1000, autoAlpha:0, ease:Power1.easeOut}, 0.3);
  tl.from("#newStandardText", 1, {autoAlpha:0});
  if (!_isOldIE) {
    chars = split.chars;
    for (i = 0; i < chars.length; i++) {
      TweenLite.set(chars[i], {force3D:true});
      if (positions[i]) {
        xOffset = positions[i] - (chars[i].offsetLeft + chars[i].parentNode.offsetLeft);
        tl.to(chars[i], 3, {bezier:{values:[{x:20, y:0}, {x:40, y:0}, getRandomPosition(chars[i], true), {x:xOffset - 100, y:0}, {x:xOffset - 10, y:0}, {x:xOffset, y:0}], autoRotate:true}, ease:Power2.easeInOut, color:"#91e600"}, i * 0.05 + 5);
      } else {
        tl.to(chars[i], 3, {bezier:{values:[{x:20, y:0}, {x:40, y:0}, getRandomPosition(chars[i], true), getRandomPosition(chars[i], false)], autoRotate:true}, ease:Power2.easeInOut}, i * 0.05 + 5);
        tl.set(chars[i], {visibility:"hidden"}, 8 + i * 0.05);
      }
    }
  }
  return tl;
}

function getRandomPosition(element, inside) {
  var xStart = element.offsetLeft + element.parentNode.offsetLeft;
  return {x:Math.random() * 950 - xStart, y:(inside ? Math.random() * 160 - 80 : (Math.random() < 0.5) ? 200 : -200)};
}

function replayReveal() {
  var tl = new TimelineLite(),
      $replayIcon = $("#replayIcon"),
      $replay = $("#replay").mouseenter(function(){
        TweenLite.to($replayIcon, 0.4, {rotation:"+=360"});
        TweenLite.to($replay, 0.4, {opacity:1});
      }).mouseleave(function(){
        TweenLite.to($replay, 0.4, {opacity:0.65});
      }).click(function(){
        master.restart();
      });
  tl.from($replay, 0.5, {autoAlpha:0, scale:2});
  tl.from($replayIcon, 0.5, {rotation:"360_ccw"});
  return tl;
}
TweenLite.set("#featureAnimation", {perspective:700, visibility:"visible"});

(function () {
    var requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;
    window.requestAnimationFrame = requestAnimationFrame;
})();


var canvas = document.getElementById("canvas"),
    ctx = canvas.getContext("2d"),
    width = 0,
    height = 0,
    vanishPointY = 0,
    vanishPointX = 0,
    focalLength = 300,
    angleX = 180,
    angleY = 180,
    angleZ = 180,
    angle = 0,
    cycle = 0,
    colors = {r : 255, g : 0, b : 0},
    lastShot = new Date().getTime();

canvas.width = width;
canvas.height = height;

/*
 *	Controls the emitter
 */
function Emitter() {
    this.reset();
}

Emitter.prototype.reset = function () {
    var PART_NUM = 200,
        x = (Math.random() * 400) - 200,
        y = (Math.random() * 400) - 200,
        z = (Math.random() * 800) - 200;
    
    this.x = x || 0;
    this.y = y || 0;
    this.z = z || 0;
    
    var color = [~~(Math.random() * 150) + 10, ~~(Math.random() * 150) + 10, ~~(Math.random() * 150) + 10]
    this.particles = [];

    for (var i = 0; i < PART_NUM; i++) {
        this.particles.push(new Particle(this.x, this.y, this.z, {
            r: colors.r,
            g: colors.g,
            b: colors.b
        }));
    }
}

Emitter.prototype.update = function () {
    var partLen = this.particles.length;

    angleY = (angle - vanishPointX) * 0.0001;
    angleX = (angle - vanishPointX) * 0.0001;

    this.particles.sort(function (a, b) {
        return b.z - a.z;
    });

    for (var i = 0; i < partLen; i++) {
        this.particles[i].update();
    }
    
    if(this.particles.length <= 0){
      this.reset();   
    }

};

Emitter.prototype.render = function (imgData) {
    var data = imgData.data;

    for (i = 0; i < this.particles.length; i++) {
        var particle = this.particles[i],
            dist = Math.sqrt((particle.x - particle.ox) * (particle.x - particle.ox) + (particle.y - particle.oy) * (particle.y - particle.oy) + (particle.z - particle.oz) * (particle.z - particle.oz));

        if (dist > 255) {
            particle.render = false;
            this.particles.splice(i, 1);
            this.particles.length--;
        }

        if (particle.render && particle.xPos < width && particle.xPos > 0 && particle.yPos > 0 && particle.yPos < height) {
            for (w = 0; w < particle.size; w++) {
                for (h = 0; h < particle.size; h++) {
                    if (particle.xPos + w < width && particle.xPos + w > 0 && particle.yPos + h > 0 && particle.yPos + h < height) {
                        pData = (~~ (particle.xPos + w) + (~~ (particle.yPos + h) * width)) * 4;
                        data[pData] = particle.color[0];
                        data[pData + 1] = particle.color[1];
                        data[pData + 2] = particle.color[2];
                        data[pData + 3] = 255 - dist;
                    }
                }
            }
        }
    }
};


/*
 *	Controls the individual particles
 */
function Particle(x, y, z, color) {
    this.x = x;
    this.y = y;
    this.z = z;

    this.startX = this.x;
    this.startY = this.y;
    this.startZ = this.z;

    this.ox = this.x;
    this.oy = this.y;
    this.oz = this.z;

    this.xPos = 0;
    this.yPos = 0;

    this.vx = (Math.random() * 10) - 5;
    this.vy = (Math.random() * 10) - 5;
    this.vz = (Math.random() * 10) - 5;

    this.color = [color.r, color.g, color.b];
    this.render = true;

    this.size = Math.round(1 + Math.random() * 1);
}

Particle.prototype.rotate = function () {
    var x = this.startX * Math.cos(angleZ) - this.startY * Math.sin(angleZ),
        y = this.startY * Math.cos(angleZ) + this.startX * Math.sin(angleZ);

     this.x = x;
     this.y = y;
}

Particle.prototype.update = function () {
    var cosY = Math.cos(angleX),
        sinY = Math.sin(angleX);

    this.x = (this.startX += this.vx);
    this.y = (this.startY += this.vy);
    this.z = (this.startZ -= this.vz);
    this.rotate();

    this.vy += 0.1;
    this.x += this.vx;
    this.y += this.vy;
    this.z -= this.vz;

    this.render = false;

    if (this.z > -focalLength) {
        var scale = focalLength / (focalLength + this.z);

        this.size = scale * 2;
        this.xPos = vanishPointX + this.x * scale;
        this.yPos = vanishPointY + this.y * scale;
        this.render = true;
    }
};

function render() {
    colorCycle();
    angleY = Math.sin(angle += 0.01);
    angleX = Math.sin(angle);
    angleZ = Math.sin(angle);

    var imgData = ctx.createImageData(width, height);

    for (var e = 0; e < 30; e++) {
        emitters[e].update();
        emitters[e].render(imgData);
    }
    ctx.putImageData(imgData, 0, 0);
    requestAnimationFrame(render);
}

function colorCycle() {
    cycle += .6;
    if (cycle > 100) {
        cycle = 0;
    }
    colors.r = ~~ (Math.sin(.3 * cycle + 0) * 127 + 128);
    colors.g = ~~ (Math.sin(.3 * cycle + 2) * 127 + 128);
    colors.b = ~~ (Math.sin(.3 * cycle + 4) * 127 + 128);
}

var emitters = [];
for (var e = 0; e < 30; e++) {
    colorCycle();
    emitters.push(new Emitter());
}
//render();


// smart trick from @TimoHausmann for full screen pens
setTimeout(function () {
    width = canvas.width = window.innerWidth;
    height = canvas.height = document.body.offsetHeight;
    vanishPointY = height / 2;
    vanishPointX = width / 2;
    render();
}, 500);
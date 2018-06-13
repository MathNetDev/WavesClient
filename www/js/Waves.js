/*global define */
define([
    'helpers/StateMachine', 
    'helpers/EventManager', 
    'helpers/Clock', 
    'helpers/Wave', 
    'helpers/UnitCircle', 
    'helpers/PhaseArrow', 
    'helpers/FrequencySlider', 
    'helpers/WavelengthSlider', 
    'helpers/StopWatch', 
    'helpers/HorizontalRuler', 
    'helpers/PlayButton', 
    'helpers/DirectionButton', 
    'helpers/WaveOverlay', 
    'helpers/SelectionBox', 
    'helpers/MembersList', 
    'helpers/Oscillator',
    'helpers/CoordinateAxes', 
    'helpers/Legend'], 

    function (StateMachine, EventManager, Clock, Wave, UnitCircle, PhaseArrow, FrequencySlider, WavelengthSlider, StopWatch, HorizontalRuler, PlayButton, DirectionButton, WaveOverlay, SelectionBox, MembersList, Oscillator, CoordinateAxes, Legend) {
    
    'use strict';
    var Waves = function (canvasName, paperScope, mode) {
        var canvas = document.getElementById(canvasName),
            paper = paperScope,
            Path = paper.Path,
            Point = paper.Point,
            Size = paper.Size,
            State = new StateMachine(),
            em = new EventManager(),
            members = [],
            Config = {
                TICKINTERVAL: 50,
                AMPLITUDE: 10 / 64,
                RESOLUTION: 256,
                FREQUENCY: 4,
                WAVELENGTH: 16,
                MIN_WAVELENGTH: 6,
                POINTS: 25,
                DIRECTION: 'left',
                OFFSET: 20 / 64,
                COLOR: '#E0E0E0', // #BBD9EE',
                START_X1: 7,
                START_X2: 8,
                mode: mode
            },
            colors = ['red', 'blue', 'orange', 'purple', 'black', 'yellow', 'green', 'cyan', 'pink', 'white', 'DarkCyan', 'YellowGreen'],
            clock,
            wave,
            legend,
            waveOverlay,
            stopWatch,
            waitingScreen,
            waitingText,
            stopWatchRWidth = 1 / 8,
            stopWatchRX = 13 / 16,
            stopWatchRY = 7 / 12,
            unitCircle,
            unitCircleRWidth = 1 / 3,
            unitCircleRX = 1 / 8,
            unitCircleRY = 23 / 32,
            phaseArrow1,
            phaseArrow2,
            frequencySlider,
            frequencySliderRHeight = 1 / 3,
            frequencySliderRWidth = 1 / 30,
            frequencySliderRX = 7 / 12,
            frequencySliderRY = 1 / 2,
            wavelengthSlider,
            wavelengthSliderRHeight = 1 / 3,
            wavelengthSliderRWidth = 1 / 30,
            wavelengthSliderRX = 8 / 12,
            wavelengthSliderRY = 1 / 2,
            playButton,
            playButtonRWidth = 1 / 12,
            playButtonRX = 31 / 32,
            directionButton,
            directionButtonRWidth = 1 / 10,
            directionButtonRHeight = 1 / 15,
            directionButtonRX = 146 / 240,
            directionButtonRY = 27 / 32,
            ruler,
            rulerRWidth = 1,
            rulerRHeight = 1 / 15,
            rulerRX,
            rulerRY,
            coordinateAxes,
            membersList,
            height,
            width,
            size;

        // alert(window.device.name);

        //canvas.height = window.innerHeight;
        //canvas.width = window.innerWidth;
        canvas.height = '100%';
        canvas.width = '100%';

        paper.setup(canvas);

        height = paper.view.bounds.height;
        width = paper.view.bounds.width;

        Path.Rectangle({
            point: new Point(),
            size: new Size(paper.view.bounds.size),
            fillColor: 'white'
        });

        Path.Rectangle({
            point: new Point({
                x: 0,
                y: paper.view.bounds.center.y - (Config.OFFSET - Config.AMPLITUDE) * height
            }),
            size: new Size(paper.view.bounds.size),
            fillColor: Config.COLOR
        });


        // CREATE COMPONENTS
        clock = new Clock(Config.TICKINTERVAL, em);      

        size = new Size(width, 2 * Config.AMPLITUDE * height);
        wave = new Wave(size, paper, em, Config);

        size = new Size(width, 2 * Config.AMPLITUDE * height);
        waveOverlay = new WaveOverlay(size, paper, em, Config);  
        
        // size = new Size(width - .5*width/Config.POINTS, 2.1 * Config.AMPLITUDE * height);
        // coordinateAxes = new CoordinateAxes(size, paperScope, em, Config);

        size = new Size(unitCircleRWidth * width, unitCircleRWidth * width);
        unitCircle = new UnitCircle(size, paper, em, Config);
        unitCircle.moveLeftCenterTo({ x: unitCircleRX * width, y: unitCircleRY * height});

        size = new Size(rulerRWidth * width, rulerRHeight * height);
        ruler = new HorizontalRuler(size, paperScope, em, Config);

        size = new Size(playButtonRWidth * width, playButtonRWidth * width);
        playButton = new PlayButton(size, paperScope, em);

        if (Config.mode === "explore") {
            size = new Size(stopWatchRWidth * width, stopWatchRWidth * width);
            stopWatch = new StopWatch(size, paperScope, Config.TICKINTERVAL);
        
            size = new Size(frequencySliderRWidth * width, frequencySliderRHeight * height);
            frequencySlider = new FrequencySlider(size, paperScope, em, Config);

            size = new Size(wavelengthSliderRWidth * width, wavelengthSliderRHeight * height);
            wavelengthSlider = new WavelengthSlider(size, paperScope, em, Config);

            size = new Size(directionButtonRWidth * width, directionButtonRHeight * height);
            directionButton = new DirectionButton(size, paperScope, em, Config);
        } 

        if(Config.mode === "collab") {
            // membersList = new MembersList(new Size(width / 2, 30), paper);
            size = new Size(150, 250);
            legend = new Legend(size, paperScope, em, colors);
        }

        var PhaseWatcher = function (wave, color, startIndex) {
            var point,
                phase,
                size = new Size(width, 2 * Config.AMPLITUDE * height),
                selectionBox = new SelectionBox(size, paper, em, Config, 'grey'),
                size2 = new Size(unitCircleRWidth * width, unitCircleRWidth * width),
                phaseArrow = new PhaseArrow(size2, paper, em, Config, unitCircle.getCenter(), unitCircle.getRadius(), color),
                size3 = new Size(width / Config.POINTS, unitCircleRWidth * width),
                oscillator = new Oscillator(size3, paper, em, Config, color);

            selectionBox.moveLeftCenterTo({
                x: paper.view.bounds.leftCenter.x, 
                y: paper.view.bounds.center.y - Config.OFFSET * height
            });
            selectionBox.setIndex(startIndex);
            var off = color == "red" ? 0 : width / Config.POINTS;
            oscillator.moveCenterTo({
                x: 100 + off + unitCircleRX * width + unitCircleRWidth * width,
                y: unitCircleRY * height
            });
            
            function update () {
                point = selectionBox.getIndex();
                if (point !== null) {
                    phase = wave.getPhaseAtPoint(point);
                    
                    phaseArrow.updatePhase(phase);
                    phaseArrow.setColor(wave.getMarkerColor(point));
                
                var memberIndex = members.indexOf(sessionStorage.getItem('username'));
                var extra = Config.POINTS % members.length; // ex: 25 points, 3 people: 1 'extra'
                var ppp = (Config.POINTS - extra) / members.length; // ex: 25 points, 3 people: 8 'ppp'
                var seg,
                    j;

                    if (point < extra*(ppp + 1)) {
                        seg = (point - (point % (ppp + 1))) / (ppp + 1); // even division into ppp + 1
                    } else {
                        j = point - extra*(ppp+1);
                        seg = ((j - (j % ppp)) / ppp) + extra; // even division into ppp
                    }

                    if (seg == memberIndex) {
                        phaseArrow.startEdit();
                    }

                    else {
                        phaseArrow.stopEdit();
                    }

                    oscillator.updatePhase(phase);
                    oscillator.setColor(wave.getMarkerColor(point));
                }
            }

            return {
                getPhase: function() {
                    return phase;
                },

                getX: function () {
                    return selectionBox.getIndex();
                },

                playPause: function(event) {
                    if(event.state == 'pause') {
                        if (point % members.length == members.indexOf(sessionStorage.getItem('username'))) {
                            phaseArrow.startEdit();
                        }
                        else {
                            phaseArrow.stopEdit();
                        }
                    }
                },

                phaseArrowEdit: function(event) {
                    if (event.id == color) {
                        em.publish({type: 'localphaseedit', point: point, phase: event.phase});
                    }
                },

                finalUnitCircleEdit: function(event) {
                    if (event.id == color) {
                        em.publish({type: 'localphaseeditdone', point: point, phase: event.phase});
                    }
                },

                update: function(event) {
                    update();
                },

                setIndexToWatch: function(event) {
                    point = event.point;
                    update();
                }
            };
        }

        var pw2 = new PhaseWatcher(wave, "grey", 4);
        var pw1 = new PhaseWatcher(wave, "red", 8);


        // SET POSITIONS
        wave.moveCenterTo({x: paper.view.bounds.center.x, y: paper.view.bounds.center.y - Config.OFFSET * height});
        waveOverlay.moveCenterTo({x: paper.view.bounds.center.x, y: paper.view.bounds.center.y - Config.OFFSET * height});

        legend.moveCenterTo({x: .9 * paper.view.bounds.rightCenter.x, y: paper.view.bounds.center.y + 100});

        ruler.alignTopCenterTo({
            x: paper.view.bounds.center.x,
            y: paper.view.bounds.center.y - (Config.OFFSET - Config.AMPLITUDE - 1 / 64) * height
        });

        // coordinateAxes.alignOriginTo({
        //     x: (width/Config.POINTS)/2,
        //     y: paper.view.bounds.center.y - Config.OFFSET * height
        // });

        var DeltaXIndicator = function(pw1, pw2, ruler) {
            var x1,
                x2,
                box;

            function update() {
                x1 = pw1.getX();
                x2 = pw2.getX();

                ruler.highlight(x1, x2);
            }
            update();
            
            return {
                update: function(event) {
                    update();
                }
            };
        };
        var dXIndicator = new DeltaXIndicator(pw1, pw2, ruler);

        var DeltaPhiIndicator = function(pw1, pw2, unitCircle) {
            var p1,
                p2,
                arc;

            function update() {
                p1 = pw1.getPhase();
                p2 = pw2.getPhase();

                unitCircle.highlight(p1, p2);
            }

            return {
                update: function(event) {
                    update();
                }
            };
        };
        var dPhiIndicator = new DeltaPhiIndicator(pw1, pw2, unitCircle);

        playButton.moveBottomRightTo({
            x: playButtonRX * width,
            y: height - (1 - playButtonRX) * width
        });

        if (Config.mode === "explore") {
            stopWatch.moveTopLeftTo({
                x: stopWatchRX * width,
                y: stopWatchRY * height
            });

            frequencySlider.moveTopLeftTo({
                x: frequencySliderRX * width,
                y: ((unitCircleRY * height) - (unitCircleRWidth * width / 2))
            });

            wavelengthSlider.moveTopLeftTo({
                x: wavelengthSliderRX * width,
                y: ((unitCircleRY * height) - (unitCircleRWidth * width / 2))
            });

            directionButton.moveTopLeftTo({
                x: directionButtonRX * width,
                y: directionButtonRY * height
            });
        }



        // SET UP EVENT LISTENERS
        em.subscribe('tick', wave.tick);

        em.subscribe('frequencychange', wave.setFrequency);
        em.subscribe('wavelengthchange', wave.setWavelength);
        em.subscribe('directionchange', wave.setDirection);
        em.subscribe('playpause', wave.playPause);

        em.subscribe('localphaseedit', wave.editPhaseAtPoint);
        em.subscribe('remotephaseedit', wave.editPhaseAtPoint);

        em.subscribe('playpause', clock.playPause);

        em.subscribe('phasearrowedit', pw1.phaseArrowEdit);
        em.subscribe('finalucedit', pw1.finalUnitCircleEdit);
        
        em.subscribe('phasearrowedit', pw2.phaseArrowEdit);
        em.subscribe('finalucedit', pw2.finalUnitCircleEdit);

        em.subscribe('selectionchange', pw1.setIndexToWatch);
        em.subscribe('waveupdate', pw1.update);
        em.subscribe('waveupdate', pw2.update);
        em.subscribe('waveupdate', dPhiIndicator.update);
        em.subscribe('waveupdate', function () {
            paper.view.draw();
        });
        em.subscribe('selectionupdate', pw1.update);
        em.subscribe('selectionupdate', pw2.update);
        em.subscribe('selectionupdate', dXIndicator.update);
        em.subscribe('selectionupdate', dPhiIndicator.update);

        if(Config.mode === "collab") {
            
            em.subscribe('playpause', pw1.playPause);
            em.subscribe('playpause', pw2.playPause);

            em.subscribe('memberjoin', function (event) {
                members.push(event.user);

                var extra = Config.POINTS % members.length; // ex: 25 points, 3 people: 1 'extra'
                var ppp = (Config.POINTS - extra) / members.length; // ex: 25 points, 3 people: 8 'ppp'
                var seg,
                    color;

                for(i = 0; i < Config.POINTS; i++) { // for 23 points, 0 -> 22
                    if (i < extra*(ppp + 1)) {
                        seg = (i - (i % (ppp + 1))) / (ppp + 1); // even division into ppp + 1
                        color = colors[seg];
                    } else {
                        var j = i - extra*(ppp+1);
                        seg = (j - (j % ppp)) / ppp; // even division into ppp
                        color = colors[seg + extra];

                    }
                    wave.setMarkerColor(i, color);
                    // for rotating pattern of points:
                    //var color = colors[i % members.length];
                    //wave.setMarkerColor(i, color);
                }
                legend.setMembers(members);
                pw1.update();
                pw2.update();
            });

            em.subscribe('memberleave', function (event) {
                var index = members.indexOf(event.user);
                if (index > -1) {
                    members.splice(index, 1);
                }

                var extra = Config.POINTS % members.length; // ex: 25 points, 3 people: 1 'extra'
                var ppp = (Config.POINTS - extra) / members.length; // ex: 25 points, 3 people: 8 'ppp'
                var seg,
                    color;

                for(i = 0; i < Config.POINTS; i++) { // for 23 points, 0 -> 22
                    if (i < extra*(ppp + 1)) {
                        seg = (i - (i % (ppp + 1))) / (ppp + 1); // even division into ppp + 1
                        color = colors[seg];
                    } else {
                        var j = i - extra*(ppp+1);
                        seg = (j - (j % ppp)) / ppp; // even division into ppp
                        color = colors[seg + extra];

                    }
                    wave.setMarkerColor(i, color);
                    // for rotating pattern of points:
                    //var color = colors[i % members.length];
                    //wave.setMarkerColor(i, color);
                }
                legend.setMembers(members);
                pw1.update();
                pw2.update();
            });

            em.subscribe('syncrequest', function (event) {
                em.publish({
                    type: "syncresponse", 
                    socketId: event.id, 
                    wave: wave.getInitialPhases(),
                    members: members
                });
                legend.setMembers(members);
            });

            em.subscribe('syncreceived', function (event) {
                wave.setInitialPhases(event.wave);
                waitingScreen.visible = false;
                waitingText.visible = false;

                members.length = 0;
                Array.prototype.push.apply(members, event.members);

                var extra = Config.POINTS % members.length; // ex: 25 points, 3 people: 1 'extra'
                var ppp = (Config.POINTS - extra) / members.length; // ex: 25 points, 3 people: 8 'ppp'
                var seg,
                    color;

                for(i = 0; i < Config.POINTS; i++) { // for 23 points, 0 -> 22
                    if (i < extra*(ppp + 1)) {
                        seg = (i - (i % (ppp + 1))) / (ppp + 1); // even division into ppp + 1
                        color = colors[seg];
                    } else {
                        var j = i - extra*(ppp+1);
                        seg = (j - (j % ppp)) / ppp; // even division into ppp
                        color = colors[seg + extra];

                    }
                    wave.setMarkerColor(i, color);
                    // for rotating pattern of points:
                    //var color = colors[i % members.length];
                    //wave.setMarkerColor(i, color);
                }
                legend.setMembers(members);
                pw1.update();
                pw2.update();
            });
        }

        else if (Config.mode === "build") {
            em.subscribe('playpause', pw1.playPause);
            em.subscribe('playpause', pw2.playPause);
        }
        else if (Config.mode === "explore") {
            em.subscribe('tick', stopWatch.tick);
        }

        legend.setMembers(members);

        waitingScreen = Path.Rectangle({
            point: new Point(),
            size: new Size(paper.view.bounds.size),
            fillColor: 'white',
            opacity: .8
        });

        waitingText = new paper.PointText();
        waitingText.content = "Connecting to Group...";
        waitingText.style = {
            fontSize: 40,
            fillColor: 'black',
            justification: 'left'
        };
        waitingText.position.x = width/2;
        waitingText.position.y = height/2 - 40;

        paper.view.draw();
        clock.playPause({state: 'play'});

        return{
            getEventManager: function(){
                return em;
            }
        };
    };
    return Waves;
});
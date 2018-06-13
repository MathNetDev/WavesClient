/*global define */
define(['helpers/StateMachine', 'helpers/EventManager', 'helpers/Clock', 'helpers/Wave', 'helpers/UnitCircle', 'helpers/FrequencySlider', 'helpers/WavelengthSlider', 'helpers/StopWatch', 'helpers/HorizontalRuler', 'helpers/PlayButton', 'helpers/DirectionButton', 'helpers/WaveOverlay', 'helpers/MembersList'], function (StateMachine, EventManager, Clock, Wave, UnitCircle, FrequencySlider, WavelengthSlider, StopWatch, HorizontalRuler, PlayButton, DirectionButton, WaveOverlay, MembersList) {
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
                FREQUENCY: 10,
                WAVELENGTH: 16,
                MIN_WAVELENGTH: 6,
                POINTS: 25,
                DIRECTION: 'left',
                OFFSET: 20 / 64,
                COLOR: '#BBD9EE',
                START_X: 7,
                mode: mode
            },
            clock,
            wave,
            waveOverlay,
            stopWatch,
            stopWatchRWidth = 1 / 8,
            stopWatchRX = 13 / 16,
            stopWatchRY = 7 / 12,
            unitCircle,
            unitCircleRWidth = 1 / 3,
            unitCircleRX = 1 / 8,
            unitCircleRY = 23 / 32,
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
            membersList,
            height,
            width,
            size;

        canvas.height = window.innerHeight;
        canvas.width = window.innerWidth;
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

        size = new Size(unitCircleRWidth * width, unitCircleRWidth * width);
        unitCircle = new UnitCircle(size, paper, em, Config);

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
        }

        var PhaseWatcher = function (wave, unitCircle) {
            var point = null,
                phase;

            function update () {
                if (point !== null) {
                    phase = wave.getPhaseAtPoint(point);
                    unitCircle.updatePhase(phase);
                }
            }

            return {
                phase: function() {
                    return phase;
                },

                unitCircleEdit: function(event) {
                    em.publish({type: 'localphaseedit', point: point, phase: event.phase});
                },

                finalUnitCircleEdit: function(event) {
                    em.publish({type: 'localphaseeditdone', point: point, phase: event.phase});
                },

                update: function(event) {
                    update();
                    paper.view.draw();
                },

                setIndexToWatch: function(event) {
                    point = event.point;
                    update();
                }
            };
        }

        var pw1 = new PhaseWatcher(wave, unitCircle);
        pw1.setIndexToWatch({point: Config.START_X});


        // SET POSITIONS
        wave.moveCenterTo({x: paper.view.bounds.center.x, y: paper.view.bounds.center.y - Config.OFFSET * height});
       
        waveOverlay.moveCenterTo({x: paper.view.bounds.center.x, y: paper.view.bounds.center.y - Config.OFFSET * height});
        
        unitCircle.moveLeftCenterTo({ x: unitCircleRX * width, y: unitCircleRY * height});

        ruler.alignTopCenterTo({
            x: paper.view.bounds.center.x,
            y: paper.view.bounds.center.y - (Config.OFFSET - Config.AMPLITUDE - 1 / 64) * height
        });

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
        em.subscribe('tick', function () {
            paper.view.draw();
        });

        em.subscribe('frequencychange', wave.setFrequency);
        em.subscribe('wavelengthchange', wave.setWavelength);
        em.subscribe('directionchange', wave.setDirection);
        em.subscribe('playpause', wave.playPause);

        em.subscribe('localphaseedit', wave.editPhaseAtPoint);
        em.subscribe('remotephaseedit', wave.editPhaseAtPoint);

        em.subscribe('playpause', clock.playPause);

        em.subscribe('unitcircleedit', pw1.unitCircleEdit);
        em.subscribe('selectbox', pw1.setIndexToWatch);
        em.subscribe('finalucedit', pw1.finalUnitCircleEdit);
        em.subscribe('waveupdate', pw1.update);

        if(Config.mode === "collab") {
            //em.subscribe('memberjoin', membersList.memberJoin);
            //em.subscribe('memberleave', membersList.memberLeave);
            
            em.subscribe('playpause', unitCircle.playPause);

            em.subscribe('memberjoin', function (event) {
                members.push(event.user);
            });

            em.subscribe('memberleave', function (event) {
                var index = members.indexOf(event.user);
                if (index > -1) {
                    members.splice(index, 1);
                }
            });

            em.subscribe('syncrequest', function (event) {
                em.publish({
                    type: "syncresponse", 
                    socketId: event.id, 
                    wave: wave.getInitialPhases(),
                    members: members
                });
            });

            em.subscribe('syncreceived', function (event) {
                wave.setInitialPhases(event.wave);
                members.length = 0;
                Array.prototype.push.apply(members, event.members);
            });
        }

        else if (Config.mode === "build") {
            em.subscribe('playpause', unitCircle.playPause);
        } 
        else if (Config.mode === "explore") {
            em.subscribe('tick', stopWatch.tick);
        }

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
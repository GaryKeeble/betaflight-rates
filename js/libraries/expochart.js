/** 
	Expo Chart Drawing function
	
**/

"use strict";

function ChartTest() {
	
	var canvas = $("#graphCanvas").get(0);

    var curves = [
            {
                version         : 2.9, // betaflight version
                rcRate          : 100,
                rcExpo          : 10,
                axisRate        : 70,
                superExpoActive : true,
                controller      : null,
                rcExpoPwr       : null,
                color           : "rgba(0,0,200,0.9)" // blue
            },
            {
                version         : 3.0, // betaflight version
                rcRate          : 120,
                rcExpo          : 0,
                rcExpoPwr       : 3,
                axisRate        : 0,
                superExpoActive : null,
                controller      : 1,
                color           : "rgba(0,200,0,0.9)" // green
            }
        ];

    // Common Values
    var rcData = 1768;
	var deadband = 0;
	var midrc = 1500;

    var
        oldElements = {
            rcRate:             $('#rcRate-old'),
            rcRateSlider:       $('#rcRate-old-slider'),
            rcExpo:             $('#rcExpo-old'),
            rcExpoSlider:       $('#rcExpo-old-slider'),
            axisRate:           $('#axisRate-old'),
            axisRateSlider:     $('#axisRate-old-slider'),
            superExpoActive:    $('#superExpoActive-old'),
        },
        newElements = {
            rcRate:             $('#rcRate-new'),
            rcRateSlider:       $('#rcRate-new-slider'),
            rcExpo:             $('#rcExpo-new'),
            rcExpoSlider:       $('#rcExpo-new-slider'),
            axisRate:           $('#axisRate-new'),
            axisRateSlider:     $('#axisRate-new-slider'),
            controller:         $('#controller-new'),
        },
        commonElements = {
            rcData:             $('#rcData'),
            rcDataSlider:       $('#rcData-slider'),
            deadband:           $('#deadband'),
            midrc:              $('#midrc'),
        };

	var expoChart;

    $(document).ready(function() {

        // Populate the default values
        oldElements.rcRate.val(curves[0].rcRate);
        oldElements.rcRateSlider.val(curves[0].rcRate);
        oldElements.rcExpo.val(curves[0].rcExpo);
        oldElements.rcExpoSlider.val(curves[0].rcExpo);
        oldElements.axisRate.val(curves[0].axisRate);
        oldElements.axisRateSlider.val(curves[0].axisRate);
        oldElements.superExpoActive.prop('checked', curves[0].superExpoActive);

        newElements.rcRate.val(curves[1].rcRate);
        newElements.rcRateSlider.val(curves[1].rcRate);
        newElements.rcExpo.val(curves[1].rcExpo);
        newElements.rcExpoSlider.val(curves[1].rcExpo);
        newElements.axisRate.val(curves[1].axisRate);
        newElements.axisRateSlider.val(curves[1].axisRate);
        newElements.controller.val(curves[1].controller);

        commonElements.rcData.val(rcData);
        commonElements.rcDataSlider.val(rcData);
        commonElements.deadband.val(deadband);
        commonElements.midrc.val(midrc);

        expoChart = new ExpoChart(canvas, rcData, curves, deadband, midrc);

	});

    function convertUItoLocal() {

        curves[0].rcRate = parseInt(oldElements.rcRate.val());
        curves[0].rcExpo = parseInt(oldElements.rcExpo.val());
        curves[0].axisRate = parseInt(oldElements.axisRate.val());
        curves[0].superExpoActive = oldElements.superExpoActive.is(":checked");

        curves[1].rcRate = parseInt(newElements.rcRate.val());
        curves[1].rcExpo = parseInt(newElements.rcExpo.val());
        curves[1].axisRate = parseInt(newElements.axisRate.val());
        curves[1].controller = parseInt(newElements.controller.val());

        rcData = parseInt(commonElements.rcData.val());
        deadband = parseInt(commonElements.deadband.val());
        midrc = parseInt(commonElements.midrc.val());

    };

    /* add slider controls */
    commonElements.rcDataSlider.on('input',
        function (e) {
            e.preventDefault();
            rcData = parseInt(commonElements.rcDataSlider.val());
            commonElements.rcData.val(rcData);
            expoChart.refresh(rcData, curves, deadband, midrc);
        });

    oldElements.rcRateSlider.on('input',
        function (e) {
            e.preventDefault();
            curves[0].rcRate = parseInt(oldElements.rcRateSlider.val());
            oldElements.rcRate.val(curves[0].rcRate);
            expoChart.refresh(rcData, curves, deadband, midrc);
        });

    oldElements.rcExpoSlider.on('input',
        function (e) {
            e.preventDefault();
            curves[0].rcExpo = parseInt(oldElements.rcExpoSlider.val());
            oldElements.rcExpo.val(curves[0].rcExpo);
            expoChart.refresh(rcData, curves, deadband, midrc);
        });

    oldElements.axisRateSlider.on('input',
        function (e) {
            e.preventDefault();
            curves[0].axisRate = parseInt(oldElements.axisRateSlider.val());
            oldElements.axisRate.val(curves[0].axisRate);
            expoChart.refresh(rcData, curves, deadband, midrc);
        });

    newElements.rcRateSlider.on('input',
        function (e) {
            e.preventDefault();
            curves[1].rcRate = parseInt(newElements.rcRateSlider.val());
            newElements.rcRate.val(curves[1].rcRate);
            expoChart.refresh(rcData, curves, deadband, midrc);
        });

    newElements.rcExpoSlider.on('input',
        function (e) {
            e.preventDefault();
            curves[1].rcExpo = parseInt(newElements.rcExpoSlider.val());
            newElements.rcExpo.val(curves[1].rcExpo);
            expoChart.refresh(rcData, curves, deadband, midrc);
        });

    newElements.axisRateSlider.on('input',
        function (e) {
            e.preventDefault();
            curves[1].axisRate = parseInt(newElements.axisRateSlider.val());
            newElements.axisRate.val(curves[1].axisRate);
            expoChart.refresh(rcData, curves, deadband, midrc);
        });
        
    $('input[type="number"]').on('change',
        function (e) {
            convertUItoLocal();
            expoChart.refresh(rcData, curves, deadband, midrc);
            e.preventDefault();
        });

    $('select').on('change',
        function (e) {
            convertUItoLocal();
            expoChart.refresh(rcData, curves, deadband, midrc);
            e.preventDefault();
        });

    oldElements.superExpoActive.click(function(e) {
        convertUItoLocal();
        expoChart.refresh(rcData, curves, deadband, midrc);
    });

};

$(document).off('.data-api');
window.chartTest = new ChartTest();


/* Wrap whole function in an independant class */

function ExpoChart(canvas, rcData, curves, deadband, midrc) {
	
	var fontHeight, fontFace;
	var rcCommandMaxDegS, rcCommandMinDegS;
	var canvasHeightScale;

    var DEFAULT_FONT_FACE = "pt Verdana, Arial, sans-serif";
	var stickColor 		  = "rgba(255,102,102,1.0)";  	// Betaflight Orange
	var axisColor		  = "rgba(0,0,255,0.5)";		// Blue
	var axisLabelColor	  = "rgba(0,0,0,0.9)";			// Black

	function constrain(value, min, max) {
	    return Math.max(min, Math.min(value, max));
	}

    var rcCommandRawToDegreesPerSecond = function(value, curve, midrc, deadband) {

        if (curve.version >= 3.0) {

            const RC_RATE_INCREMENTAL = 14.54;
            const RC_EXPO_POWER = 3;

            var rcInput;
            var that = this;

            var rcCommand = function(rcData, rate, expo, midrc, deadband) {
                var tmp = Math.min(Math.abs(rcData - midrc), 500);
                (tmp > deadband) ? (tmp -= deadband):(tmp = 0);
                return ((rcData < midrc)?-1:1) * tmp;
            };

            var calculateSetpointRate = function (value, curve) {
                var angleRate, rcSuperfactor, rcCommandf;

                var rcData = rcCommand(value, curve.rcRate, curve.rcExpo, midrc, deadband);

                var rcRate = curve.rcRate / 100.0;

                if (rcRate > 2.0) rcRate = rcRate + (RC_RATE_INCREMENTAL * (rcRate - 2.0));
                rcCommandf = rcData / 500.0;
                rcInput = Math.abs(rcCommandf);

                if (curve.rcExpo) {
                    var expof = curve.rcExpo / 100.0;
                    rcCommandf = rcCommandf * Math.pow(rcInput, RC_EXPO_POWER) * expof + rcCommandf * (1 - expof);
                }

                angleRate = 200.0 * rcRate * rcCommandf;

                if (curve.axisRate) {
                    rcSuperfactor = 1.0 / (constrain(1.0 - (Math.abs(rcCommandf) * (curve.axisRate / 100.0)), 0.01, 1.00));
                    angleRate *= rcSuperfactor;
                }

                if (curve.controller == 0 /* LEGACY */)
                    return constrain(angleRate * 4.1, -8190.0, 8190.0) >> 2; // Rate limit protection
                else
                    return constrain(angleRate, -1998.0, 1998.0); // Rate limit protection (deg/sec)
            };

            return calculateSetpointRate(value, curve);

        }
        else {
            var rcLookup = function(tmp, expo, rate) {
                var tmpf = tmp / 100.0;
                return ((2500.0 + expo * (tmpf * tmpf - 25.0)) * tmpf * (rate) / 2500.0 );
            }
            var rcCommand = function(rcData, rate, expo, midrc, deadband) {
                var tmp = Math.min(Math.abs(rcData - midrc), 500);
                (tmp > deadband) ? (tmp -= deadband):(tmp = 0);
                return (((rcData < midrc)?-1:1) * rcLookup(tmp, expo, rate)).toFixed(0);
            };

            var calculateRate = function (value, curve) {
                var angleRate;
                var rcInput = rcCommand(value, curve.rcRate, curve.rcExpo, midrc, deadband);

                if (curve.superExpoActive) {
                    var rcFactor = (Math.abs(rcInput) / (500.0 * (curve.rcRate) / 100.0));
                    rcFactor = 1.0 / (constrain(1.0 - (rcFactor * (curve.axisRate / 100.0)), 0.01, 1.00));

                    angleRate = rcFactor * ((27 * rcInput) / 16.0);
                } else {
                    angleRate = ((curve.axisRate + 27) * rcInput) / 16.0;
                }

                return constrain(angleRate, -8190.0, 8190.0); // Rate limit protection
            };

            return calculateRate(value, curve) >> 2; // the shift by 2 is to counterbalance the divide by 4 that occurs on the gyro to calculate the error

        };
    }

	function calculateDrawingParameters(curves, deadband, midrc) {

        var rcRate          = curves[0].rcRate || 100,
            rcExpo          = curves[0].rcExpo || 0,
            axisRate        = curves[0].axisRate || 0,
            superExpoActive = curves[0].superExpoActive || false,
            controller      = curves[0].controller || false;

		fontHeight = constrain(canvas.height / 7.5, 10, 25);
		fontFace   = fontHeight + DEFAULT_FONT_FACE;

		rcCommandMaxDegS = Math.max(
		                    Math.ceil(rcCommandRawToDegreesPerSecond(2000, curves[0], midrc, deadband)/200) * 200,
                            Math.ceil(rcCommandRawToDegreesPerSecond(2000, curves[1], midrc, deadband)/200) * 200
                            );
		rcCommandMinDegS = -rcCommandMaxDegS ;
		
		canvasHeightScale = canvas.height / Math.abs(rcCommandMaxDegS - rcCommandMinDegS);
        rcCommandMaxDegS += ' deg/s';
        rcCommandMinDegS += ' deg/s';

		
	};

    var ctx = canvas.getContext("2d");
    ctx.translate(0.5, 0.5);

    //Draw an origin line for a graph (at the origin and spanning the window)
    function drawAxisLines() {
        ctx.strokeStyle = axisColor;
        ctx.lineWidth = 1;

        // Horizontal
		ctx.beginPath();
        ctx.moveTo(-canvas.width/2, 0);
        ctx.lineTo( canvas.width/2, 0);        
        ctx.stroke();
        
        // Vertical
		ctx.beginPath();
        ctx.moveTo(0, -canvas.height/2);
        ctx.lineTo(0, canvas.height/2);        
        ctx.stroke();

    };
    function plotExpoCurve(curve, deadband, midrc) {

         var rcRate          = curve.rcRate || 100,
             rcExpo          = curve.rcExpo || 0,
             axisRate        = curve.axisRate || 0,
             superExpoActive = curve.superExpoActive || false,
             controller      = curve.controller || false;

		 ctx.save();
         ctx.strokeStyle = curve.color || "rgba(0,0,255,0.5)";
         ctx.lineWidth = 3;

         ctx.beginPath();
         ctx.moveTo(-500, -canvasHeightScale * rcCommandRawToDegreesPerSecond(1000, curve, midrc, deadband));
         for(var rcData = 1001; rcData<2000; rcData++) {
        	ctx.lineTo(rcData-midrc, -canvasHeightScale * rcCommandRawToDegreesPerSecond(rcData, curve, midrc, deadband));
	 	 }
         ctx.stroke();
         ctx.restore();
	 };
	function plotStickPosition(rcData, curve, deadband, midrc) {

        var rcRate          = curve.rcRate || 100,
            rcExpo          = curve.rcExpo || 0,
            axisRate        = curve.axisRate || 0,
            superExpoActive = curve.superExpoActive || false,
            controller      = curve.controller || false;

		 ctx.save();

         ctx.beginPath();
         ctx.fillStyle = stickColor;
         ctx.arc(rcData-midrc, -canvasHeightScale * rcCommandRawToDegreesPerSecond(rcData, curve, midrc, deadband), canvas.height / 40, 0, 2 * Math.PI);
         ctx.fill();

         
         ctx.restore();
		
	};
    function drawAxisLabel(axisLabel, x, y, align, color) {
        ctx.font = fontFace;
        ctx.fillStyle = color || axisLabelColor ;
        if(align!=null) {
            ctx.textAlign = align;
        } else {
            ctx.textAlign = 'center';
        }
        
        ctx.fillText(axisLabel, x, y);
    };
    function drawAxisLabels(midrc) {
    	
    	drawAxisLabel(rcCommandMaxDegS, 0, 0 + fontHeight * 1.5, 'left');
    	drawAxisLabel('1000', 0, canvas.height, 'left');
    	drawAxisLabel('2000', canvas.width, canvas.height, 'right');
    	drawAxisLabel(midrc, canvas.width/2, canvas.height, 'center');   	

    };

    function drawCurveValue(rcData, curve, deadband, midrc, x, y, align) {
        var rcRate          = curve.rcRate || 100,
            rcExpo          = curve.rcExpo || 0,
            axisRate        = curve.axisRate || 0,
            superExpoActive = curve.superExpoActive || false,
            controller      = curve.controller || false;

        drawAxisLabel(rcCommandRawToDegreesPerSecond(rcData, curve, midrc, deadband).toFixed(0) + " deg/s", x,y, align, curve.color);
    }
    
	// Public Functions
	this.refresh = function (rcData, curves, deadband, midrc){
        
		calculateDrawingParameters(curves, deadband, midrc);

		ctx.save();
			ctx.clearRect(0, 0, canvas.width, canvas.height);
			ctx.translate(canvas.width/2,canvas.height/2);
			drawAxisLines();
            for(var i=0; i<curves.length; i++) {
                plotExpoCurve(curves[i], deadband, midrc);
                plotStickPosition(rcData, curves[i], deadband, midrc);
            }
		ctx.restore();
		drawAxisLabels(midrc);
        drawCurveValue(rcData, curves[0], deadband, midrc, 0,canvas.height/2 + fontHeight/2, 'left')
        drawCurveValue(rcData, curves[1], deadband, midrc, canvas.width,canvas.height/2 + fontHeight/2, 'right')
	};

    // Initialisation Code

	// Set the canvas coordinate system to match the rcData/rcCommand outputs
	canvas.width  = 1000; canvas.height=1000;

	var that = this;
	that.refresh(rcData, curves, deadband, midrc);
	

}


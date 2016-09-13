/** 
	Expo Chart Drawing function
	
**/

"use strict";

const optional = false;

function ChartTest() {
	
	var canvas = $("#graphCanvas").get(0);

    var curves = [
            {
                version         : 2.9, // betaflight version
                rcRate          : 100,
                rcExpo          : 0,
                axisRate        : 70,
                superExpoActive : true,
                yawActive       : null,
                controller      : null,
                rcExpoPwr       : null,
                sRateWeight     : null,
                color           : "rgba(0,0,200,0.9)" // blue
            },
            {
                version         : 3.0, // betaflight version
                rcRate          : 120,
                rcExpo          : 0,
                rcExpoPwr       : 3,
                sRateWeight     : 100,
                axisRate        : 0,
                superExpoActive : null,
                yawActive       : false,
                controller      : 1,
                color           : "rgba(0,200,0,0.9)" // green
            }
        ];

    // Common Values
    var rcData = 1750;
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
            sRateWeight:        $('#sRateWeight-new'),
            sRateWeightSlider:  $('#sRateWeight-new-slider'),
            controller:         $('#controller-new'),
            yawActive:          $('#yawActive-new'),
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
        convertLocaltoUI();

        expoChart = new ExpoChart(canvas, rcData, curves, deadband, midrc);

	});

    function convertLocaltoUI() {

        oldElements.rcRate.val(curves[0].rcRate/100);
        oldElements.rcRateSlider.val(curves[0].rcRate/100);
        oldElements.rcExpo.val(curves[0].rcExpo/100);
        oldElements.rcExpoSlider.val(curves[0].rcExpo/100);
        oldElements.axisRate.val(curves[0].axisRate/100);
        oldElements.axisRateSlider.val(curves[0].axisRate/100);
        oldElements.superExpoActive.prop('checked', curves[0].superExpoActive);

        newElements.rcRate.val(curves[1].rcRate/100);
        newElements.rcRateSlider.val(curves[1].rcRate/100);
        newElements.rcExpo.val(curves[1].rcExpo/100);
        newElements.rcExpoSlider.val(curves[1].rcExpo/100);
        newElements.axisRate.val(curves[1].axisRate/100);
        newElements.axisRateSlider.val(curves[1].axisRate/100);
        newElements.sRateWeight.val(curves[1].sRateWeight/100);
        newElements.sRateWeightSlider.val(curves[1].sRateWeight/100);
        newElements.controller.val(curves[1].controller);
        newElements.yawActive.prop('checked', curves[1].yawActive);

        commonElements.rcData.val(rcData);
        commonElements.rcDataSlider.val(rcData);
        commonElements.deadband.val(deadband);
        commonElements.midrc.val(midrc);

    }

    function convertUItoLocal() {

        curves[0].rcRate = parseFloat(oldElements.rcRate.val()) * 100;
        curves[0].rcExpo = parseFloat(oldElements.rcExpo.val()) * 100;
        curves[0].axisRate = parseFloat(oldElements.axisRate.val()) * 100;
        curves[0].superExpoActive = oldElements.superExpoActive.is(":checked");

        curves[1].rcRate = parseFloat(newElements.rcRate.val()) * 100;
        curves[1].rcExpo = parseFloat(newElements.rcExpo.val()) * 100;
        curves[1].axisRate = parseFloat(newElements.axisRate.val()) * 100;
        curves[1].controller = parseInt(newElements.controller.val());
        curves[1].yawActive = newElements.yawActive.is(":checked");

        rcData = parseInt(commonElements.rcData.val());
        deadband = parseInt(commonElements.deadband.val());
        midrc = parseInt(commonElements.midrc.val());

    };

    // Hide optional components
    (optional)?$(".optional").show():$(".optional").hide();

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
            curves[0].rcRate = parseFloat(oldElements.rcRateSlider.val())*100;
            oldElements.rcRate.val(curves[0].rcRate/100);
            expoChart.refresh(rcData, curves, deadband, midrc);
        });

    oldElements.rcExpoSlider.on('input',
        function (e) {
            e.preventDefault();
            curves[0].rcExpo = parseFloat(oldElements.rcExpoSlider.val())*100;
            oldElements.rcExpo.val(curves[0].rcExpo/100);
            expoChart.refresh(rcData, curves, deadband, midrc);
        });

    oldElements.axisRateSlider.on('input',
        function (e) {
            e.preventDefault();
            curves[0].axisRate = parseFloat(oldElements.axisRateSlider.val())*100;
            oldElements.axisRate.val(curves[0].axisRate/100);
            expoChart.refresh(rcData, curves, deadband, midrc);
        });

    newElements.rcRateSlider.on('input',
        function (e) {
            e.preventDefault();
            curves[1].rcRate = parseFloat(newElements.rcRateSlider.val())*100;
            newElements.rcRate.val(curves[1].rcRate/100);
            expoChart.refresh(rcData, curves, deadband, midrc);
        });

    newElements.rcExpoSlider.on('input',
        function (e) {
            e.preventDefault();
            curves[1].rcExpo = parseFloat(newElements.rcExpoSlider.val())*100;
            newElements.rcExpo.val(curves[1].rcExpo/100);
            expoChart.refresh(rcData, curves, deadband, midrc);
        });

    newElements.axisRateSlider.on('input',
        function (e) {
            e.preventDefault();
            curves[1].axisRate = parseFloat(newElements.axisRateSlider.val())*100;
            newElements.axisRate.val(curves[1].axisRate/100);
            expoChart.refresh(rcData, curves, deadband, midrc);
        });

    newElements.sRateWeightSlider.on('input',
        function (e) {
            e.preventDefault();
            curves[1].sRateWeight = parseFloat(newElements.sRateWeightSlider.val())*100;
            newElements.sRateWeight.val(curves[1].sRateWeight/100);
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


    newElements.yawActive.click(function(e) {
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
                    if (optional) {
                        if (curve.controller == 1 /* BETAFLIGHT */) {
                            var ptermSetpointRate = constrain(angleRate * rcSuperfactor, -1998.0, 1998.0);
                            if (curve.sRateWeight < 100 && !curve.yawActive) {
                                const pWeight = curve.sRateWeight / 100.0;
                                angleRate = angleRate + (pWeight * ptermSetpointRate - angleRate);
                            } else {
                                angleRate = ptermSetpointRate;
                            }
                        } else {
                            angleRate *= rcSuperfactor;
                       }
                    } else
                    {
                        angleRate *= rcSuperfactor; // remove this if you want to display the pterm weighting.
                    }
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
                            -Math.floor(rcCommandRawToDegreesPerSecond(1000, curves[0], midrc, deadband)/200) * 200,
                            Math.ceil(rcCommandRawToDegreesPerSecond(2000, curves[1], midrc, deadband)/200) * 200,
                            -Math.floor(rcCommandRawToDegreesPerSecond(1000, curves[1], midrc, deadband)/200) * 200
                            );
		rcCommandMinDegS = -rcCommandMaxDegS;

		canvasHeightScale = canvas.height / Math.abs(rcCommandMaxDegS - rcCommandMinDegS);
        rcCommandMaxDegS += ' deg/s';
        rcCommandMinDegS += ' deg/s';

		
	};

    var ctx = canvas.getContext("2d");
    ctx.translate(0.5, 0.5);

    this.balloon = function(units, fontSize, color, fill, border, align) {

        const DEFAULT_FONT_FACE     = "pt Verdana, Arial, sans-serif";
        const DEFAULT_FONT_SIZE     = 24;
        const DEFAULT_COLOR         = "rgba(255,102,102,0.5)";
        const DEFAULT_BORDER        = "rgba(255,102,102,1.0)";
        const DEFAULT_TEXT_COLOR    = "rgba(0,0,0,1.0)";
        const DEFAULT_TEXT_ALIGN    = "center";
        const DEFAULT_TEXT_LABEL    = "none";
        const DEFAULT_OFFSET        = 50;       // balloon label is drawn this far left/right of the x coordinate (balloon pointer goes to the x coordinate)
        const DEFAULT_ALIGN         = "right";  // whether the ballon label is drawn to the right or left of the pointer; right align puts the label to the left of the x coord

        var
            units       = units,
            fontSize    = fontSize,
            color       = color,
            fill        = fill,
            border      = border,
            align       = align,
            x           = null,
            y           = null,
            width       = null,
            height      = null;

        function drawBalloonBackground(ctx, x, y, width, height, radius, fill, stroke, align) {

            ctx.fillStyle   = fill      || DEFAULT_COLOR ;
            ctx.strokeStyle = stroke    || DEFAULT_BORDER;

            if(align=='left') x += DEFAULT_OFFSET;

            if (typeof stroke == 'undefined') {
                stroke = true;
            }
            if (typeof radius === 'undefined') {
                radius = 5;
            }
            if (typeof radius === 'number') {
                radius = {tl: radius, tr: radius, br: radius, bl: radius};
            } else {
                var defaultRadius = {tl: 0, tr: 0, br: 0, bl: 0};
                for (var side in defaultRadius) {
                    radius[side] = radius[side] || defaultRadius[side];
                }
            }

            var pointerLength =  (height - radius.br - radius.tr) / 6;

            ctx.beginPath();
            ctx.moveTo(x + radius.tl, y);
            ctx.lineTo(x + width - radius.tr, y);
            ctx.quadraticCurveTo(x + width, y, x + width, y + radius.tr);

            if(align=='right') {
                ctx.lineTo(x + width, y + radius.tr + pointerLength);
                ctx.lineTo(x + width + DEFAULT_OFFSET, y + height / 2);
                ctx.lineTo(x + width, y + height - radius.br - pointerLength);
            }
            ctx.lineTo(x + width, y + height - radius.br);

            ctx.quadraticCurveTo(x + width, y + height, x + width - radius.br, y + height);
            ctx.lineTo(x + radius.bl, y + height);
            ctx.quadraticCurveTo(x, y + height, x, y + height - radius.bl);

            if(align=='left') {
                ctx.lineTo(x, y + height - radius.bl - pointerLength);
                ctx.lineTo(x - DEFAULT_OFFSET, y + height / 2);
                ctx.lineTo(x, y + radius.tl - pointerLength);
            }
            ctx.lineTo(x, y + radius.tl);

            ctx.quadraticCurveTo(x, y, x + radius.tl, y);
            ctx.closePath();

            ctx.fill();
            ctx.stroke();
        }
        function drawLabel(label, x, y, fontSize, align, color) {
            ctx.font        = (fontSize || DEFAULT_FONT_SIZE) + DEFAULT_FONT_FACE;
            ctx.fillStyle   = color || DEFAULT_TEXT_COLOR ; // default is black
            ctx.textAlign   = align || DEFAULT_TEXT_ALIGN;  // default is to center
            ctx.fillText(label, x, y);
        }


        this.boundingBox = function() {
            // return the corners of the box that completely encloses the balloon
            return {left: (x), right: (x+width), top: (y), bottom: (y+height)};
        };

        this.collidesWith = function(externalBoundingBox) {
            // return true when any point of the supplied externalBoundingBox is inside this balloons bounding box
            return (
                (externalBoundingBox.left >= this.boundingBox.left && externalBoundingBox.left <= this.boundingBox.right && externalBoundingBox.top >= this.boundingBox.top && externalBoundingBox.top <= this.boundingBox.bottom) ||
                (externalBoundingBox.right >= this.boundingBox.left && externalBoundingBox.right <= this.boundingBox.right && externalBoundingBox.top >= this.boundingBox.top && externalBoundingBox.top <= this.boundingBox.bottom) ||
                (externalBoundingBox.left >= this.boundingBox.left && externalBoundingBox.left <= this.boundingBox.right && externalBoundingBox.bottom >= this.boundingBox.top && externalBoundingBox.bottom <= this.boundingBox.bottom) ||
                (externalBoundingBox.right >= this.boundingBox.left && externalBoundingBox.right <= this.boundingBox.right && externalBoundingBox.bottom >= this.boundingBox.top && externalBoundingBox.bottom <= this.boundingBox.bottom)
            );
        };

        this.draw = function (ctx, x, y, value, range) {

            /**
             ctx is the canvas context
             value is the balloon value to display
             units is the engineering units
             range is the (maximum value - minimum value) that is displayed on the canvas
             fontSize is the fontheight
             x, y is the center of the balloon
             color is the text color of the label
             fill is the color of the balloon
             border is the color of the balloon border
             align set to "right" for the label to appear LEFT of the x coordinate.
             **/

            var label = (value + ' ' + units) || DEFAULT_TEXT_LABEL;

            var canvasHeightScale = ctx.canvas.height / range;

            ctx.save();

            // calculate the drawing parameters
            this.width      = (ctx.measureText(label).width * 1.2);
            this.height     = fontSize * 2 || DEFAULT_FONT_SIZE;
            this.x          = x - ((align=="right")?(this.width + DEFAULT_OFFSET):0);
            this.y          = -canvasHeightScale * y || 0;

            // prevent label going off page
            if(this.y < (-ctx.canvas.height + this.height)/2 ) this.y = (-ctx.canvas.height + this.height)/2;
            if(this.y > (+ctx.canvas.height - this.height)/2 ) this.y = (+ctx.canvas.height - this.height)/2;

            // draw the balloon and its label
            drawBalloonBackground(ctx, this.x, this.y - this.height/2, this.width, this.height, 14, fill, border, align);
            drawLabel(label, this.x + this.width/2 + ((align=="left")?DEFAULT_OFFSET:0), this.y + (this.height - fontSize)/2, fontSize, "center", color, align);
            ctx.restore();
        }
    };
    this.balloons = {

        oldRates : new this.balloon(" deg/s", 24, "rgba(0,0,0,1)", "rgba(0,0,255,0.4)", "rgba(0,0,255,1)", "left"),
        newRates : new this.balloon(" deg/s", 24, "rgba(0,0,0,1)", "rgba(0,200,0,0.4)", "rgba(0,200,0,1)", "right"),

        maxOldRatesValue : null,
        maxNewRatesValue : null,
        valueRange : null,

        plot: function(oldRate, newRate, rangeRate) { // old rate calcualtion maximum value, new rate maximum value and current chart range in deg/s

            this.maxOldRatesValue = oldRate;
            this.maxNewRatesValue  = newRate;
            this.valueRange = rangeRate;

            // Actually plot the two balloons on the rate curve.
            this.oldRates.draw(ctx, -500, -this.maxOldRatesValue, this.maxOldRatesValue.toFixed(0), this.valueRange);  // (canvas context, x, y, value, range)
            this.newRates.draw(ctx,  500,  this.maxNewRatesValue, this.maxNewRatesValue.toFixed(0), this.valueRange);  // (canvas context, x, y, value, range)
        }

    };

    //Draw an origin line for a graph (at the origin and spanning the window)
    function drawAxisLines(midrc) {
        ctx.strokeStyle = axisColor;
        ctx.lineWidth = 1;

        // Horizontal
		ctx.beginPath();
        ctx.moveTo(-canvas.width/2, 0);
        ctx.lineTo( canvas.width/2, 0);        
        ctx.stroke();
        
        // Vertical
		ctx.beginPath();
        ctx.moveTo((midrc-1500), -canvas.height/2);
        ctx.lineTo((midrc-1500), canvas.height/2);
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
        	ctx.lineTo(rcData-1500/*-midrc*/, -canvasHeightScale * rcCommandRawToDegreesPerSecond(rcData, curve, midrc, deadband));
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
         ctx.arc(rcData-1500/*-midrc*/, -canvasHeightScale * rcCommandRawToDegreesPerSecond(rcData, curve, midrc, deadband), canvas.height / 40, 0, 2 * Math.PI);
         ctx.fill();

         
         ctx.restore();
		
	};
    function drawAxisLabel(axisLabel, x, y, align, color) {

        ctx.fillStyle = color || axisLabelColor ;
        if(align!=null) {
            ctx.textAlign = align;
        } else {
            ctx.textAlign = 'center';
        }
        
        ctx.fillText(axisLabel, x, y);
    };
    function drawAxisLabels(midrc) {

        ctx.font = fontFace;
        drawAxisLabel(rcCommandMaxDegS, 0, 0 + fontHeight * 1.5, 'left');
    	drawAxisLabel('1000', 0, canvas.height, 'left');
    	drawAxisLabel('2000', canvas.width, canvas.height, 'right');
    	drawAxisLabel(midrc, (midrc-1000)/*canvas.width/2*/, canvas.height, 'center');

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
            // Scaled in real deg/s units
			ctx.clearRect(0, 0, canvas.width, canvas.height);
			ctx.translate(canvas.width/2,canvas.height/2);
			drawAxisLines(midrc);
            for(var i=0; i<curves.length; i++) {
                plotExpoCurve(curves[i], deadband, midrc);
                plotStickPosition(rcData, curves[i], deadband, midrc);
            }

            this.balloons.plot(rcCommandRawToDegreesPerSecond(2000, curves[0], midrc, deadband),     // Old Rate Maximum value
                          rcCommandRawToDegreesPerSecond(2000, curves[1], midrc, deadband),     // New Rate Maximum Value
                          Math.abs(parseInt(rcCommandMaxDegS) - parseInt(rcCommandMinDegS)));   // Range shown on the chart


        ctx.restore();

        // Scaled in real canvas units
        drawAxisLabels(midrc);
        drawCurveValue(rcData, curves[0], deadband, midrc, 0,canvas.height/2 + fontHeight/2, 'left');
        drawCurveValue(rcData, curves[1], deadband, midrc, canvas.width,canvas.height/2 + fontHeight/2, 'right');

	};

    // Initialisation Code

	// Set the canvas coordinate system to match the rcData/rcCommand outputs
	canvas.width  = 1000; canvas.height=1000;

	var that = this;
	that.refresh(rcData, curves, deadband, midrc);
    that.refresh(rcData, curves, deadband, midrc); // fix it so the labels appear correctly


}


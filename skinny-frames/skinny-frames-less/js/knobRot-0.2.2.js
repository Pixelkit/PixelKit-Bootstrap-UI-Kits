(function( $ ) {

	var methods = {
		
		init: function( options ) {

			// Lets have some default settings
			var settings = $.extend({			
			
				// The default class - over-ride this for different knob styles
				classes: ['rot-knob'],
						
				// The number of frames in the knob image				
				frameCount: 64,
				
				// The dimensions of the source frame in PX				
				frameWidth: 64,
				frameHeight: 64,				
							
				// The value range				
				minimumValue: -100,
				maximumValue: 100,				
							
				// If detent is true, detentValue specifies the snap value				
				// detentThreshold specifies the value range either side that
				// will 'snap' to the detentValue
				detent: false,	
				detentValue: 0,
				detentThreshold: 10,
				
				// If the knob has a discrete number of steps, how many?
				// Discrete steps can be used for things like a switch you can drag
				// on or off, etc.				
				discreteSteps: false,
				stepCount: 2,
				
				// If dragVertical is false, horizontal dragging modifies the value				
				dragVertical: true,
				
				// Invert the direction of the change
				invertDirection: false,				
			
				// The speed at which the knob value changes when dragged 
				// Higher numbers equal faster drag speed				
				dragMultiplier: 1,							
			
				// The FPS of the knob animation
				animationFPS: 25,
				
				// Whether or not to hide the associated input element
				hideInput: false,
				
				// Whether or not to hide the real value field
				hideRealValue: true,				
				
				// If isToggle is true, rather than dragging to change the value
				// you simply click to toggle between max and min - all other settings
				// to do with detenting and steps will be ignored - step count will
				// be forced to true
				// Not yet implemented
				isToggle: true, 

				//Basic callback on refresh
				callback: function() { }
			
			}, options );
			
			//Init body data
			$('body').data('knobRot', {dragging: false});
			
			//Add custom CSS			
			methods.addCssStyles();

			return this.each(function() {
				
				// Perform a sanity check
				if ( settings.minimumValue >= settings.maximumValue ) {
				} else if ( settings.discreteSteps == true && settings.stepCount <= 1 ) {
					throw 'Knob range error: Maximum value must be greater than minimum value.';
					throw 'Invalid step count: Discrete knob must have a minimum of 2 steps.';
				} 					
				
				// Buffer the knob element
				var $this = $(this);
				
				// Apply the settings callback
				$this.callback = settings.callback;
				
				// Disable autocomplete
				//$this.attr('autocomplete','off');
				
				// knobRot currently only works with text inputs				
				if ($this.is('input:text')) {					
				
					// Create a second text field for real value processing
					// This field is where the behind-the-scenes floating point value of
					// the knob is stored.
					var realValueField = $('<input>', {
						'type': 'text',
						'value': parseFloat($this.val())
						//'autocomplete':'off'
					});

					//Set initial data values
					realValueField.data('knobRot', {
						'settings': settings,
						'outputField': $this
					});					
					
					// Attach the real value field to the dom
					$this.after(realValueField);				
									
					//Calculate some range offsets
					realValueField.data('knobRot').rangeSize = settings.maximumValue - settings.minimumValue;
					realValueField.data('knobRot').rangeOffset = 0 - settings.minimumValue;					
					
					//Determine the step increment amount					
					if ( settings.discreteSteps == true ) {					
						realValueField.data('knobRot').stepIncrement = (settings.maximumValue - settings.minimumValue) / ( settings.stepCount - 1 );
					}
					
					//Calculate the initial value
					realValueField.data('knobRot').calculatedValue = methods.calculateValue(realValueField);
					
					//Calculate the initial frame offset
					realValueField.data('knobRot').currentFrame = methods.calculateFrame(realValueField);	
					
					//Flag to indicate whether or not to refresh the knob value and graphics
					realValueField.data('knobRot').dirtyData = true;
					
					//Calculate the frame delay
					var updateDelay = 1000 / settings.animationFPS;								

					//Create knob graphic div - build the classes string too					
					var classes = settings.classes.slice();
					classes[classes.length] = 'rot-knob-base';
					var forName = $this.attr('name');
					if (typeof(forName) == 'undefined') {
						forName = 'unnamed';
					}
					var forId = $this.attr('id');
					if (typeof(forId) == 'undefined') {
						forId = 'noid';
					}
					classes[classes.length] = 'for-input-' + forName + '-' + forId;
					var knobDiv = $('<div>', { 
						'class': classes.join(' ')
					});				
					
					// Link the three fields together				
					knobDiv.data('knobRot', { 
						'realValue': realValueField,
						'outputField': $this
					});
					
					realValueField.data('knobRot').knobDiv = knobDiv;

					$this.data('knobRot', { 
						'knob': knobDiv,
						'realValue': realValueField
					});					
					
					//Set the style of the grahic div to some sensible defaults
					knobDiv.css({
						'width': settings.frameWidth + 'px',
						'height': settings.frameHeight + 'px',
						'background-position': methods.calculateBackgroundOffsetX( realValueField ) + 'px 0px',
						'cursor': methods.getDragCursorClass( realValueField )
					});					
										
					//Bind drag events to the knob div
					knobDiv.on('mousedown.knobRot', function( event ) {
						
						//Only use the main mouse button for mousedown events
						if (event.which != 1) {
							return;
						}
						
						$knobDiv = $(this);

						// Make sure we're only dragging once
						if ( $('body').data('knobRot').dragging != true ) {
												
							var startOffset = {
								'left': event.screenX,
								'top': event.screenY
							};						

							// Add drag class
							$knobDiv.addClass('dragging');							
							
							// Flag the drag
							$('body').data('knobRot').dragging = true;							
							$('body').data('knobRot').lastOffset = startOffset;
							$('body').data('knobRot').knobDiv = $knobDiv;		
							
							// Set the drag cursor
							$('body').addClass(methods.getDragCursorClass($knobDiv.data('knobRot').realValue));
							
							// Trigger some events
							$knobDiv.data('knobRot').outputField.trigger('knobdragstart', $knobDiv);
						}
					});

					// Handle dragging
					$(document).on('mousemove.knobRot', function( event ) {
					
						if ( $('body').data('knobRot').dragging == true ) {
												
							//Calculate the distance moved
							var displacement = {
								'horizontal': event.screenX - $('body').data('knobRot').lastOffset.left,
								'vertical': event.screenY - $('body').data('knobRot').lastOffset.top
							}														

							//Update the drag container's last offser
							$('body').data('knobRot').lastOffset = {
								'left': event.screenX,
								'top': event.screenY
							}
							
							//Update the knob's field with the displaced value
							methods.updateValue( $('body').data('knobRot').knobDiv.data('knobRot').realValue, displacement );
							
							$('body').data('knobRot').knobDiv.data('knobRot').outputField.trigger('knobrefresh', $('body').data('knobRot').knobDiv);
							$('body').data('knobRot').knobDiv.data('knobRot').outputField.trigger('knobdrag', $('body').data('knobRot').knobDiv);							
						}																
					});
					
					// Stop dragging on mouse up or context menu
					$(document).on('mouseup.knobRot', function() {
						methods.stopDrag();
					});					
									
					// Disable document selection if a drag is in progress
					$('body').on('selectstart.knobRot select.knobRot mousedown.knobRot mouseover.knobRot',function(){			
						if ($('body').data('knobRot').dragging == true) {
							return false;
						}
					});
					
					// Handle knob value change events
					$this.on('knobrefresh.knobRot', function() {
					
						//Execute the custom callback
						$this.callback();
						
						//Do the dirty
						realValueField.data('knobRot').dirtyData = true;
					});
					
					// Force a refresh of values on certain events					
					knobDiv.on('mouseover.knobRot mouseout.knobRot mouseup.knobRot', function() {
						knobDiv.data('knobRot').outputField.trigger('knobrefresh', knobDiv);
					});
					
					// Handle hovering
					knobDiv.on('mouseover', function() {
						$this.addClass('hover');
						var cursorClass = methods.getDragCursorClass(knobDiv.data('knobRot').realValue);						
						knobDiv.addClass(cursorClass);
						// Trigger some events
						knobDiv.data('knobRot').outputField.trigger('knobmouseover', knobDiv);	
					});
					knobDiv.on('mouseout', function() {
						$this.removeClass('hover');						
						var cursorClass = methods.getDragCursorClass(knobDiv.data('knobRot').realValue);						
						knobDiv.removeClass(cursorClass);
						knobDiv.data('knobRot').outputField.trigger('knobmouseout', knobDiv);	
					});					
					
					//Insert the knob graphic div
					realValueField.after(knobDiv);
					
					//Register update callbacks
					setInterval( function() { methods.updateCallback(realValueField);	}, updateDelay );
					
					//Hide the input fields
					if (settings.hideInput == true) {
						$this.hide();
					}
					
					//Hide the input fields
					if (settings.hideRealValue == true) {
						realValueField.hide();					
					}										
					
					//Disable text entry
					$this.attr('disabled','disabled');
					$this.attr('unselectable','on');
					$this.on('mousedown', function() {return false;});
					$this.on('mouseover', function() {return false;});
					
					//Trigger knob ready events
					$this.trigger('knobrefresh', knobDiv);					
					$this.trigger('knobready', knobDiv);
				}				
			});
		}, 
		 /**
		  * Returns the calculated value of the knob
		  */
		getvalue: function() {
			$this = $(this);
			if ($this.is('input:text')) {
				if ($this.data('knobRot')) {
					return $this.data('knobRot').calculatedValue;
				} else {
					throw 'Can not call "value" on a non-knobRot element';
				}
			} else {
				throw 'Not a valid input element for knobRot.getvalue';
			}
		 },	
		/**
		 * Set the value of the knob element
		 */
		set: function( value ) {
			return $(this).each( function() {
				var $this = $(this);
				if ($this.is('input:text')) {
					$this.data('knobRot').realValue.val( parseFloat(value) );
					$this.data('knobRot').realValue.trigger('knobrefresh');
				}
			});
		},
		/**
		 * Calculates the step of a knob (accounting for detent,
		 * ranges, steps, etc.)
		 * Only really makes sense if discreteSteps is true in the
		 * knob settings, throws an exception if this is not the case.
		 */
		calculateStep: function( $realValueField ) {
			var knobData = $realValueField.data('knobRot');
			var knobSettings = knobData.settings;
			
			if ( knobSettings.discreteSteps ) {				
				
				// Shift the value ranges to be positive numbers starting from 0
				var adjustedValue = parseFloat($realValueField.val()) + knobData.rangeOffset;

				// Calculate the fraction of the range the current value represents
				var rangeFraction = adjustedValue / knobData.rangeSize;

				// Calculate the step the range fraction represents			
				var calculatedStep = Math.round( rangeFraction * ( knobSettings.stepCount - 1) );

				// Win!
				return calculatedStep;
			
			} else {
				throw 'Unable to calculate discrete step offset for non-discrete knob.';
			}			
		},
		/**
		 * Calculates the value of a knob, taking step settings 
		 * and detenting into account
		 */
		 calculateValue: function( $realValueField ) {

			var knobData = $realValueField.data('knobRot');
			var knobSettings = knobData.settings;

			if ( knobSettings.discreteSteps == true ) {			
			
				// Work out the current step
				var currentStep = methods.calculateStep( $realValueField );

				// Caluclate the current value based on the increment value
				// and current step value
				var calculatedValue = currentStep * knobData.stepIncrement - knobData.rangeOffset;
				
			} else {
				var calculatedValue = parseFloat($realValueField.val());
			}
			
			// Determine if value is to be detented			
			if ( knobSettings.detent == true && calculatedValue >= knobSettings.detentValue - knobSettings.detentThreshold && calculatedValue <= knobSettings.detentValue + knobSettings.detentThreshold ) {			

				//Determine if we're "enteringdetent"
				if ($realValueField.data('knobRot').calculatedValue != calculatedValue 
				&& ($realValueField.data('knobRot').calculatedValue < knobSettings.detentValue - knobSettings.detentThreshold
				||  $realValueField.data('knobRot').calculatedValue > knobSettings.detentValue + knobSettings.detentThreshold)) {

					//Trigger an event
					$realValueField.data('knobRot').outputField.trigger('knobenterdetent', $realValueField.data('knobRot').knobDiv);
				}
			
				//Detent the value
				calculatedValue = knobSettings.detentValue;
				
			} else if ($realValueField.data('knobRot').calculatedValue ==  knobSettings.detentValue 
						&& $realValueField.data('knobRot').calculatedValue != calculatedValue 
						&&  calculatedValue != knobSettings.detentValue) 	
			{
			
					//Trigger an event
					$realValueField.data('knobRot').outputField.trigger('knobleavedetent', $realValueField.data('knobRot').knobDiv);
			}
								
			// Clamp value to minimum and maximum
			if ( calculatedValue < knobSettings.minimumValue ) {
			
				//Limit the input field's value
				$realValueField.val( knobSettings.minimumValue );	

				//Trigger an event
				$realValueField.data('knobRot').outputField.trigger('knobvaluemin', $realValueField.data('knobRot').knobDiv);
				
				return knobSettings.minimumValue;
			} else if ( calculatedValue > knobSettings.maximumValue ) {
			
				//Limit the input field's value
				$realValueField.val( knobSettings.maximumValue );
				
				//Trigger an event
				$realValueField.data('knobRot').outputField.trigger('knobvaluemax', $realValueField.data('knobRot').knobDiv);
				
				return knobSettings.maximumValue;
			}
					
			return calculatedValue;
		 },
		 /**
		  * Calculates the current animation frame of the knob
		  */
		calculateFrame: function( $realValueField ) {
			
			var knobData = $realValueField.data('knobRot');
			var knobSettings = knobData.settings;			
			
			//Use the calculated value as it accounts for steps and
			//detenting, adjusted for range offset
			var calculatedValue = methods.calculateValue( $realValueField ) + knobData.rangeOffset;

			//Work out the fraction of the current value over the range
			var rangeFraction = calculatedValue / knobData.rangeSize;
			
			//Work out the frame
			var calculatedFrame = Math.round(rangeFraction * (knobSettings.frameCount - 1));

			//Clamp values
			if (calculatedFrame > (knobSettings.frameCount - 1)) {
				return (knobSettings.frameCount - 1);
			} else if (calculatedFrame < 0) {
				return 0;
			}
			
			//Trigger a frame change event
			if ($realValueField.data('knobRot').currentFrame != calculatedFrame) {
				$realValueField.data('knobRot').outputField.trigger('knobframechange', [knobData, $realValueField.data('knobRot').currentFrame, calculatedFrame]);
			}
			
			return calculatedFrame;
			
		},
		/**
		 * Work out the background position
		 */
		calculateBackgroundOffsetX: function( $realValueField ) {
			var knobData = $realValueField.data('knobRot');
			var knobSettings = knobData.settings;	
			return 0 - methods.calculateFrame( $realValueField ) * knobSettings.frameWidth;
		},
		/**
		 * Animation callback
		 */
		updateCallback: function( $realValueField ) {
		
			// Refresh the knob graphics and values if required
			if ($realValueField.data('knobRot').dirtyData == true) {
				$realValueField.data('knobRot').dirtyData = false;
				$realValueField.data('knobRot').knobDiv.css('background-position',  methods.calculateBackrgroundOffset( $realValueField ) );
				$realValueField.data('knobRot').calculatedValue = methods.calculateValue( $realValueField );
				$realValueField.data('knobRot').outputField.val($realValueField.data('knobRot').calculatedValue);				
				$realValueField.data('knobRot').outputField.data('knobRot').calculatedValue = $realValueField.data('knobRot').calculatedValue;
			}
		},
		/**
		 * For internal use only, removes the container used for dragging
		 * knobs
		 */
		stopDrag: function() {
			
			if ($('body').data('knobRot').dragging == true) {
				
				//Traverse the drag container's data to find the
				//associated knob
				var $knobDiv = $('body').data('knobRot').knobDiv;
				
				//Unflag the drag on the knob
				$('body').data('knobRot').dragging = false;
							
				// Remove drag class
				$knobDiv.removeClass('dragging');				
				
				//Set the drag cursor
				$('body').removeClass(methods.getDragCursorClass($knobDiv.data('knobRot').realValue));
				
				//Trigger a value update event
				$knobDiv.data('knobRot').outputField.trigger('knobrefresh');
			}
		},
		/**
		 * Updates a field's value given a top / left displacement
		 */
		 updateValue: function( $realValueField, displacement) {
			var change = 0;
			
			// Switch between horizontal and vertical dragging depending on
			// defined settings
			if ($realValueField.data('knobRot').settings.dragVertical) {
				change = displacement.vertical;
			} else {
				change = displacement.horizontal;
			}
			
			// Apply the multiplier
			change = change * $realValueField.data('knobRot').settings.dragMultiplier;
			
			// Apply inversion if set (we sneakily flip the user's choice if
			// we're doing vertical dragging, as most people see "up" as 
			// increasing value wheras in screen-space up is a decrease in 
			// pixel position.
			
			if ((!$realValueField.data('knobRot').settings.invertDirection && $realValueField.data('knobRot').settings.dragVertical == true)
			|| ($realValueField.data('knobRot').settings.invertDirection && $realValueField.data('knobRot').settings.dragVertical == false)) {
				change = 0 - change;
			}
			
			//Get the current field value
			var currentValue = parseFloat($realValueField.val());		
			
			//Calculate the new value
			var newValue = currentValue + change;
			
			//Clamp the new value to the defined limits
			if (newValue > $realValueField.data('knobRot').settings.maximumValue) {
				newValue = $realValueField.data('knobRot').settings.maximumValue;
			} else if (newValue < $realValueField.data('knobRot').settings.minimumValue) {
				newValue = $realValueField.data('knobRot').settings.minimumValue;
			}
						
			//Set the new value
			$realValueField.val(newValue);
		 },
		 /**
		  * Returns the hover or drag Y offset for the background image
		  * If background-offset-x and y were in the specs, hover and drag 
		  * effects would each require one line of CSS instead of this ugly
		  * jQuery workaround which is prone to breakage when events go missing
		  * and gives designers and developers less flexibility when designing
		  * buttons.  And it's slower.  I'm sure they had their reasons...
		  */
		calculateBackrgroundOffset: function( $realValueField ) {
			
			//Calculate the X offsey
			var offsetX = methods.calculateBackgroundOffsetX( $realValueField ) + 'px';
			var offsetY = "0px";

			//Calculate the Y offset for hover events
/*			if ($realValueField.data('knobRot').outputField.hasClass('hover') && $('body').data('knobRot').dragging == false) {
				offsetY = (0 - $realValueField.data('knobRot').settings.frameHeight) + "px";
			}
			
			//If we're dragging and we're dragging the right element, select the dragging graphics
			if ($('body').data('knobRot').dragging == true && $realValueField.is($('body').data('knobRot').knobDiv.data('knobRot').realValue)) {
				offsetY = (0 - $realValueField.data('knobRot').settings.frameHeight * 2 ) + "px";
			}*/

			return offsetX + " " + offsetY;

		},
		/**
		 * Determine whether a vertical or horizontal cursor should be userd
		 */
		getDragCursorClass: function( $realValueField ) {
			if ($realValueField.data('knobRot').settings.dragVertical == true ) {
				return 'rotknob-n-resize';
			} else {
				return 'rotknob-e-resize';
			}		
		},
		/**
		 * Adds plugin-specific CSS styles to the document
		 */
		addCssStyles: function() {
			var styleElement = $(
				'<style type="text/css" rel="stylesheet">' +
				'	.rotknob-n-resize{ cursor: n-resize!important; }' +
				'	.rotknob-e-resize{ cursor: e-resize!important; }' +			
				'</style>'
			).appendTo('body');
		}
	};	
	/**
	 * Delegate method execution
	 */
	$.fn.knobRot = function( method ) {
		if ( methods[method] ) {
			return methods[method].apply( this, Array.prototype.slice.call( arguments, 1 ));
		} else if ( typeof method === 'object' || ! method ) {
			return methods.init.apply( this, arguments );
		} else {
			$.error( 'Method ' +  method + ' does not exist on jQuery.knobRot' );
		}    			
	};	
})( jQuery );

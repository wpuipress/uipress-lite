import { defineAsyncComponent } from '../../../libs/vue-esm.js';
import { parseGradient } from '../libs/gradient-parser.min.js';

export default {
  components: {
    contextmenu: defineAsyncComponent(() => import('../utility/contextmenu.min.js?ver=3.3.1')),
  },
  props: {
    value: String,
    returnData: Function,
  },
  data() {
    return {
      grad: this.value,
      dragging: null,
      mouseDown: false,
      gradientHover: false,
      controlhover: false,
      controlNewx: 0,
      strings: {
        colour: __('Colour', 'uipress-lite'),
        deleteStop: __('Delete stop', 'uipress-lite'),
      },
      gradTypes: {
        'linear-gradient': {
          value: 'linear-gradient',
          label: __('Linear', 'uipress-lite'),
        },
        'radial-gradient': {
          value: 'radial-gradient',
          label: __('Radial', 'uipress-lite'),
        },
      },
      radialTypes: {
        circle: {
          value: 'circle',
          label: __('Circle', 'uipress-lite'),
        },
        ellipse: {
          value: 'ellipse',
          label: __('Ellipse', 'uipress-lite'),
        },
      },
      gradient: {
        shape: 'circle',
        type: 'linear-gradient',
        orientation: {
          type: 'angular',
          value: '0',
        },
        colorStops: [
          {
            length: {
              type: '%',
              value: '0',
            },
            type: 'hex',
            value: '#92FE9D',
          },
          {
            length: {
              type: '%',
              value: '100',
            },
            type: 'hex',
            value: '#00C9FF',
          },
        ],
      },
    };
  },
  watch: {
    /**
     * Watches gradient object and returns the value as css string on change
     *
     * @since 0.0.1
     */
    gradient: {
      handler() {
        this.grad = this.returnGradAsString;
        this.returnData(this.grad);
      },
      deep: true,
    },
    /**
     * Watches gradient color stops are arranges them by their position to keep gradients from getting wacky
     *
     * @since 0.0.1
     */
    'gradient.colorStops': {
      handler() {
        this.gradient.colorStops = this.gradient.colorStops.sort((a, b) => a.length.value - b.length.value);
      },
      deep: true,
    },
  },
  created: function () {
    this.parseGradient();
  },
  computed: {
    /**
     * Builds object back into gradient string
     *
     * @since 0.0.1
     */
    returnGradAsString() {
      let gradType = this.gradient.type;

      if (this.gradient.colorStops.length < 1) return '';

      if (gradType == 'linear-gradient') return this.returnLinearGradient();
      if (gradType == 'radial-gradient') return this.returnRadialGradient();
    },

    /**
     * Returns any gradient as linear for slider
     *
     * @since 0.0.1
     */
    returnGradAsLinear() {
      if (this.gradient.colorStops.length < 1) return '';
      return this.returnLinearGradient(true);
    },
    /**
     * Calculates the svg line angle and end point
     *
     * @since 0.0.1
     */
    lineAngle() {
      // Starting point (center of the SVG)
      let cx = 120; // Half of 240
      let cy = 65; // Half of 130

      // Length of the line is 20% of the SVG's width
      let r = 48;

      // Angle in degrees (you can change this as needed)
      let angleInDegrees = this.gradient.orientation.value;

      // Convert the angle to radians and adjust so 0 degrees points up
      let theta = (90 - angleInDegrees) * (Math.PI / 180);

      // Calculate endpoint
      let x = cx + r * Math.cos(theta);
      let y = cy - r * Math.sin(theta);

      return { x, y };
    },
  },
  methods: {
    /**
     * Builds object back into linear gradient
     *
     * @since 0.0.1
     */
    returnRadialGradient() {
      let gradString = 'radial-gradient';

      let angle = 'circle';
      if (this.gradient.shape) {
        angle = this.gradient.shape;
      }
      let stops = [];

      for (let stop of this.gradient.colorStops) {
        let pos = stop.value;
        if (stop.length) {
          pos += ' ' + stop.length.value + stop.length.type;
        }
        stops.push(pos);
      }
      let stopsAsString = stops.join(',');
      return `${gradString}(${angle},${stopsAsString})`;
    },
    /**
     * Builds object back into linear gradient
     *
     * @param {Boolean} preangle - whether to return a forced gradient
     * @since 0.0.1
     */
    returnLinearGradient(preangle) {
      let gradString = 'linear-gradient';

      let angle;
      if (this.gradient.orientation.type == 'directional') {
        angle = 'to ' + this.gradient.orientation.value;
      } else {
        if (!this.gradient.orientation.value) {
          this.gradient.orientation.value = 0;
        }
        angle = this.gradient.orientation.value + 'deg';
      }

      if (preangle) {
        angle = '90deg';
      }

      let stops = [];

      for (let stop of this.gradient.colorStops) {
        let pos = stop.value;
        if (stop.length) {
          pos += ' ' + stop.length.value + stop.length.type;
        }
        stops.push(pos);
      }
      let stopsAsString = stops.join(',');
      return `${gradString}(${angle},${stopsAsString})`;
    },
    /**
     * Parses a gradient from a string
     *
     * @since 0.0.1
     */
    parseGradient() {
      if (!this.grad) return;

      if (!this.grad.includes('gradient')) return;

      // Try to parse grad
      let obj;
      try {
        obj = parseGradient.parse(this.grad);
      } catch (err) {
        return;
      }
      this.gradient = { ...this.gradient, ...structuredClone(obj[0]) };
    },
    /**
     * Pushes a new gradient color stop
     *
     * @since 0.0.1
     */
    addStop() {
      let stop = {
        type: 'heax',
        value: '#00c9ff',
        length: {
          type: '%',
          value: '50',
        },
      };

      this.gradient.colorStops.push(stop);
    },
    /**
     * Sets grad type
     *
     * @param {String} d - gradient type as a string (radial, linear)
     */
    setGradType(d) {
      this.gradient.type = d;
    },

    /**
     * Returns the color screen for screen manage
     *
     * @param {Object} color - color stop object
     * @since 0.0.1
     */
    returnDynamicColorScreen(color) {
      return {
        component: 'ColorPicker',
        label: this.strings.colour,
        value: color.value,
        returnData: (d) => {
          if (d.startsWith('--')) return (color.value = `var(${d})`);
          color.value = d;
        },
      };
    },

    /**
     * Initialises a drag event for color positioning.
     *
     * @param {Object} color - The color object being dragged.
     * @param {Event} event - The mouse event initiating the drag.
     * @since 0.0.1
     */
    startPointDrag(color, event) {
      // Right mouse button
      if (event.button === 2) return;

      // Double click
      if (event.detail === 2) {
        this.loadColorPicker(color);
        return;
      }

      this.dragging = color;
      this.mouseDown = true;

      document.addEventListener('mousemove', this.onMoveColor);
      document.addEventListener('mouseup', this.endDragColor);

      setTimeout(() => {
        this.mouseDown = false;
      }, 500);
    },

    /**
     * Handles the movement of a color during a drag event.
     *
     * @param {Event} event - The mouse event during the drag.
     * @since 0.0.1
     */
    onMoveColor(event) {
      if (!this.dragging || !this.$refs.gradientcontrol) return;

      const svgRect = this.$refs.gradientcontrol.getBoundingClientRect();
      const newX = ((event.clientX - svgRect.left) / svgRect.width) * 100;

      this.dragging.length.value = Math.min(Math.max(0, newX), 100);
    },

    /**
     * Ends the drag event and cleans up the associated event listeners.
     *
     * @since 0.0.1
     */
    endDragColor() {
      this.dragging = null;
      document.removeEventListener('mousemove', this.onMoveColor);
      document.removeEventListener('mouseup', this.endDragColor);
    },

    /**
     * Loads color picker on control point click
     *
     * @param {Object} color - color stop object
     * @since 0.0.1
     */
    loadColorPicker(color) {
      this.$emit('request-screen', this.returnDynamicColorScreen(color));
    },

    /**
     * Pushes new color object on canvas click at given position
     *
     * @param {Object} event - click event
     * @since 0.0.1
     */
    pushNewColorAtLocation(event) {
      // Double click
      if (event.detail === 2) return;

      const coords = this.getRelativeCoordinates(event);

      let stop = {
        type: 'heax',
        value: '#00c9ff',
        length: {
          type: '%',
          value: coords.x,
        },
      };

      this.gradient.colorStops.push(stop);
    },

    /**
     * Gnerates relative coords from a click
     *
     * @param {Object} event - description
     * @since 0.0.1
     */
    getRelativeCoordinates(event) {
      const svg = this.$refs.gradientcontrol;
      const rect = svg.getBoundingClientRect();

      // Calculate relative coordinates
      let x = event.clientX - rect.left;
      let y = event.clientY - rect.top;

      // Convert to percentages
      let xPercent = (x / rect.width) * 100;
      let yPercent = (y / rect.height) * 100;

      return { x: xPercent.toFixed(2), y: yPercent.toFixed(2) };
    },
    /**
     * starts rotate event
     *
     * @since 0.0.1
     */
    startRotate() {
      this.dragging = true;
      document.addEventListener('mousemove', this.performRotate);
      document.addEventListener('mouseup', this.stopRotate);
    },
    /**
     * Handles rotate and caclulates angle on drag
     *
     * @param {Object} event - drag event
     * @since 0.0.1
     */
    performRotate(event) {
      if (!this.dragging) return;

      const centerPoint = this.$refs.anglecenter;
      const rect = centerPoint.getBoundingClientRect();

      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;

      const dx = event.clientX - cx;
      const dy = cy - event.clientY; // SVG's y-coordinates are flipped
      let angleRad = Math.atan2(dy, dx);

      // If Shift key
      if (event.shiftKey) {
        let angleDeg = (angleRad * (180 / Math.PI) + 90) % 360;
        angleDeg = Math.round(angleDeg / 45) * 45; // Round to nearest 25
        // Convert back to radians
        angleRad = (angleDeg - 90) * (Math.PI / 180);
      }

      // Convert radians to degrees and adjust to your desired orientation
      this.gradient.orientation.value = (90 - angleRad * (180 / Math.PI)) % 360;
    },
    /**
     * Removes rotate events
     *
     * @since 0.0.1
     */
    stopRotate() {
      this.dragging = false;
      document.removeEventListener('mousemove', this.performRotate);
      document.removeEventListener('mouseup', this.stopRotate);
    },
    /**
     * Gets current cusor position and updates new point position
     *
     * @param {Object} event - hover event
     * @since 0.0.1
     */
    setNewControlPos(event) {
      this.controlhover = true;
      let newX = event.offsetX;
      if (newX > 240) newX = 240;
      this.controlNewx = parseFloat(newX).toFixed(0);
    },
  },

  template: `
  
	  <div class="uip-flex uip-flex-column uip-row-gap-s">
		
		
		<toggle-switch :activeValue="gradient.type" :options="gradTypes" :small="true" :returnValue="(d) => {gradient.type = d}" class="uip-text-s"/>
		
		<div class="" @mouseleave="controlhover = false" @mousemove="setNewControlPos" >
		
		  <!--Catches overdrag and prevents dropdowns from closing-->
		  <div v-if="dragging" @click.stop.prevent="dragging = false;" @mouseup.stop.prevent="dragging = false" style="position:fixed;left:0;right:0;top:0;bottom:0"></div>
		
		  <!--Gradient line / stop manager-->
		  <svg ref="gradientcontrol" xmlns='http://www.w3.org/2000/svg' @click="pushNewColorAtLocation($event)" 
		  class="uip-h-8 uip-border-rounder uip-overflow-visible uip-background-checkered uip-w-100p" :style="'background:' + returnGradAsLinear">
		  
			<!--Controls-->
			<g>
			  
			  <!--New point marker-->
			  <ellipse v-if="controlhover"
			  :cx="controlNewx" cy="50%" rx="2" ry="2" fill="#fff" stroke="#fff" stroke-width="2" style="filter:drop-shadow(0px 0px 1px grey);"/>
			  
			  <template v-for="(color, index) in gradient.colorStops">
				
				<ellipse @mousedown.prevent.stop="startPointDrag(color, $event)"
				@contextmenu.prevent.stop="$refs['stopcontext' + index][0].show($event)"
				:cx="color.length.value + '%'" cy="50%" rx="6" ry="6" :fill="color.value" stroke="#fff" stroke-width="2" style="cursor:grab;filter:drop-shadow(0px 0px 1px grey);"/>
				
			  </template>
			  
			</g>
			
			
		  </svg>
		
		</div>
		
		<!--Contex menus for stops-->
		<template v-for="(color, index) in gradient.colorStops">
		  <contextmenu :ref="'stopcontext' + index" :disableTeleport="true">
			
			<div class="uip-padding-xs uip-flex uip-flex-column uip-text-weight-normal uip-text-s">
			  
			
			  <a class="uip-link-danger uip-flex uip-flex-center uip-flex-between"
			  @click.prevent="gradient.colorStops.splice(index, 1)">
				<span class="">{{strings.deleteStop}}</span>
				<span class="uip-icon">delete</span>
			  </a>
			
			</div>
			
		  </contextmenu>
		</template>
		
		<svg ref="gradientanglecontrol" xmlns='http://www.w3.org/2000/svg' @mouseenter="gradientHover = true" @mouseleave="gradientHover = false"
		class="uip-border-rounder uip-w-100p uip-h-130 uip-background-checkered" :style="'background:' + returnGradAsString" viewBox="0 0 240 130">
		
			<g v-show="gradient.type == 'linear-gradient' && (gradientHover || dragging)">
			  
			  <line ref="angleLine" x1="120" y1="65" :x2="lineAngle.x" :y2="lineAngle.y" stroke-width="2" stroke="rgba(1,1,1,0.2)" />
			  
			  <ellipse ref="anglecenter"
			  cx="50%" cy="50%" rx="4" ry="4" fill="transparent" stroke="#fff" stroke-width="2" style="filter:drop-shadow(0px 0px 1px grey);"/>
			  
			  <ellipse :cx="lineAngle.x" :cy="lineAngle.y" rx="4" ry="4" fill="rgba(255, 255, 255, 0.4)" stroke="#fff" stroke-width="2" 
			  @mousedown.stop.prevent="startRotate"
			  style="cursor:grab;filter:drop-shadow(0px 0px 1px grey);"/>
			  
			  
			
			</g>
		
		</svg>
		
		
		
		<toggle-switch 
		v-if="gradient.type == 'radial-gradient'"
		:activeValue="gradient.shape" :options="radialTypes" :small="true" :returnValue="(d) => {gradient.shape = d}" class="uip-text-s"/>
		
		
	  </div>
		`,
};

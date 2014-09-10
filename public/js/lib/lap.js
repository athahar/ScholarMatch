/*
* Label as Placeholder Widget
*
* DESCRIPTION:
*
* USAGE:
*
* REQUIRED FILES:
*	jquery-1.7.1.min.js
*	jQuery-ui-widgets-1.8.16.min.js
*
*/
require(["jquery"], function($){

	"use strict";

	$.widget('pp.lap', {
		_create: function() {
			this._getElements();
			this._addListeners();
			this._check();
		},
		_getElements: function() {
			this.elements = {};
			this.elements.input = this.element.find('input, textarea');
			this.elements.label = this.element.find('label');
		},
		_addListeners: function() {
			this.elements.input.bind('change keyup', $.proxy(this._check, this));
			this.elements.input.bind('focus', $.proxy(this._watch, this));
			this.elements.input.bind('blur', $.proxy(this._unwatch, this));
		},
		_check: function() {
			if (this.elements.input.val()) {
				this.elements.label.addClass('accessAid');
			} else {
				this.elements.label.removeClass('accessAid');
			}
		},
		_watch: function() {
			this._watchInterval = setInterval($.proxy(this._check, this), 200);
			this.elements.label.addClass('focus');
		},
		_unwatch: function() {
			clearInterval(this._watchInterval);
			this.elements.label.removeClass('focus');
		}
	});
});
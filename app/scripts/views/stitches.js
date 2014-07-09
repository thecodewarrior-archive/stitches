/**
 * # views/stitches
 *
 * Constructor for the stitches view, which encapsulates all of the UI
 * functionality. Instantiated with a DOM element, into which all of the
 * markup is injected and to which the behaviors are attached. Typically
 * used in a DOM ready callback
 *
 * > http://draeton.github.io/stitches<br/>
 * > Copyright 2013 Matthew Cobbs<br/>
 * > Licensed under the MIT license.
 */

var config = require('../config');
var messages = require('../messages');
var template = require('../templates/stitches.hbs');

var CanvasView = require('../views/canvas');
var DropboxView = require('../views/dropbox');
var PalettesView = require('../views/palettes');
var ProgressView = require('../views/progress');
var ToolbarView = require('../views/toolbar');

var SpriteCollection = require('../collections/sprite');

/**
 * @return {StitchesView}
 */
module.exports = Backbone.View.extend({

	/**
	 * @type {Object}
	 */
	events: {},

	/**
	 * Set up instance properties and call startup methods
	 */
	initialize: function () {
		console.info('views/stitches : initialize()');

		this.settings = _.extend({}, config.settings);
		this.elements = {};
		this.views = {};
		this.palettes = {};

		// prepare in dom
		this.load();
		this.render();
		this.bind();
	},

	/**
	 * If available, load settings
	 */
	load: function () {
		console.info('views/stitches : load()');

		var stored;

		if (store && !store.disabled) {
			stored = store.get(config.storage);
		}

		if (stored) {
			_.extend(this.settings, stored);
		}
	},

	/**
	 * Create the html for the view and append to the element.
	 *
	 * @return {View}
	 */
	render: function () {
		console.info('views/stitches : render()');

		var html = template();

		this.$el.empty().append(html);
		this.elements.canvas = this.$el.find('.wrap-canvas');
		this.elements.dropbox = this.$el.find('.wrap-dropbox');
		this.elements.palettes = this.$el.find('.wrap-palettes');
		this.elements.progress = this.$el.find('.wrap-progress');
		this.elements.toolbar = this.$el.find('.wrap-toolbar');

		this.views.canvas = new CanvasView({el: this.elements.canvas});
		this.views.dropbox = new DropboxView({el: this.elements.dropbox});
		this.views.palettes = new PalettesView({el: this.elements.palettes});
		this.views.progress = new ProgressView({el: this.elements.progress});
		this.views.toolbar = new ToolbarView({el: this.elements.toolbar});

		this.palettes.about = this.views.palettes.views.about;
		this.palettes.downloads = this.views.palettes.views.downloads;
		this.palettes.properties = this.views.palettes.views.properties;
		this.palettes.settings = this.views.palettes.views.settings;

		return this;
	},

	/**
	 * Bind event handlers
	 */
	bind: function () {
		console.info('views/stitches : bind()');

		messages.on(config.events.about, _.bind(this.onAbout, this));
		messages.on(config.events.downloads, _.bind(this.onDownloads, this));
		messages.on(config.events.settings, _.bind(this.onSettings, this));
		messages.on(config.events.close, _.bind(this.onClose, this));
		messages.on(config.events.busy, _.bind(this.onBusy, this));
		messages.on(config.events.idle, _.bind(this.onIdle, this));
		messages.on(config.events.clear, _.bind(this.onClear, this));
		messages.on(config.events.process, _.bind(this.onProcess, this));
		messages.on(config.events.remove, _.bind(this.onRemove, this));
	},

	/**
	 * Open about palette
	 */
	onAbout: function () {
		console.info('views/stitches : onAbout()');

		messages.trigger(config.events.close);
		this.palettes.about.open();
	},

	/**
	 * Open downloads palette
	 */
	onDownloads: function () {
		console.info('views/stitches : onDownloads()');

		messages.trigger(config.events.close);
		this.palettes.downloads.open();
	},

	/**
	 * Open settings palette
	 */
	onSettings: function () {
		console.info('views/stitches : onSettings()');

		messages.trigger(config.events.close);
		this.palettes.settings.open();
	},

	/**
	 * Close a palette or all palettes
	 *
	 * @param {String} name
	 */
	onClose: function (name) {
		console.info('views/stitches : onClose()');

		var palette = this.palettes[name];

		if (palette) {
			palette.close();
		} else {
			_.invoke(this.palettes, 'close');
		}
	},

	/**
	 * Show overlay
	 */
	onBusy: function () {
		console.info('views/stitches : onBusy()');

		this.views.dropbox.showOverlay();
	},

	/**
	 * Hide overlay
	 */
	onIdle: function () {
		console.info('views/stitches : onIdle()');

		this.views.dropbox.hideOverlay();
	},

	/**
	 * Clear sprites from canvas
	 */
	onClear: function () {
		console.info('views/stitches : onClear()');

		this.views.canvas.clear();
	},

	/**
	 * Process a set of files into sprites
	 *
	 * @param {FilesList} files
	 */
	onProcess: function (files) {
		console.info('views/stitches : onProcess()');

		this.sprites = new SpriteCollection(files);
	},

	/**
	 * Remove a single sprite from the canvas
	 */
	onRemove: function () {
		console.info('views/stitches : onRemove()');
	}

});
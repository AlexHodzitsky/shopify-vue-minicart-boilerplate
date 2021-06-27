const { VueLoaderPlugin } = require("vue-loader");

module.exports = {
	webpack: function (config) {
		config.module.rules.push({
			test: /\.vue$/,
			loader: 'vue-loader'
		});

		config.resolve.extensions.push('.vue');

		config.plugins.push(new VueLoaderPlugin());

		return config;
	}
};

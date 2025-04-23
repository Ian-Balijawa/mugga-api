// eslint-disable-next-line no-undef
module.exports = {
	apps: [
		{
			name: "mugga-tours",
			script: "dist/app.js",
			watch: false,
			ignore_watch: ["dist"],
			watch_options: {
				"followSymlinks": false
			},
			instances: "max", // Use all available cores
			exec_mode: "cluster",
			autorestart: false,
			env: {
				NODE_ENV: "development",
			},
		},
	],
};

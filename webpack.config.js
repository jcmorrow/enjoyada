const path = require("path");

module.exports = {
  mode: "development", // "production" | "development" | "none"  // Chosen mode tells webpack to use its built-in optimizations accordingly.
  output: {
    path: path.resolve(__dirname, "dist"), // string
    filename: "bundle.js", // string    // the filename template for entry chunks
    publicPath: "/assets/" // string    // the url to the output directory resolved relative to the HTML page
  },
  module: {
    // configuration regarding modules
    rules: [
      // rules for modules (configure loaders, parser options, etc.)
      {
        test: /\.js$/,
        loader: "babel-loader",
        options: {
          presets: ["es2015"]
        }
      },
      {
        test: /\.html$/,
        use: [
          // apply multiple loaders and options
          "htmllint-loader",
          {
            loader: "html-loader",
            options: {
              /* ... */
            }
          }
        ]
      }
    ]
  }
};

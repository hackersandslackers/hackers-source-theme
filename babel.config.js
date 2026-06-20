module.exports = {
    presets: [
        ['@babel/preset-env', {
            targets: 'defaults',
            modules: false,
        }],
    ],
    "plugins": [
      ["prismjs", {
          "plugins": [
            "normalize-whitespace",
            "custom-class"
          ],
          "languages": [
            "markup",
            "css",
            "javascript",
            "typescript",
            "shell",
            "json",
            "python",
            "java",
            "groovy",
            "html",
            "yaml",
            "toml",
            "jsx",
            "graphql",
            "sql",
            "jinja2",
            "handlebars",
            "ini",
            "less",
            "nginx",
            "go",
            "hcl",
            "vim",
            "makefile"
          ],
          "theme": "default",
          "css": false
      }],
    ]
};

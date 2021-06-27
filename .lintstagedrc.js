module.exports = {
	"src/scripts/**/*.js": [
		"prettier --write",
		"eslint --fix -c .eslintrc"
	],
	"src/styles/**/*.scss": [
		"prettier --write",
		"stylelint --fix --config ./.stylelintrc --syntax scss"
	],
	"src/styles/**/*.sass": [
		"prettier --write",
		"stylelint --fix --config ./.stylelintrc --syntax sass"
	],
	"src/icons/*.svg": [
		"svgo --config=svgo.json",
		"prettier --write --parser html",
	],
	"src/snippets/*.html": [
		"prettier --write --parser html"
	],
}

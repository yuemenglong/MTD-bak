jade-jsx test.js > test.jsx
babel test.jsx > bundle.js
browserify bundle.js --exclude react --exclude react-dom > ./bundle/app.js
rm bundle.js test.jsx
javascript-obfuscator kodo.js --compact true --self-defending true --output kodo2.js && uglifyjs kodo2.js --output kodo.min.kd.js -c -m && del kodo2.js
pause
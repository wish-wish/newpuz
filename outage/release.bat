javascript-obfuscator koso.js --compact true --self-defending true --output koso2.js && uglifyjs koso2.js --output koso.min.kd.js -c -m && del koso2.js && javascript-obfuscator kodo.js --compact true --self-defending true --output kodo2.js && uglifyjs kodo2.js --output kodo.min.kd.js -c -m && uglifyjs kodo2.js --output kodo.min.d.js -c -m && del kodo2.js && echo -- && echo ��� && echo -- && pause
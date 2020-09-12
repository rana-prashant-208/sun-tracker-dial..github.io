var scene = new THREE.Scene();
var heading = null;
var loadedFont = null;
var theta = -45;
var delta = 45;
var lat;
var lng;
var hour = 12
var minute = 36;
var xOffSet = -1;
var radius = window.innerWidth / 10;
var hourMesh = null;
var minMesh = null;
scene.background = new THREE.Color('white');
var objColor = new THREE.Color('black');
var cursorX;
var cursorY;
var date;
var colonMesh;
var lamp;
var animation = false;


var camera = new THREE.PerspectiveCamera(90, window.innerWidth / window.innerHeight, 0.1, 1000);
var renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap; // default THREE.PCFShadowMap

var textureObj = new THREE.TextureLoader().load("texture/download.jpg");
textureObj.wrapS = THREE.RepeatWrapping;
textureObj.wrapT = THREE.RepeatWrapping;
textureObj.repeat.set(1, 1);

var textureFloor = new THREE.TextureLoader().load("texture/floor.jpg");
textureFloor.wrapS = THREE.RepeatWrapping;
textureFloor.wrapT = THREE.RepeatWrapping;
textureFloor.repeat.set(1, 1);

// camera.position.y = -2;
document.body.appendChild(renderer.domElement);

// var light = new THREE.PointLight(0xFFFFFF, 1, 0);
var light = new THREE.DirectionalLight(0xFFFFFF, 0.5);
// light.position.set(-radius, radius, 0);
light.castShadow = true;
scene.add(light);
light.name = "DirectionalLight"

var DirectionalLight_top = new THREE.DirectionalLight(0xFFFFFF, 0.75);
DirectionalLight_top.position.set(0, 0, 10);
scene.add(DirectionalLight_top);
DirectionalLight_top.name = "DirectionalLight_top"

var light2 = new THREE.AmbientLight(0x404040, 3); // soft white light
light2.name = "ambientLight";
// scene.add(light2);

//Set up shadow properties for the light
light.shadow.mapSize.width = 512;  // default
light.shadow.mapSize.height = 512; // default
light.shadow.camera.near = 0.5;    // default
light.shadow.camera.far = 500;     // default

var nightlight = new THREE.DirectionalLight(new THREE.Color("grey"), 1);
// light.position.set(-radius, radius, 0);
nightlight.castShadow = true;
nightlight.name = ("nightlight");
nightlight.position.x = 8;
nightlight.position.y = 5;
nightlight.position.z = 8;


var geometry = new THREE.PlaneGeometry(20, 12, 100, 100);
var material1 = new THREE.MeshLambertMaterial({ map: textureFloor, color: 0X999999, side: THREE.DoubleSide });
var plane = new THREE.Mesh(geometry, material1);
scene.add(plane);
plane.receiveShadow = true;

var material = new THREE.MeshLambertMaterial({ map: textureObj, color: new THREE.Color("black"), side: THREE.DoubleSide });



camera.position.set(0, -3, 7);
camera.up = new THREE.Vector3(0, 0, 1);
camera.lookAt(new THREE.Vector3(0, 0, 0));

function animate() {
	date = new Date(2020, 9, 28, hour, minute);
	var position = getCurrentPosition();
	if (animation == true) {
		minute += 1;
	}
	if (minute > 60) {
		hour += 1;
		minute = 0;

		if (hour == 24) {
			hour = 0;
		}
	}
	if ((hour + minute / 60 > 17.25) || (hour + minute / 60 < 6.50)) {
		//lights on
		var selectedObject = scene.getObjectByName("DirectionalLight");
		scene.remove(selectedObject);
		scene.add(nightlight)
		scene.background = new THREE.Color("#1a0d00");
		scene.remove(scene.getObjectByName("ambientLight"));
		material = new THREE.MeshLambertMaterial({ map: textureObj, color: new THREE.Color("white"), side: THREE.DoubleSide });

	} else {
		//lights off
		scene.add(light);
		light.position.x = position.x;
		light.position.y = position.y;
		light.position.z = position.z;
		// scene.add(light);
		var selectedObject = scene.getObjectByName("nightlight");
		scene.remove(selectedObject);
		scene.background = new THREE.Color('#ccffff');
		scene.add(light2);
		material = new THREE.MeshLambertMaterial({ color: new THREE.Color("#4d0000"), side: THREE.DoubleSide });

	}

	// https://www.1001freefonts.com/sans-serif-fonts-2.php
	// https://gero3.github.io/facetype.js/


	if (loadedFont != null) {
		if (hourMesh != null) {
			var selectedObject = scene.getObjectByName("hourMesh");
			scene.remove(selectedObject);
			var selectedObject2 = scene.getObjectByName("minMesh");
			scene.remove(selectedObject2);
		}
		var hours = date.getHours().toString();
		var seconds = date.getSeconds().toString();
		if (hours.length == 1) {
			hours = "0" + hours;
		}
		var min = date.getMinutes().toString();
		if (min.length == 1) {
			min = "0" + min;
		}
		if (seconds.length == 1) {
			seconds = "0" + seconds;
		}
		var hourgeometry = new THREE.TextGeometry(hours + ":" + min, {
			font: loadedFont,
			size: 2,
			height: 1
		});
		hourMesh = new THREE.Mesh(hourgeometry, material);
		hourMesh.name = "hourMesh";
		hourMesh.castShadow = true; //default is false
		hourMesh.receiveShadow = true; //default
		hourMesh.position.set(-3 + xOffSet, -1, 0);
		scene.add(hourMesh);
	}
	requestAnimationFrame(animate);
	renderer.render(scene, camera);
}

var loader = new THREE.FontLoader();

loader.load('fonts/White Rabbit_Regular.json', function (font) {
	loadedFont = font;
});
// renderer.outputEncoding = THREE.sRGBEncoding;
// animate();`
var loader = new THREE.GLTFLoader();
loader.load('object/AnyConv.com__Lamp.glb', function (gltf) {

	var lamp = gltf.scene;
	scene.add(lamp);
	lamp.position.set(9, 5, 0)
	lamp.rotateX(Math.PI / 2);
	lamp.rotateY(Math.PI);
	// lamp.scale(0.5,0.5,0.5);
	lamp.scale.set(0.15, 0.15, 0.15);
	lamp.receiveShadow = true;
	lamp.castShadow = true;

}, undefined, function (error) {
	alert(error);
	console.error(error);

});

{
	navigator.geolocation.getCurrentPosition(setPos);
	function setPos(position) {
		lat = position.coords.latitude;
		lng = position.coords.longitude;
		console.log("Current position: " + lat + " " + lng);

		if (window.DeviceOrientationEvent) {
			window.addEventListener('deviceorientation', function (evt) {
				if (evt.alpha !== null) {
					heading = compassHeading(evt.alpha, evt.beta, evt.gamma);
				}
			}, false);
		} else {
			alert("not supported");
		}
		animate();
	}
}


function getCurrentPosition() {
	var sunLocation = getSunLocation(date);
	// console.log(hour+" "+sunLocation.azimuth+" "+sunLocation.altitude);
	var offset = 0;
	if ((heading != null)) {
		offset = (heading - 180);
	}
	theta = sunLocation.azimuth + 90 + offset;//to make -X axis as East
	delta = sunLocation.altitude;
	var apparentRadius = radius * Math.cos(delta * Math.PI / 180);
	return new THREE.Vector3(apparentRadius * Math.cos(theta * Math.PI / 180), apparentRadius * Math.sin(theta * Math.PI / 180), radius * Math.sin(delta * Math.PI / 180));
}
function getSunLocation(date) {
	var location = SunCalc.getPosition(date, lat, lng);
	var fromSouth = (toDegree(location.azimuth));
	var fromNorth = fromSouth;
	if (fromSouth < 0) {
		fromNorth += 180;
	}
	else {
		fromNorth -= 180;
	}
	return {
		azimuth: fromNorth,
		altitude: toDegree(location.altitude)
	};
	//console.log(SunCalc.getTimes(new Date(), lat, lng)); 
}
function toDegree(rad) {
	return rad * 180 / Math.PI;
}
function compassHeading(alpha, beta, gamma) {

	// Convert degrees to radians
	var alphaRad = alpha * (Math.PI / 180);
	var betaRad = beta * (Math.PI / 180);
	var gammaRad = gamma * (Math.PI / 180);

	// Calculate equation components
	var cA = Math.cos(alphaRad);
	var sA = Math.sin(alphaRad);
	var cB = Math.cos(betaRad);
	var sB = Math.sin(betaRad);
	var cG = Math.cos(gammaRad);
	var sG = Math.sin(gammaRad);

	// Calculate A, B, C rotation components
	var rA = - cA * sG - sA * sB * cG;
	var rB = - sA * sG + cA * sB * cG;
	var rC = - cB * cG;

	// Calculate compass heading
	var compassHeading = Math.atan(rA / rB);

	// Convert from half unit circle to whole unit circle
	if (rB < 0) {
		compassHeading += Math.PI;
	} else if (rA < 0) {
		compassHeading += 2 * Math.PI;
	}
	// Convert radians to degrees
	compassHeading *= 180 / Math.PI;

	return compassHeading;

}





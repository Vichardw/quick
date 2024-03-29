(function () {

	"use strict";

	// node.js support
	if (typeof(window) == "undefined") {
		global.window = global;
		require("../src/quick.js");

		global.document = {
			getElementById: function (id) {
				return {
					width: 10
				}
			}
		}
	}

	// imports
	var CommandEnum = com.dgsprb.quick.CommandEnum;
	var Controller = com.dgsprb.quick.Controller;
	var GameObject = com.dgsprb.quick.GameObject;
	var Point = com.dgsprb.quick.Point;
	var Rect = com.dgsprb.quick.Rect;
	var Sprite = com.dgsprb.quick.Sprite;
	var Text = com.dgsprb.quick.Text;

	// variables
	var errors;
	var failed;
	var passed;

	// functions
	function main() {
		errors = [];
		failed = 0;
		passed = 0;

		new ControllerTest();
		new GameObjectTest();
		new PointTest();
		new RectTest();
		new SpriteTest();
		new TextTest();

		console.log("Passed: " + passed + "; Failed: " + failed + ".");

		for (var i = 0; i < errors.length; ++i) {
			var error = errors[i];
			console.log(error);
		}
	}

	function assert(expected, value) {
		if (expected !== value) {
			++failed;
			var e = new Error();
			var error = "Test failed for value " + value + ", expected " + expected + " - " + e.stack;
			errors.push(error);
		} else {
			++passed;
		}
	}

	var ControllerTest = (function () {

		function ControllerTest() {
			var controller;

			// no args constructor
			controller = new Controller();

			for (var key in CommandEnum) {
				var value = CommandEnum[key];
				assert(undefined, controller.keyDown(value));
				assert(undefined, controller.keyPush(value));
			}

			// with all commands, first update
			controller.setDevice(new DeviceMock());
			assert(undefined, controller.update());

			for (var key in CommandEnum) {
				assert(true, controller.keyDown(CommandEnum[key]));
				assert(true, controller.keyPush(CommandEnum[key]));
			}

			// with all commands, second update
			assert(undefined, controller.update());

			for (var key in CommandEnum) {
				assert(true, controller.keyDown(CommandEnum[key]));
				assert(false, controller.keyPush(CommandEnum[key]));
			}
		}

		return ControllerTest;

	})();

	var GameObjectTest = (function () {

		function GameObjectTest() {
			var gameObject;

			// no args constructor
			gameObject = new GameObject();
			assert(0, gameObject.getHeight());
			assert(0, gameObject.getWidth());
			assert(0, gameObject.getX());
			assert(0, gameObject.getY());
			assert(null, gameObject.getColor());
			assert(0, gameObject.getLayerIndex());
			assert(false, gameObject.getEssential());
			assert(false, gameObject.getSolid());
		}

		return GameObjectTest;

	})();

	var PointTest = (function () {

		function PointTest() {
			var point;

			// no args constructor
			point = new Point();
			assert(0, point.getAccelerationX());
			assert(0, point.getAccelerationY());
			assert(point, point.getCenter());
			assert(0, point.getCenterX());
			assert(0, point.getCenterY());
			assert(0, point.getSpeedX());
			assert(0, point.getSpeedY());
			assert(0, point.getX());
			assert(0, point.getY());

			// all args constructor
			point = new Point(1, 2);
			assert(0, point.getAccelerationX());
			assert(0, point.getAccelerationY());
			assert(point, point.getCenter());
			assert(1, point.getCenterX());
			assert(2, point.getCenterY());
			assert(0, point.getSpeedX());
			assert(0, point.getSpeedY());
			assert(1, point.getX());
			assert(2, point.getY());

			// partial args constructor
			point = new Point(3);
			assert(3, point.getX());

			// getters & setters
			point.setAccelerationX(4);
			assert(4, point.getAccelerationX());

			point.setAccelerationY(5);
			assert(5, point.getAccelerationY());

			point.setSpeedX(6);
			assert(6, point.getSpeedX());

			point.setSpeedY(7);
			assert(7, point.getSpeedY());

			point.setX(8);
			assert(8, point.getX());

			point.setY(9);
			assert(9, point.getY());

			// multiple objects
			var point1 = new Point(10, 11);
			assert(0, point1.getAccelerationX());
			assert(0, point1.getAccelerationY());
			assert(0, point1.getSpeedX());
			assert(0, point1.getSpeedY());
			assert(10, point1.getX());
			assert(11, point1.getY());

			var point2 = new Point(12, 13);
			assert(0, point2.getAccelerationX());
			assert(0, point2.getAccelerationY());
			assert(0, point2.getSpeedX());
			assert(0, point2.getSpeedY());
			assert(12, point2.getX());
			assert(13, point2.getY());

			// speed to angle
			point = new Point();
			point.setSpeedToAngle(1, 0);
			assert(1, Math.round(point.getSpeedX()));
			assert(0, Math.round(point.getSpeedY()));
			point.setSpeedToAngle(1, 90);
			assert(0, Math.round(point.getSpeedX()));
			assert(1, Math.round(point.getSpeedY()));
			point.setSpeedToAngle(1, 180);
			assert(-1, Math.round(point.getSpeedX()));
			assert(0, Math.round(point.getSpeedY()));
			point.setSpeedToAngle(1, 270);
			assert(0, Math.round(point.getSpeedX()));
			assert(-1, Math.round(point.getSpeedY()));

			// get angle
			point = new Point();
			point.setSpeedX(1);
			point.setSpeedY(1);
			assert(45, point.getAngle());
			point.setSpeedX(-1);
			point.setSpeedY(1);
			assert(135, point.getAngle());
			point.setSpeedX(-1);
			point.setSpeedY(-1);
			assert(-135, point.getAngle());
			point.setSpeedX(1);
			point.setSpeedY(-1);
			assert(-45, point.getAngle());

			// speed to point
			point1 = new Point();
			point2 = new Point(100, 50);
			point1.setSpeedToPoint(2, point2);
			point2.setSpeedToPoint(2, point1);
			assert(100 / 150 * 2, point1.getSpeedX());
			assert(50 / 150 * 2, point1.getSpeedY());
			assert(-100 / 150 * 2, point2.getSpeedX());
			assert(-50 / 150 * 2, point2.getSpeedY());
		}

		return PointTest;

	})();

	var RectTest = (function () {

		function RectTest() {
			var rect;

			// no args constructor
			rect = new Rect();
			assert(0, rect.getHeight());
			assert(0, rect.getWidth());
			assert(0, rect.getX());
			assert(0, rect.getY());

			// all args constructor
			rect = new Rect(1, 2, 3, 4);
			assert(1, rect.getX());
			assert(2, rect.getY());
			assert(3, rect.getWidth());
			assert(4, rect.getHeight());

			// partial args constructor
			rect = new Rect(5);
			assert(5, rect.getX());
			assert(0, rect.getY());
			assert(0, rect.getWidth());
			assert(0, rect.getHeight());

			rect = new Rect(6, 7);
			assert(6, rect.getX());
			assert(7, rect.getY());
			assert(0, rect.getWidth());
			assert(0, rect.getHeight());

			rect = new Rect(8, 9, 10);
			assert(8, rect.getX());
			assert(9, rect.getY());
			assert(10, rect.getWidth());
			assert(0, rect.getHeight());

			// getters & setters
			rect = new Rect(0, 0, 5, 5);
			assert(2, rect.getHalfWidth());
			assert(2, rect.getHalfHeight());

			rect = new Rect(0, 0, 6, 6);
			assert(3, rect.getHalfWidth());
			assert(3, rect.getHalfHeight());

			rect.setBottom(11);
			assert(11, rect.getBottom());

			rect.setCenter(new Point(12, 13));
			var point = rect.getCenter();
			assert(12, point.getX());
			assert(13, point.getY());

			rect.setCenterX(14);
			assert(14, rect.getCenterX());

			rect.setCenterY(15);
			assert(15, rect.getCenterY());

			rect.setHeight(16);
			assert(16, rect.getHeight());

			rect.setLeft(17);
			assert(17, rect.getLeft());

			rect.setRight(18);
			assert(18, rect.getRight());

			rect.setSize(19);
			assert(19, rect.getWidth());
			assert(19, rect.getHeight());

			rect.setSize(20, 21);
			assert(20, rect.getWidth());
			assert(21, rect.getHeight());

			rect.setTop(22);
			assert(22, rect.getTop());

			rect.setTop(22);
			assert(22, rect.getTop());

			// metrics
			rect = new Rect(0, 0, 1, 1);
			assert(0, rect.getRight());
			assert(0, rect.getBottom());

			rect = new Rect(0, 0, 2, 2);
			assert(1, rect.getRight());
			assert(1, rect.getBottom());

			rect = new Rect(0, 0, 3, 3);
			assert(2, rect.getRight());
			assert(2, rect.getBottom());

			rect = new Rect(0, 0, 4, 4);
			assert(3, rect.getRight());
			assert(3, rect.getBottom());

			rect.setRight(rect.getRight());
			rect.setBottom(rect.getBottom());
			assert(0, rect.getX());
			assert(0, rect.getY());

			// multiple objects
			var rect1 = new Rect(0, 1, 2, 3);
			assert(0, rect1.getX());
			assert(1, rect1.getY());
			assert(2, rect1.getWidth());
			assert(3, rect1.getHeight());

			var rect2 = new Rect(4, 5, 6, 7);
			assert(4, rect2.getX());
			assert(5, rect2.getY());
			assert(6, rect2.getWidth());
			assert(7, rect2.getHeight());

			// collision detection
			rect1 = new Rect(0, 0, 2, 2);
			rect2 = new Rect(1, 1, 2, 2);
			var rect3 = new Rect(2, 2, 2, 2);
			assert(true, rect1.hasCollision(rect2));
			assert(false, rect1.hasCollision(rect3));
			var collision = rect1.getCollision(rect2);
			assert(true, collision.getRight());
			assert(true, collision.getBottom());
		}

		return RectTest;

	})();

	var SpriteTest = (function () {

		function SpriteTest() {
			var sprite;
			var delegate;
			var offBoundaryCalled;

			// no args constructor
			sprite = new Sprite();
			assert(0, sprite.getLeft());
			assert(0, sprite.getTop());

			// on boundary
			sprite = new Sprite();
			sprite.setSize(16);
			offBoundaryCalled = false;

			sprite.setDelegate({
				offBoundary: function () {
					offBoundaryCalled = true;
				}
			});

			sprite.setBoundary(new Rect(0, 0, 200, 200));
			sprite.sync();
			assert(false, offBoundaryCalled);

			// off boundary
			sprite = new Sprite();
			sprite.setSize(16);
			offBoundaryCalled = false;

			sprite.setDelegate({
				offBoundary: function () {
					offBoundaryCalled = true;
				}
			});

			sprite.setBoundary(new Rect(20, 20, 100, 100));
			sprite.sync();
			assert(true, offBoundaryCalled);
		}

		return SpriteTest;

	})();

	var TextTest = (function () {

		function TextTest() {
			var text;

			// no args constructor
			text = new Text();

			// all args constructor
			text = new Text("whatever");

			// setString
			text.setString("test");

			// getString
			assert("test", text.getString());
		}

		return TextTest;

	})();

	var DeviceMock = (function () {

		function DeviceMock() {}

		DeviceMock.prototype.getCommands = function () {
			var result = {};

			for (var key in CommandEnum) {
				result[CommandEnum[key]] = true;
			}

			return result;
		};

		return DeviceMock;

	})();

	main();

})();

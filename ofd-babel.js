"use strict";

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Choice = (function () {
  function Choice(text, anchordId) {
    _classCallCheck(this, Choice);

    this.anchordId = anchordId.substring(0, anchordId.length - 1);
    this.text = text;
  }

  _createClass(Choice, [{
    key: "render",
    value: function render() {
      "${this.anchordId}) ${this.text}";
    }
  }]);

  return Choice;
})();

var Screen = (function () {
  function Screen(id, name) {
    _classCallCheck(this, Screen);

    this.id = id;
    this.name = name;
    this.choices = [];
    this.text = "";
  }

  _createClass(Screen, [{
    key: "addChoice",
    value: function addChoice(text, anchordId) {
      this.choices.push(new Choice(text, anchordId));
    }
  }, {
    key: "addLine",
    value: function addLine(line) {
      this.text += line + "\n";
    }
  }, {
    key: "render",
    value: function render() {
      roomName.textContent = this.name;
      roomText.textContent = this.text;
      var availableChoices = [];
      roomChoices.innerHTML = "";
      this.choices.forEach(function (choice) {
        availableChoices.push(choice.anchordId);
        var item = "<li class='choice' data-id=" + choice.anchordId + ">" + choice.text + "</li>";
        roomChoices.innerHTML += item;
      });
      return availableChoices;
    }
  }]);

  return Screen;
})();

var Story = (function () {
  function Story() {
    _classCallCheck(this, Story);

    this.screens = {};
    this.lastId = undefined;
  }

  _createClass(Story, [{
    key: "addScreen",
    value: function addScreen(id, name) {
      this.screens[id] = new Screen(id, name);
      this.lastId = id;
    }
  }, {
    key: "addChoice",
    value: function addChoice(text, anchordId) {
      this.screens[this.lastId].addChoice(text, anchordId);
    }
  }, {
    key: "addLine",
    value: function addLine(line) {
      this.screens[this.lastId].addLine(line);
    }
  }, {
    key: "start",
    value: function start() {
      this.screens[0].render();
    }
  }, {
    key: "next",
    value: function next(choice) {
      this.screens[choice].render();
    }
  }]);

  return Story;
})();

var story = new Story();
$("h1").click(function () {
  story.start();
});
$("#roomChoices").on("click", ".choice", function (ev) {
  story.next($(this).data("id"));
});

$('#datafile').on('change', function () {
  console.log('change');
  loadGame();
});

function loadGame() {
  jQuery.get($('#datafile').val() + ".txg", function (data) {
    var lines = data.split("\n");
    lines.forEach(function (line) {
      switch (line[0]) {
        case "~":
          var breaked = line.substring(1).split(" @");
          story.addScreen(breaked[0], breaked[1]);
          break;
        case "&":
          var breaked = line.substring(1).split("%");
          story.addChoice(breaked[0], breaked[1]);
          break;
        default:
          story.addLine(line);
      }
    });

    story.start();
  });
}

$(function() {
  loadGame();
})

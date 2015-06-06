
class Choice {
  constructor(text, anchordId) {
    this.anchordId = anchordId.substring(0, anchordId.length - 1)
    this.text = text
  }

  render() {
    '${this.anchordId}) ${this.text}'
  }
}

class Screen {
  constructor(id, name) {
    this.id = id
    this.name = name
    this.choices = []
    this.text = ""
  }

  addChoice(text, anchordId) {
    this.choices.push(new Choice(text, anchordId))
  }

  addLine(line) {
    this.text += line + "\n"
  }

  render() {
    roomName.textContent = this.name
    roomText.textContent = this.text
    var availableChoices = []
    roomChoices.innerHTML = ''
    this.choices.forEach(choice => {
      availableChoices.push(choice.anchordId)
      var item = "<li class='choice' data-id="+choice.anchordId+">" + choice.text + "</li>"
      roomChoices.innerHTML += item
    })
    return availableChoices
  }
}

class Story {
  constructor() {
    this.screens = {}
    this.lastId = undefined
  }

  addScreen(id, name) {
    this.screens[id] = new Screen(id, name)
    this.lastId = id
  }

  addChoice(text, anchordId) {
    this.screens[this.lastId].addChoice(text, anchordId)
  }

  addLine(line) {
    this.screens[this.lastId].addLine(line)
  }

  start() {
    this.screens[0].render()
  }

  next(choice) {
    this.screens[choice].render()
  }

}

var story = new Story
$('h1').click(function() {
  story.start();
})
$('#roomChoices').on('click', '.choice', function(ev) {
  story.next($(this).data('id'))
})



jQuery.get('data.txg', (data) => {
  var lines = data.split("\n")
  lines.forEach(line => {
    switch (line[0]) {
      case '~':
        var breaked = line.substring(1).split(' @')
        story.addScreen(breaked[0], breaked[1])
        break;
      case '&':
          var breaked = line.substring(1).split('%')
          story.addChoice(breaked[0], breaked[1])
          break;
      default:
        story.addLine(line)
    }
  })

  story.start()
});

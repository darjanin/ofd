#!/usr/bin/env ruby

class Choice
  attr_reader :anchor_id
  def initialize(text, anchor_id)
    @text = text
    @anchor_id = anchor_id
  end

  def to_s
    "#{@anchor_id}) #{@text}"
  end
end

class Screen
  def initialize(id, name)
    @id = id
    @name = name
    @choices = []
    @text = ""
  end

  def add_choice(text, anchor_id)
    @choices << Choice.new(text, anchor_id)
  end

  def add_line(line)
    @text += line
  end

  def render
    puts @text
    available_choices = []
    @choices.each do |choice|
      available_choices << choice.anchor_id
      puts choice
    end
    available_choices
  end

end

class Story

  def initialize
    @screens = {} # id => screen
  end

  def add_screen(id, name)
    @screens[id] = Screen.new(id, name)
  end

  def start
    chosen_screen = 0
    available_choices = []
    while true
      available_choices = @screens[chosen_screen].render
      temp_chosen_screen = nil
      until available_choices.include?(temp_chosen_screen)
        print "Vyber cislo moznosti: "
        temp_chosen_screen = gets.chomp.to_i
        break if temp_chosen_screen == -1
      end
      chosen_screen = temp_chosen_screen
      break if chosen_screen == -1
    end
  end

end

FILENAME = 'data.txg'

story = Story.new
active_sceen = nil
File.open(FILENAME, 'r') do |f|
  while (line = f.gets)
    case line[0]
    when '~'
      id, name = line[1..line.size].split('@')
      active_sceen = story.add_screen(id.to_i, name)
    when '&'
      text, anchor_id = line[1..line.size].split('%')
      active_sceen.add_choice(text,anchor_id.to_i)
    else
      active_sceen.add_line(line)
    end
  end
end

story.start

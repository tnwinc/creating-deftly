#!/usr/bin/env ruby

require "fileutils"

path = ENV['PATH']
os = 'OSX'
if path.include? "\\"
    os = 'WIN'
end

osPath = '/Applications/Adobe Illustrator CC 2014/Startup Scripts/'
if os == 'WIN'
	osPath = "C:/Program Files/Adobe/Adobe Illustrator CC 2014/Startup Scripts/"
end

if Dir.exists?(osPath)
    puts "uninstalling from #{osPath}"
    FileUtils.rm_r(Dir.glob("#{osPath}creatingDeftly*"))
    puts "Creating Deftly has been uninstalled (;.;)"
else
    puts "nothing to uninstall, done."
end
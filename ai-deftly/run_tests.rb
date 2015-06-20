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

working_directory = Dir.pwd
test_files_path = "#{working_directory}/tests/"
puts "running tests..."
if os == 'OSX'
    `open -W -F -b com.adobe.illustrator #{test_file_path}`
    puts "Creating Deftly installed successfully!"
end
if os == 'WIN'
    `start #{test_file_path.gsub(/\//, '\\')}`
    # puts "Creating Deftly installed successfully!"
end
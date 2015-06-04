#!/usr/bin/env ruby

require "fileutils"

path = ENV['PATH']
os = 'OSX'
if path.include? "\\"
    os = 'WIN'
end

if os == 'OSX'
    osPath = '/Applications/Adobe Illustrator CC 2014/Startup Scripts/'

    if Dir.exists?(osPath)
        puts "working in #{osPath}"
        puts "removing any old installations"
        FileUtils.rm_r(Dir.glob("#{osPath}creatingDeftly*"))
    else
        Dir.mkdir osPath
        puts "created Startup Scripts folder in \n#{osPath}"
    end

    puts "copying in new installation"
    FileUtils.cp_r(Dir.glob('./creatingDeftly*'), Dir.glob("#{osPath}"))

    working_directory = Dir.pwd
    test_file_path = "#{working_directory}/testInstall.jsx"
    puts "running installation test..."
    `open -W -F -b com.adobe.illustrator #{test_file_path}`
    puts "Creating Deftly installed successfully!"
end
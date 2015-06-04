#!/usr/bin/env ruby

require "fileutils"

FileUtils.rm(Dir.glob("output*"))

os = ENV['OS'] || nil
if os == nil
    system """ printf 'ERROR!
+--- Must provide OS to build! ---+
| Examples:                       |
| 	MAC OSX:                      |
|     OS=OSX build.rb             |
|	WINDOWS:                      |
|     build.rb                    |
+---------------------------------+'
"""
    abort
end

if os == 'OSX'
    osPath = '/Applications/Adobe Illustrator CC 2014/Startup Scripts/'
    system "echo working in #{osPath}"

    system "echo removing old instalation"
    FileUtils.rm_r(Dir.glob("#{osPath}creatingDeftly*"))

    system "echo copying in new instalation"
    FileUtils.cp_r(Dir.glob('./creatingDeftly*'), Dir.glob("#{osPath}"))
end

if os == 'Windows_NT'
	osPath = "C:/Program Files/Adobe/Adobe Illustrator CC 2014/Startup Scripts/"
    system "echo working in #{osPath}"

    system "echo removing old instalation"
    FileUtils.rm_rf(Dir.glob("#{osPath}creatingDeftly*"), :secure => true)

    system "echo copying in new instalation"
    FileUtils.cp_r(Dir.glob('./creatingDeftly*'), Dir.glob("#{osPath}"))
end
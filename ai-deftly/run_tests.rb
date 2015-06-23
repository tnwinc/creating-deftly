#!/usr/bin/env ruby

require "fileutils"

path = ENV['PATH']
os = 'OSX'
if path.include? "\\"
    os = 'WIN'
end

working_directory = Dir.pwd
test_files_path = "#{working_directory}/tests/"
test_file_path = "#{test_files_path}/testingDeftly.jsx"
test_log_path = "#{test_files_path}/adobe.test"
puts "running tests..."

if os == 'OSX'
    `open #{test_file_path}`
    system( """
tail -f -n +1 #{test_log_path} | sed -E \"s:([0-9]+):`echo '\033[36m&\033[0m'`:g\"
    """ )
end
if os == 'WIN'
    `start #{test_file_path.gsub(/\//, '\\')}`
    # puts "Creating Deftly installed successfully!"
end
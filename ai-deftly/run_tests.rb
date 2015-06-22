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
    system( "tail -f -n +1 #{test_log_path}" )
    # `RED=echo -en '\e[31m'`
    # `YELLOW=echo -en '\e[93m'`
    # `RESET=echo -en '\e[00m'`
    # `tail -f #{test_log_path}" | sed -E "s/([0-9]+)/$RED\1$RESET/g;s/(\"[^\"]*\")/$YELLOW\1$RESET/g"`
end
if os == 'WIN'
    `start #{test_file_path.gsub(/\//, '\\')}`
    # puts "Creating Deftly installed successfully!"
end
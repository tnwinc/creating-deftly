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
FileUtils.rm_r(Dir.glob("#{test_log_path}"))
log_file = File.new("#{test_log_path}", "w+")
log_file.puts('')
log_file.close

# s:([0-9]+):`echo '\033[36m&\033[0m'`:g; #Math numbers
if os == 'OSX'
    `open #{test_file_path}`
    system( """
tail -f -n +1 #{test_log_path} | sed -E \"
s:(\\\[[^\]]+\]):`echo '\033[35m&\033[0m'`:g;
s:(\\\([^)]+\)):`echo '\033[30m&\033[0m'`:g;
s:(✔ [^<]+\\\: )|(✔)|([0-9] ✔):`echo '\033[32m&\033[0m'`:g;
s:(✘ [^<]+\\\: )|(✘)|([0-9] ✘):`echo '\033[31m&\033[0m'`:g;
s:(testingDeftly--):`echo '\033[30m&\033[0m'`:g;
s:([0-9]+ passing):`echo '\033[32m&\033[0m'`:g;
s:([0-9]+ pending):`echo '\033[36m&\033[0m'`:g;
s:([0-9]+ failing):`echo '\033[31m&\033[0m'`:g;
s:(Expected)|(to equal)|(to be)|(to NOT equal)|(to NOT be):`echo '\033[30m&\033[0m'`:g;
s:(Describe[^--]+--)|(--):`echo '\033[34m&\033[0m'`:g;
s:(xdescribe[^~~]+~~)|(xIt[^~~]+~~):`echo '\033[36m&\033[0m'`:g;
\"
    """ )
# Color escape code reference: https://en.wikipedia.org/wiki/ANSI_escape_code
end
if os == 'WIN'
    `start #{test_file_path.gsub(/\//, '\\')}`
    # puts "Creating Deftly installed successfully!"
end
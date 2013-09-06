### Rakefile for igodstil

# Directories
scss_dir = "./scss"
css_dir = "./public/css"

# Filename
base_filename = "igodstil"

scss = "#{base_filename}.scss"
css = "#{base_filename}.css"
css_min = "#{base_filename}.min.css"


# Tasks

desc "Watch #{scss_dir} for changes and convert to css"
task :watch do
	system "sass --watch #{scss_dir}:#{css_dir}"
end

desc "Convert scss file to css with nested style"
task :compile do
	input = "#{scss_dir}/#{scss}"
	output = "#{css_dir}/#{css}"
	puts "Converting #{input} -> #{output}"
	system "sass #{input} #{output}"
end

desc "Convert scss file to css with compressed style"
task :compress do
	input = "#{scss_dir}/#{scss}"
	output = "#{css_dir}/#{css_min}"
	puts "Converting #{input} -> #{output}"
	system "sass #{input} #{output} -t compressed"
end

desc "Remove generated css files"
task :clean do
	system "rm -f #{css_dir}/#{css}"
	system "rm -f #{css_dir}/#{css_min}"
end

task :default => :compile

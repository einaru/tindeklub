require 'rake'

task :gear do
	system "sass --watch gear/static/scss/style.scss:gear/static/css/style.css \
	        --style compressed"
end

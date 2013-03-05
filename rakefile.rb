require 'rake'

task :watch do
	system "sass --watch \
			tindeklub/static/scss/style.scss:tindeklub/static/css/style.css \
	        --style compressed"
end

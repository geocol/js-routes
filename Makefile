CURL = curl

all:

updatenightly:
	$(CURL) -sSLf https://raw.githubusercontent.com/wakaba/ciconfig/master/ciconfig | RUN_GIT=1 REMOVE_UNUSED=1 perl

deps:

src/encodedpolyline.js:
	$(CURL) -f https://raw.githubusercontent.com/wakaba/js-geo-encodedpolyline/master/encodedpolyline.js > $@

test: test-js

test-js: test-js-1 test-js-2
test-js-1:
	docker run --rm -v $(PWD):/app -w /app node t/routes-tests.js
test-js-2:
	docker run --rm -v $(PWD):/app -w /app node t/routepoints-tests.js

## License: Public Domain.

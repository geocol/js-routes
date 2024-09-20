CURL = curl

all:

updatenightly:
	$(CURL) -sSLf https://raw.githubusercontent.com/wakaba/ciconfig/master/ciconfig | RUN_GIT=1 REMOVE_UNUSED=1 perl

deps:

src/encodedpolyline.js:
	$(CURL) -f https://raw.githubusercontent.com/wakaba/js-geo-encodedpolyline/master/encodedpolyline.js > $@

test: test-js

test-js:
	docker run --rm -v $(PWD):/app -w /app node t/routes-tests.js

## License: Public Domain.

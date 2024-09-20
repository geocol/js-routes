all: 

src/encodedpolyline.js:
	curl -f https://raw.githack.com/wakaba/js-geo-encodedpolyline/master/encodedpolyline.js > $@

test: test-js

test-js:
	docker run --rm -v $(PWD):/app -w /app node t/routes.js

## License: Public Domain.

test:
				NODE_ENV=test ./node_modules/.bin/mocha \
											--harmony \
											--reporter spec

coveralls:
	node --harmony ./node_modules/.bin/istanbul cover ./node_modules/.bin/_mocha -- -R spec && cat ./coverage/lcov.info | ./node_modules/.bin/coveralls && rm -rf ./coverage

.PHONY: test

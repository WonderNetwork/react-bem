node_modules: package-lock.json package.json
	npm ci

dist: node_modules
	npm run test
	npm run build

.PHONY: publish
publish: dist
	@jq --arg version $(VERSION) '. + { $$version }' < package.json > dist/package.json
	cp Readme.md dist/
	npm publish --access public dist/

.PHONY: clean
clean:
	rm -fr dist/

.DEFAULT_GOAL := publish

.PHONY: clean
clean:
	rm -rf dist node_modules app.zip

.PHONY: dev
dev:
	yarn --immutable 
	yarn dev

.PHONY: lint
lint:
	yarn tc
	yarn lint

.PHONY: build
build:
	yarn build

.PHONY: package
package:
	rm -rf app.zip
	cd dist; zip -9 -r ../app.zip *
	cd ..
	@ echo "Packaged file created $(CURDIR)/app.zip"

.PHONY: release
release: build package
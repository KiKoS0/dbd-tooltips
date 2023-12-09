.PHONY: clean
clean:
	rm -rf dist node_modules app.zip

.PHONY: deps
deps: 
	yarn --immutable 

.PHONY: dev
dev:
	make deps 
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
release: deps build delete-sourcemaps package

.PHONY: delete-sourcemaps
delete-sourcemaps:
	find dist -name "*.map" -type f -delete
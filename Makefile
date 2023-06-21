clean:
	rm -rf dist node_modules app.zip

dev:
	yarn --immutable 
	yarn dev

lint:
	yarn --immutable 
	yarn tc
	yarn lint

build:
	yarn --immutable 
	yarn build

package:
	rm -rf app.zip
	cd dist; zip -9 -r ../app.zip *
	cd ..
	@ echo "Packaged file created $(CURDIR)/app.zip"

release: build package
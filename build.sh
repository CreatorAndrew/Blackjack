rm -rf ./dist
yarn electron:build --platform=win32 --arch=x64 --asar --out=./dist
yarn electron:build --platform=win32 --arch=arm64 --asar --out=./dist
yarn electron:build --platform=darwin --arch=x64 --asar --out=./dist
yarn electron:build --platform=darwin --arch=arm64 --asar --out=./dist
yarn electron:build --platform=linux --arch=x64 --asar --out=./dist
yarn electron:build --platform=linux --arch=arm64 --asar --out=./dist

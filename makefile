.PHONY: ni nu na nci dev prod hot ncu ncuu lint
.DEFAULT_GOAL := help

ni:
	npm i --legacy-peer-deps

nu:
	npm update --legacy-peer-deps

na:
	npm audit fix --force

nci:
	npm ci --no-audit --legacy-peer-deps

dev:
	chmod go+x ./node_modules/.bin/webpack
	npm run dev

prod:
	chmod go+x ./node_modules/.bin/webpack
	npm run prod

hot:
	$(ddev) exec npm run hot

ncu:
	chmod go+x ./node_modules/.bin/ncu
	./node_modules/.bin/ncu

ncuu:
	chmod go+x ./node_modules/.bin/ncu
	./node_modules/.bin/ncu -u

lint:
	chmod go+x ./node_modules/.bin/eslint
	./node_modules/.bin/eslint './assets/js/**/*.js' --fix
	chmod go+x ./node_modules/.bin/stylelint
	./node_modules/.bin/stylelint './assets/scss/**/*.scss' --fix

cert:
	mkdir ./.ssl
	mkcert -key-file ./.ssl/key.pem -cert-file ./.ssl/cert.pem localhost 127.0.0.1


help: Makefile
	@sed -n 's/^##//p' $<

%:
	@:

# git rm -r --cached .; git add .; git commit -m "fix untracked files";

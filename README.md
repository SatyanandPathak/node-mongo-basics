# node-mongo-basics

Heroku URL:
https://immense-basin-48585.herokuapp.com/todos

Heroku login instructions:
-------------------------

Once Heroku is installed follow below instructions.


1. heroku login
2. heroku keys:add
3. heroku keys
4. heroku keys:remove
5. ssh -v git@heroku.com

ssh -v does not work and fails authentication due to picking up another public key, update/add ~/.ssh/config file for Heroku Host as below:
# Heroku Host
Host heroku.com
IdentityFile ~/.ssh/id_rsapers
PreferredAuthentications publickey

deploy app in heroku:

1. heroku create
2. git push
3. heroku open


Add Heroku addons like mongo db:
heroku addons: create mongolab:sandbox



Lifecycle:
----------

git add .
git status
git commit -m "code changes for deploying into heroku"
git push origin master
heroku create
git push heroku
heroku open


or git push heroku master



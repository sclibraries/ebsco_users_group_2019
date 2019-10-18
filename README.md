# Ebsco Users Group Conference 2019

## How to use these files
### Server
1. The server folder builds a connection to the EDS API.  You will need to run this on a server which can use node.  Alternatively, run locally.
2. Extract the file to the location it will live
3. yarn install
4. The server uses environmental variables for the EDS API username and password.  Either set them in the command line or in config > credentials.
5. Add any other keys that you want to use
6. yarn start - server should now be running on [YOURSERVER]:4000

### Example files
1. Set your graphql server in examples > src > index.js
2. yarn start

You can use any of the examples as standalone applications too.

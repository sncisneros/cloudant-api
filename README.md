## Cloudant API

A basic api for requests to and from a cloudant database, including: Create, Retrieve, Update, and Delete.

Pull/merge this repo. cd into it and export the Cloudand API Key and URL as stated below. You can find this information in the Cloudant service instance. Copy the External endpoint(preferred) from the service details. Copy the apikey from "Service Credentials".

```
npm install
export CLOUDANT_URL=<value_from_Cloudant_service_credentials> (e.g. "https://34b15485ikrt5-f77a60944371-bluemix.cloudantnosqldb.appdomain.cloud")
export CLOUDANT_APIKEY=<value_from_Cloudant_service_credentials>
npm start
```
Or you can add these variables to your dotenv for private visibility.

const express = require('express');
const app = express();
const cors = require('cors');
require('dotenv').config();
const port = process.env.PORT;

app.use(cors());
app.use(express.json());


// check for environment variables
if (!process.env.CLOUDANT_URL || !process.env.CLOUDANT_APIKEY) {
    console.error('Please create CLOUDANT_URL & CLOUDANT_APIKEY environment variables before running. Add variables to dotenv.')
    process.exit(1)
  }
  
  
  // the official Node.js Cloudant library - https://www.npmjs.com/package/@ibm-cloud/cloudant
  const { CloudantV1 } = require('@ibm-cloud/cloudant')
  const client = CloudantV1.newInstance()
  const DBNAME = process.env.DB_NAME;


//GET ALL USERS IN DB - Sorted by email address.
  app.get('/users', async (req, res) => {
    console.log('GET /users')
    // get all users in chrono order
    const response = await client.postFind({
      db: DBNAME,
      selector: {} ,
      fields: ['_id', '_rev', 'firstName', 'lastName', 'emailAddress'],
      sort: [{
        emailAddress: 'asc'
      }],
      limit: 100
    })
    res.send({
      ok: true,
      response: response.result.docs
    })
  });

   

    //ADD USER TO DB
  app.post('/user', async (req, res) => {
    console.log('POST /user')
    
    const newUser = req.body;
    console.log(newUser);

    const response = await client.postDocument({
      db: DBNAME,
      document: newUser 
    })
    res.send({ok: true});
  });


    //DELETE USER FROM DB BY EMAIL
  app.delete('/user', async (req, res) => {
      console.log('DELETE /user?email=');

    //find user by email to retrieve the rev and id
      const response = await client.postFind({
        db: DBNAME,
        selector: {emailAddress: req.query.email} ,
        fields: ['_id', '_rev', 'firstName', 'lastName', 'emailAddress']
      })

      const deleteUser = response.result.docs[0];
      console.log(deleteUser._id);

      //use rev and id to remove user
      client.deleteDocument({
        db: DBNAME,
        docId: deleteUser._id,
        rev: deleteUser._rev
       })

      res.send({
        ok: true
      })
    });


    //UPDATE A USER BY EMAIL
    app.put('/user', async (req, res) =>{
      console.log('PUT /user?email=');
      
      //get the user to update -- need the rev
      const fetchUser = await client.postFind({
        db: DBNAME,
        selector: {emailAddress: req.query.email} ,
        fields: ['_id', '_rev', 'firstName', 'lastName', 'emailAddress']
      })

      const user = fetchUser.result.docs[0];
      console.log(user);

      //update user with rev
      const updatedUser = req.body;
      console.log(updatedUser);

      const response = await client.putDocument({
        db: DBNAME,
        docId: user._id,
        rev: user._rev,
        document: updatedUser
      })
    res.send({ok: true});

    });

  

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });
  
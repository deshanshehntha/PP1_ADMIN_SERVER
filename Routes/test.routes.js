const express = require('express')
const router = express.Router();
const firebase_app = require('.././Util/firebase.config');

//firebase reference
const testRef = firebase_app.database().ref("/test/");

/*
*Save data to firebase
 */
router.post("/add", function(req,res){
    const testObj = req.body;

    //generate new key
    const _key = testRef.push().getKey();

    //set the data
    //if you want your own key, just replace the _key with your value instead of generating the push ID
    testRef.child(_key).set(testObj, function (error) {

        if(error)
            //send a BadRequest status
            res.status(400).send("ERROR !" + error );
        else
            res.status(200).send("Test data saved successfully !");
    })
});

/*
* Delete data from firebase
 */
router.delete("/delete/:key", function (req,res) {
   const _key = req.params.key;

   testRef.child(_key).remove(function (error) {
       if(error)
       //send a BadRequest status
           res.status(400).send("ERROR !" + error );
       else
           res.status(200).send("Test data deleted successfully !");
   })

});

module.exports = router;

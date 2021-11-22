import Realm from 'realm';
import { realmAppID } from './realmAppID';


const AcountSchema = {
    name: 'Acount',
    primaryKey: '_id',
    properties: {
      // id: 'string',
      _id: 'uuid',
      id: 'string',
      title: 'string?',
      descripts: 'string?',
  }
}

export const {UUID} = Realm.BSON;

export  const accountCreate = (_id, id, title, descripts) => {

    Realm.open({
      schema: [AcountSchema],
    })
      .then(realm => {
        realm.write(() => {
          realm.create('Acount', {
            _id: id,
            id:id,
            title: title,
            descripts:descripts,
          });
        });

        console.log('accountCreate successfully ');
        realm.close();
      })
      .catch(err => {
        // realm.close();
        console.log('HomeAddChiildScreen,ERR:1:', err);
      });
  };


  // Place Your RealmApp ID Here
const app = new Realm.App({ id: realmAppID, timeout: 5000 });

// can implement inBuilt JWT, Google, Facebook, Apple Authentication Flow.
const credentials = Realm.Credentials.anonymous(); // LoggingIn as Anonymous User. 

export  const getRealm = async () => {

  // loggedIn as anonymous user
  const loggedInUser = await app.logIn(credentials);
  console.log("Successfully logged in!", loggedInUser.id);
  const OpenRealmBehaviorConfiguration = {type: "openImmediately"}
  // MongoDB RealmConfiguration
  const configuration = {
    schema: [AcountSchema], // add multiple schemas, comma seperated.
    sync: {
      user: app.currentUser, // loggedIn User
      partitionValue: "2F6092d4c594587f582ef165a0", // should be userId(Unique) so it can manage particular user related documents in DB by userId
      newRealmFileBehavior: OpenRealmBehaviorConfiguration,
      existingRealmFileBehavior : OpenRealmBehaviorConfiguration,
    }
  };

  return Realm.open(configuration);
}
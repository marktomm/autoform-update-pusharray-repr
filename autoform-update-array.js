Schema = {};

// is added to User schema 'clients' array
Schema.ClientEntry = new SimpleSchema({
  name: {
    type: String,
    regEx: /^[а-яА-Яa-zA-Z- ]{2,50}$/
  },
  phoneNumber: {
    type: String,
    regEx: /^[0-9+]{2,25}$/,
    optional: true
  },
  address: {
    type: String,
    optional: true
  },
  placeOfBirth: {
    type: String,
    optional: true
  },
  work: {
    type: Object,
    optional: true
  },
  'work.name': {
    type: String,
    optional: true
  },
  'work.address': {
    type: String,
    optional: true
  },
  'work.phoneNumber': {
    type: String,
    optional: true
  },
  'work.title': {
    type: String,
    optional: true
  }
});

Schema.User = new SimpleSchema({
  _id: {
    type: String,
    regEx: SimpleSchema.RegEx.Id
  },
  emails: {
    type: [Object]
  },
  "emails.$.address":{
    type: String,
    regEx: SimpleSchema.RegEx.Email
  },
  "emails.$.verified":{
    type: Boolean
  },
  createdAt: {
    type: Date
  },
  clients: {
    type: Array,
    optional: true  // Accounts.createUser doesn't not accept any additional containers for insertion
  },
  'clients.$': {
    type: Schema.ClientEntry
  },
  services: {
    type: Object,
    optional: true,
    blackbox: true
  },
  // No plans for using role groups, so an array of string is fine
  roles: {
    type: [String],
    optional: true
  },
  
  // this is used on the server side when sending Accounts emails (resetPassword etc)
  lang: {
    type: String,
    optional: true
  }
});

Meteor.users.attachSchema(Schema.User);

if (Meteor.isClient) {
  Meteor.startup(function () {
    // code to run on client at startup
  });
  
  AutoForm.hooks({
    userSettingsEditForm: {
      before: {
        'update-pushArray': function(doc) {
          console.log('update-pushArray: ', doc);
          return doc;
        }
      },
      onSuccess: function() {
        console.log('update-pushArray Success');
      }
    }
  });

}

if (Meteor.isServer) {
  Meteor.startup(function () {
    Accounts.onCreateUser(function(options, user) {
      user.clients = [
        {
          name: 'user',
        }
      ];
      return user;
    });
  });
}

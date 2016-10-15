var PouchDB = require('pouchdb-core')
  .plugin(require('pouchdb-mapreduce'))
  .plugin(require('pouchdb-adapter-memory'))
  .plugin(require('pouchdb-users'))
var test = require('tap').test

var getApi = require('../../')

PouchDB.plugin(require('pouchdb-users'))

test('walkthrough', function (t) {
  t.plan(10)

  var usersDb = new PouchDB('users')

  usersDb.installUsersBehavior()

  .then(function () {
    var api = getApi({
      db: usersDb,
      secret: 'secret'
    })

    api.accounts.on('change', function (eventName) {
      t.pass('change event emitted') // gets emitted twice
    })
    api.accounts.on('add', function (account) {
      t.pass('add event emitted')
      t.is(account.username, 'foo', '"add" event emmited with account.username')
      t.is(account.id, 'user123', '"add" event emmited with account.id')
    })
    api.accounts.on('remove', function (account) {
      t.pass('remove event emitted')
      t.is(account.username, 'foo', '"remove" event emmited with account.username')
      t.is(account.id, 'user123', '"remove" event emmited with account.id')
    })

    api.accounts.add({
      id: 'user123',
      username: 'foo',
      password: 'foosecret'
    })

    .then(function (account) {
      t.pass('creates account')

      return api.accounts.remove(account.id)
    })

    .then(function (account) {
      t.pass('deletes account')
    })

    .catch(t.error)
  })
  .catch(t.error)
})
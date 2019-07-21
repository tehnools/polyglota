const env = require('./test-environment')
const db = require('../../../server/db/db')

let testDb = null

beforeEach(() => {
  testDb = env.getTestDb()
  return env.initialise(testDb)
})

afterEach(() => env.cleanup(testDb))

test('db.getProfile function should get a user of given id', () => {
  const profileId = 1
  const expected = 'A'

  db.getProfile(profileId, testDb)
    .then(profile => {
      const actual = profile.name
      expect(actual).toBe(expected)
    })
})

test('db.deleteProfile runs a successful delete', () => {
  return db.deleteProfile(1, testDb)
    .then(wasDeleteSuccessful => {
      expect(wasDeleteSuccessful).toBeTruthy()
    })
})

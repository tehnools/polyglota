import request from 'supertest'

require('babel-polyfill')
const server = require('../../../server/server')

jest.mock('../../../server/db/userLanguages.db.js', () => ({
  getUserLanguages: (id) => Promise.resolve([
    { id: 1, userId: 1, langId: 1 },
    { id: 1, userId: 1, langId: 2 },
    { id: 1, userId: 1, langId: 5 }
  ]),
  addUserLanguage: (id, languages) => Promise.resolve([
    { langId: 1 },
    { langId: 3 }
  ]),
  deleteUserLanguage: (id) => Promise.resolve({ id })
}))

jest.mock('../../../server/db/pots.db.js', () => ({
  getPotentialMatches: async userId => {
    const list = [
      { id: 1, name: 'A', userId: 1, description: 'I am A' },
      { id: 2, name: 'B', userId: 2, description: 'I am B' },
      { id: 3, name: 'C', userId: 3, description: 'I am C' }
    ]
    const filteredList = await list.filter(profile => profile.userId !== userId)
    return Promise.resolve(filteredList)
  }
}))

jest.mock('../../../server/db/matches.db.js', () => ({
  getUserMatches: () => Promise.resolve([
    { id: 1, user1Id: 1, user2Id: 2 },
    { id: 2, user1Id: 1, user2Id: 3 },
    { id: 3, user1Id: 4, user2Id: 5 }
  ])
}))

jest.mock('../../../server/db/likes.db.js', () => ({
  getUserLikes: (id) => Promise.resolve([
    { id: 1, userId: id, likeId: 2 },
    { id: 2, userId: id, likeId: 3 },
    { id: 3, userId: id, likeId: 5 }
  ])
}))

jest.mock('../../../server/db/users.db.js', () => ({
  getUsers: () => Promise.resolve([
    { id: 1, email: 'email@email.com', password: 'password' },
    { id: 2, email: 'email2@email.com', password: 'password' },
    { id: 3, email: 'email3@email.com', password: 'password' }
  ]),
  getUser: (id) => Promise.resolve(
    { id: 2, email: 'email2@email.com', password: 'password' }
  ),
  addUser: (user) => Promise.resolve(user),
  deleteUser: (id) => Promise.resolve({ id })
}))

test('POST / adds a user', () => {
  const testUser = { email: 'test@test.com', password: 'asdfas' }
  return request(server)
    .post('/api/v1/users')
    .send(testUser)
    .then(res => {
      expect(res.status).toBe(201)
    })
})

test('GET /users returns all of the users', () => {
  return request(server)
    .get('/api/v1/users')
    .expect(200)
    .then(res => {
      expect(res.body).toHaveLength(3)
    })
})

test('GET /users/:id returns a specific user', () => {
  return request(server)
    .get('/api/v1/users/2')
    .expect(200)
    .then(res => {
      const actual = res.body.email
      expect(actual).toMatch('email2@email.com')
    })
    .catch(err => expect(err).toBe(err))
})

test('PUT /:id/languages refreshes user languages', () => {
  const userId = 1
  const languages = [1, 2, 3]
  return request(server)
    .put(`/api/v1/users/${userId}/languages`)
    .send(languages)
    .then(res => {
      expect(res.status).toBe(200)
      expect(res.body.Okay).toBe(true)
      expect(res.body.langIds.length).toBe(2)
    })
    .catch(err => expect(err).toBeNull())
})

test('POST / adds a user language', () => {
  const testUL = [{ langId: 1 }, { langId: 3 }]
  return request(server)
    .post('/api/v1/users/3/languages')
    .send(testUL)
    .then(res => {
      expect(res.status).toBe(201)
      expect(res.body).toStrictEqual(testUL)
    })
})

test('GET /users/3/pot returns a users potential matches', done => {
  const expectedLen = 2
  const userId = 3

  return request(server)
    .get(`/api/v1/users/${userId}/pot`)
    .then(res => {
      const actual = res.body
      expect(actual).toHaveLength(expectedLen)
      done()
    })
})

test('GET /users/:id/languages returns user languages', () => {
  const userId = 1
  return request(server)
    .get(`/api/v1/users/${userId}/languages`)
    .expect(200)
    .then(res => {
      expect(res.body.length).toBe(3)
    })
})

test('GET /users/:id/likes returns user likes', () => {
  const userId = 1
  return request(server)
    .get(`/api/v1/users/${userId}/likes`)
    .expect(200)
    .then(res => {
      expect(res.body.length).toBe(3)
    })
})

test('DELETE /:id deletes a specific user', done => {
  const userId = 2
  return request(server)
    .delete(`/api/v1/users/${userId}`)
    .then(res => {
      expect(res.status).toBe(200)
      expect(res.body.Okay).toBe(true)
      done()
    })
})

test('get /:id/matches gets a users matches', done => {
  const userId = 1
  return request(server)
    .get(`/api/v1/users/${userId}/matches`)
    .then(res => {
      expect(res.status).toBe(200)
      expect(res.body).toHaveLength(3)
      done()
    })
})

import request from 'supertest'
require('babel-polyfill')
const server = require('../../../server/server')

const mockError500 = new Error({ code: 500, message: 'Sever error' })

jest.mock('../../../server/db/profiles.db.js', () => ({
  updateProfile: (profileId, profile) => {
    if (profileId === 1) {
      return Promise.resolve(profileId, profile)
    }
    return Promise.reject(mockError500)
  },
  getProfile: () => Promise.resolve({ id: 1, name: 'A', userId: 1, description: 'I am A' }),
  deleteProfile: () => Promise.resolve({ id: 1 })
}))

describe('Tests for GET /api/v1/profiles/:id', () => {
  it('should get profile 1 given id', done => {
    const expected = { id: 1, name: 'A', userId: 1, description: 'I am A' }
    const profileId = 1

    expect.assertions(2)

    request(server)
      .get(`/api/v1/profiles/${profileId}`)
      .then((res) => {
        expect(res.status).toBe(200)
        expect(res.body).toEqual(expected)
        done()
      })
  })
})

describe('Tests for PUT /api/v1/profiles/1', () => {
  const newProfile = { id: 1, name: 'AA', userId: 1, description: 'I am AA' }

  it('should update profile 1 given id', done => {
    const expected = 200
    expect.assertions(2)

    request(server)
      .put('/api/v1/profiles/1')
      .send(newProfile)
      .then((res) => {
        expect(res.status).toBe(expected)
        expect(res.body).toEqual({})
        done()
      })
  })
  it('should return 500 error given non existent id', done => {
    const expected = 500

    expect.assertions(1)
    request(server)
      .put('/api/v1/profiles/99')
      .send(newProfile)
      .then((res) => {
        expect(res.status).toBe(expected)
        done()
      })
  })
})

test('DELETE /:id deletes a specific profile', done => {
  return request(server)
    .delete('/api/v1/profiles/1')
    .then(res => {
      expect(res.status).toBe(200)
      expect(res.body.Okay).toBe(true)
      done()
    })
})

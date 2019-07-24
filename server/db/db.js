const connection = require('./connection')

const bcrypt = require('bcrypt')
const saltRounds = 10

function hashPassword (plainPassword) {
  return bcrypt.hash(plainPassword, saltRounds)
    .then(function (hash) {
      return hash
    })
}

async function validatePassword (password, hash) {
  return bcrypt.compare(password, hash)
    .then(result => result)
}

function login (loginData, db = connection) {
  return db('users')
    .select()
    .where('email', loginData.email)
    .first()
}

function getUsers (db = connection) {
  return db('users')
}

function getPotentialMatches (userId, db = connection) {
  return db.select(
    'p.id as profileId',
    'p.name',
    'p.description',
    'p.userId')
    .leftJoin('userLanguages AS uLang', 'uLang.userId', 'p.userId')
    .from('profiles AS p')
    .options({ nestTables: true })
    .whereNot('p.userId', userId)
    .map(profile => {
      return db('userLanguages AS uLang')
        .where('uLang.id', profile.userId)
        .select('langId', 'languages.name', 'languages.countryCode')
        .join('languages', 'uLang.langId', 'languages.id')
        .then(languages => {
          return { ...profile, languages: [...languages] }
        })
    })
}

function getUser (id, db = connection) {
  return db('users')
    .join('profiles', 'users.id', 'profiles.userId')
    .where('users.id', id)
    .first()
    .select('users.id',
      'profiles.id AS profileId',
      'users.email',
      'profiles.name',
      'profiles.description')
}

async function addUser (user, db = connection) {
  const hashedUser = { ...user, password: await hashPassword(user.password) }
  return db('users')
    .insert(hashedUser)
    .then(idArray => {
      const userId = idArray[0]
      return db('profiles')
        .insert({ userId })
    })
}

function updateUser (user, db = connection) {
  return db('users')
    .where('id', user.id)
    .update({
      email: user.email,
      password: user.password
    })
}

function deleteUser (id, db = connection) {
  return db('users')
    .where('id', id)
    .del()
}

function getAllUsersLanguages (db = connection) {
  return db('userLanguages')
}

async function getUserLanguages (userId, db = connection) {
  const langIds = await db('userlanguages').where({ userId }).select('langId')
  const ids = langIds.map(lang => lang.langId)

  const languages = await db('languages')
    .whereIn('id', ids)
    .select('name', 'countryCode')

  return languages
}

// add a language => stretch

// get languages => stretch
function getAllLanguages (db = connection) {
  return db('languages')
}

// get a language => stretch
// /*
// function getALanguage (languageId, db = connection) {
//   return db('languages')
//     .select()
//     .where('id', languageId)
//     .first()
// }
// */

// update language => stretch

function updateLanguage (language, db = connection) {
  return db('languages')
    .where('id', language.id)
    .update({
      name: language.name,
      description: language.description
    })
}

// delete language => stretch

// get a user's languages (has ticket)

async function addUserLanguage (userId, langIds, db = connection) {
  const data = langIds.map(langId => {
    return { userId: userId, langId: langId }
  })
  const result = await db('userLanguages').insert(data)
  return result
}

// update user language (has ticket)

// delete user language (has ticket)

function deleteUserLanguage (userId, db = connection) {
  return db('userLanguages')
    .where('userId', userId)
    .del()
}

function getProfile (profileId, db = connection) {
  return db('profiles')
    .select()
    .where('id', profileId)
    .first()
}

// add profile (has ticket)

function updateProfile (profileId, profile, db = connection) {
  return db('profiles')
    .where('id', profileId)
    .update({
      name: profile.name,
      description: profile.description
    })
}

function deleteProfile (id, db = connection) {
  return db('profiles')
    .where('id', id)
    .del()
}

function addUserLike (userId, likedId, db = connection) {
  return db('likes')
    .insert({ userId, likedId })
}

function getAllLikes (db = connection) {
  return db('likes')
}

function getMatchesFirstCol (userId, db = connection) {
  return db
    .from('matches as m')
    .where('user1Id', userId)
    .join('profiles AS p', 'm.user2Id', 'p.userId')
    .select('p.userId', 'p.id AS profileId', 'p.name', 'p.description')
}

function getMatchesSecondCol (userId, db = connection) {
  return db
    .from('matches as m')
    .where('user2Id', userId)
    .join('profiles AS p', 'm.user1Id', 'p.userId')
    .select('p.userId', 'p.id AS profileId', 'p.name', 'p.description')
}

async function getUserMatches (userId, db = connection) {
  const data = await getMatchesFirstCol(userId, db)
  const data2 = await getMatchesSecondCol(userId, db)

  if (data || data2) {
    return [...data, ...data2]
  }
}

function getAllMatches (db = connection) {
  return db('matches')
}

function addUserMatch (user1Id, user2Id, db = connection) {
  return db('matches')
    .insert({ user1Id, user2Id })
}

function getUserLikes (userId, likedId, db = connection) {
  return db('likes')
    .where('userId', 'like', likedId)
    .where('likedId', userId)
    .select()
    .first()
}

module.exports = {
  hashPassword,
  login,
  getUser,
  getUsers,
  getPotentialMatches,
  getAllUsersLanguages,
  deleteUserLanguage,
  addUser,
  addUserLanguage,
  getProfile,
  updateProfile,
  updateUser,
  deleteUser,
  getUserLanguages,
  deleteProfile,
  getAllLanguages,
  updateLanguage,
  addUserLike,
  getAllLikes,
  getUserMatches,
  getAllMatches,
  addUserMatch,
  getUserLikes,
  validatePassword
}

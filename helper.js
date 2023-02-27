function generateRandomString() {
  const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < 6; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}


function getUserByEmail(email, users){
  for(let user in users){
    if(users[user].email === email){
      return users[user];
    }
  }
}

function urlsForUser(urlsDatabase, userID) {
  const result = {}
  for (const shortURL in urlsDatabase) {
      if(urlsDatabase[shortURL].userID === userID) {
          result[shortURL] = urlsDatabase[shortURL].longURL
      }
  }
  return result
}

module.exports = {generateRandomString, getUserByEmail, urlsForUser}
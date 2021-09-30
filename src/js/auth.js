export function authWithEmailAndPasword(email, password) {
  let apiKey = "AIzaSyD70PfAh2YjIzyKpwZACN2Hi7M5hoHvG_0"
  return fetch(`https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${apiKey}`, {
    method: "POST",
    body: JSON.stringify({
      email: email,
      password: password,
      returnSecureToken: true
    }),
    headers: {
      "Content-Type": "application/json"
    }
  })
    .then(response => response.json())
    .then(data => data.idToken)
}
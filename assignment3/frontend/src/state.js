const state = {
  token: null,
};

export function getUserToken() {
  return state.token;
}

export function setUserToken(token) {
  state.token = token;
}

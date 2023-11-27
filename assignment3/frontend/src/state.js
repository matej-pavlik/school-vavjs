const state = {
  user: null,
};

export function getUser() {
  return state.user;
}

export function getUserToken() {
  return state.user?.token;
}

export function setUser(user) {
  state.user = user;
}

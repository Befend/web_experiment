import { getCookie } from '@/utils/cookie';
let userId;
let userName;
try {
  const data = getCookie('user');
  if (data) {
    const { userId: id, userName: name } = JSON.parse(data);
    userId = id;
    userName = name;
  }
} catch (error) {
  console.log('getCookie', error);
}

const state = {
  userId: userId,
  userName: userName,
  skin: '3093F3',
  legend: null
};

const mutations = {
  HANDLE_USERNAME: (state, userName) => {
    state.userName = userName;
  },
  HANDLE_USERID: (state, userId) => {
    state.userId = userId;
  },
  HANDLE_SKIN: (state, skin) => {
    state.skin = skin;
  },
  HANDLE_LEGEND: (state, legend) => {
    state.legend = legend;
  }
};
const actions = {
  handleUserName({ commit }, userName) {
    commit('HANDLE_USERNAME', userName);
  },
  handleUserId({ commit }, userId) {
    commit('HANDLE_USERID', userId);
  },
  handleSkin({ commit }, skin) {
    commit('HANDLE_SKIN', skin);
  },
  handleLegend({ commit }, legend) {
    commit('HANDLE_LEGEND', legend);
  }
};
export default {
  namespaced: true,
  state,
  mutations,
  actions
};

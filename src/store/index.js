import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex);

// 状态变量
let state = {
	theme: 'dayTime', 
	listPosition: 0,
	detailPosition: 0,
	newsIdList: [],
	topNewsIdList: [],
}

// 改变状态的方法
let mutations = {
	setTheme (state) {
		state.theme = (state.theme == 'night') ? 'dayTime' : 'night'
	},
	clearNewsIdList (state) {
		state.newsIdList = [];
	},
	addNewsIdList (state, id) {
		state.newsIdList = state.newsIdList.concat(id);
	},
	updateNewsIdList (state, option) {
		state.newsIdList.splice(0,option.orignLength);
		state.newsIdList = option.newsIdList.concat(state.newsIdList);
	},
	clearTopIdList (state) {
		state.topNewsIdList = [];
	},
	setTopNewsIdList (state, id) {
		state.topNewsIdList = state.topNewsIdList.concat(id);
	},	
	setListPosition (state, scrollY) {
		state.listPosition = scrollY;
	},
	setDetailPosition (state, scrollY) {
		state.detailPosition = scrollY;
	}
}

export default new Vuex.Store({
	state,
	mutations
})

import { queryNotices } from '@/services/api';
import {queryOssSetting} from '@/services/common';
export default {
    namespace: 'global',

    state: {
        collapsed: false,
        notices: [],
        ossSetting:{
            Bucket:{},
            Credentials:{},
            RequestId:"",
            AssumeRoleUser:{}
        }
    },

    effects: {
        *fetchOssSetting({payload},{call,put}){
            const responseData = yield call(queryOssSetting);
            if(responseData.status == 0){
                yield put({
                    type:'saveOssSetting',
                    payload:responseData.data
                });
            }
            console.log('data',responseData.data);
        },
        *fetchNotices(_, { call, put, select }) {
            const data = yield call(queryNotices);
            yield put({
                type: 'saveNotices',
                payload: data,
            });
            const unreadCount = yield select(
                state => state.global.notices.filter(item => !item.read).length
            );
            yield put({
                type: 'user/changeNotifyCount',
                payload: {
                    totalCount: data.length,
                    unreadCount,
                },
            });
        },
        *clearNotices({ payload }, { put, select }) {
            yield put({
                type: 'saveClearedNotices',
                payload,
            });
            const count = yield select(state => state.global.notices.length);
            const unreadCount = yield select(
                state => state.global.notices.filter(item => !item.read).length
            );
            yield put({
                type: 'user/changeNotifyCount',
                payload: {
                    totalCount: count,
                    unreadCount,
                },
            });
        },
        *changeNoticeReadState({ payload }, { put, select }) {
            const notices = yield select(state =>
                state.global.notices.map(item => {
                    const notice = { ...item };
                    if (notice.id === payload) {
                        notice.read = true;
                    }
                    return notice;
                })
            );
            yield put({
                type: 'saveNotices',
                payload: notices,
            });
            yield put({
                type: 'user/changeNotifyCount',
                payload: {
                    totalCount: notices.length,
                    unreadCount: notices.filter(item => !item.read).length,
                },
            });
        },
    },

    reducers: {
        saveOssSetting(state,{payload}){
          return {
              ...state,
              ossSetting:payload
          }  
        },
        changeLayoutCollapsed(state, { payload }) {
            return {
                ...state,
                collapsed: payload,
            };
        },
        saveNotices(state, { payload }) {
            return {
                ...state,
                notices: payload,
            };
        },
        saveClearedNotices(state, { payload }) {
            return {
                ...state,
                notices: state.notices.filter(item => item.type !== payload),
            };
        },
    },

    subscriptions: {
        setup({ history }) {
            // Subscribe history(url) change, trigger `load` action if pathname is `/`
            return history.listen(({ pathname, search }) => {
                if (typeof window.ga !== 'undefined') {
                    window.ga('send', 'pageview', pathname + search);
                }
            });
        },
    },
};

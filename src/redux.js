const {createStore} = require('redux');

const initialState = {
    connections: []
};

const configReducer = (state = initialState, action) => {
    switch (action.type) {
        case 'ADD_CONNECTION':
            return {
                ...state,
                connections:[...state.connections,action.payload]
            };
        default:
            return state;
    }
}; 

const store = createStore(configReducer);

store.subscribe((action)=>{
    console.log(store.getState());
});

store.dispatch({
    type:'ADD_CONNECTION',
    payload:{allo:'lol'}
});

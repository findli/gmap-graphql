import React from 'react';
import ReactDOM from 'react-dom';
import ApolloClient from 'apollo-client';
import {ApolloProvider} from 'react-apollo';
import {HashRouter, Route} from 'react-router-dom';

import App from './components/app';
import {createHttpLink} from 'apollo-link-http';
import {ApolloLink} from 'apollo-link';

import {InMemoryCache} from 'apollo-cache-inmemory';

const httpLink = createHttpLink({
    uri: '/graphql', credentials: 'same-origin'
});

const cache = new InMemoryCache({
    dataIdFromObject: o => o.id
});

const middlewareLink = new ApolloLink((operation, forward) => {
    operation.setContext({
        headers: {
            // authorization: localStorage.getItem('token') || null,
        }
    });
    return forward(operation)
});
const link = middlewareLink.concat(httpLink);
const client = new ApolloClient({
    link,
    cache,
});

const Root = () => {
    return (
        <ApolloProvider client={client}>
            <HashRouter>
                <Route path="/" component={App}/>
            </HashRouter>
        </ApolloProvider>
    );
};

ReactDOM.render(<Root/>, document.querySelector('#root'));

import React from 'react';
import { BrowserRouter, Route, Switch} from 'react-router-dom';

import Index from './pages/Index';

export default function Routes () {
    return (
        <BrowserRouter basename={process.env.PUBLIC_URL}>
            <Switch>
                <Route path="/" exact component={Index} />
            </Switch>
        </BrowserRouter>
    );
}
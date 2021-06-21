import React from 'react';
import {
    BrowserRouter as Router,
    Switch,
    Route,
    Link
} from "react-router-dom";
import {Home} from "./components/Home";

function App() {
    return (<div>
        <Router>
            <Switch>
                <Route path={"/"}>
                    <Home/>
                </Route>
                <Route path={"*"}>
                    <Home/>
                </Route>
            </Switch>
        </Router>
    </div>)
}

export default App;

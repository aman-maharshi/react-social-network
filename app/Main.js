import React, { useState } from "react"
import ReactDOM from "react-dom"
import { BrowserRouter, Switch, Route } from "react-router-dom"
import Axios from "axios"
Axios.defaults.baseURL = "http://localhost:8080"

import Header from "./components/Header"
import HomeGuest from "./components/HomeGuest"
import Footer from "./components/Footer"
import About from "./components/About"
import Terms from "./components/Terms"
import Home from "./components/Home"
import CreatePost from "./components/CreatePost"

function Main() {
    const [loggedIn, setLoggedIn] = useState(Boolean(localStorage.getItem("goSocialToken")))

    return (
        <BrowserRouter>
            <Header loggedIn={loggedIn} setLoggedIn={setLoggedIn} />

            <Switch>
                <Route path="/" exact>
                    {loggedIn ? <Home /> : <HomeGuest />}
                </Route>
                <Route path="/about-us">
                    <About />
                </Route>
                <Route path="/create-post">
                    <CreatePost />
                </Route>
                <Route path="/terms">
                    <Terms />
                </Route>
            </Switch>

            <Footer />
        </BrowserRouter>
    )
}

ReactDOM.render(<Main />, document.querySelector("#app"))

// to load JavaScript asynchronously without refreshing the page
if (module.hot) {
    module.hot.accept()
}

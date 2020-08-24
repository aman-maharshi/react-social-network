import React, { useState, useEffect, useReducer } from "react"
import ReactDOM from "react-dom"
import { BrowserRouter, Switch, Route } from "react-router-dom"
import Axios from "axios"
Axios.defaults.baseURL = "http://localhost:8080"
import { useImmerReducer } from "use-immer"

// Components
import Header from "./components/Header"
import HomeGuest from "./components/HomeGuest"
import Footer from "./components/Footer"
import About from "./components/About"
import Terms from "./components/Terms"
import Home from "./components/Home"
import CreatePost from "./components/CreatePost"
import ViewSinglePost from "./components/ViewSinglePost"
import FlashMessages from "./components/FlashMessages"
import Profile from "./components/Profile"

import StateContext from "./StateContext"
import DispatchContext from "./DispatchContext"

function Main() {
    const initialState = {
        loggedIn: Boolean(localStorage.getItem("goSocialToken")),
        flashMessages: [],
        user: {
            token: localStorage.getItem("goSocialToken"),
            username: localStorage.getItem("goSocialUsername"),
            avatar: localStorage.getItem("goSocialAvatar")
        }
    }

    function ourReducer(draft, action) {
        switch (action.type) {
            case "login":
                draft.loggedIn = true
                draft.user = action.data
                break
            case "logout":
                draft.loggedIn = false
                break
            case "flashMessage":
                draft.flashMessages.push(action.value)
                break
        }
    }

    const [state, dispatch] = useImmerReducer(ourReducer, initialState)

    useEffect(() => {
        if (state.loggedIn) {
            localStorage.setItem("goSocialToken", state.user.token)
            localStorage.setItem("goSocialUsername", state.user.username)
            localStorage.setItem("goSocialAvatar", state.user.avatar)
        } else {
            localStorage.removeItem("goSocialToken")
            localStorage.removeItem("goSocialUsername")
            localStorage.removeItem("goSocialAvatar")
        }
    }, [state.loggedIn])

    return (
        <StateContext.Provider value={state}>
            <DispatchContext.Provider value={dispatch}>
                <BrowserRouter>
                    <FlashMessages messages={state.flashMessages} />
                    <Header />

                    <Switch>
                        <Route path="/" exact>
                            {state.loggedIn ? <Home /> : <HomeGuest />}
                        </Route>
                        <Route path="/about-us">
                            <About />
                        </Route>
                        <Route path="/create-post">
                            <CreatePost />
                        </Route>
                        <Route path="/profile/:username">
                            <Profile />
                        </Route>
                        <Route path="/post/:id">
                            <ViewSinglePost />
                        </Route>
                        <Route path="/terms">
                            <Terms />
                        </Route>
                    </Switch>

                    <Footer />
                </BrowserRouter>
            </DispatchContext.Provider>
        </StateContext.Provider>
    )
}

ReactDOM.render(<Main />, document.querySelector("#app"))

// to load JavaScript asynchronously without refreshing the page
if (module.hot) {
    module.hot.accept()
}

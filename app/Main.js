import React from "react"
import ReactDOM from "react-dom"
import Header from "./components/Header"
import HomeGuest from "./components/HomeGuest"
import Footer from "./components/Footer"

function Main() {
    return (
        <>
            <Header />
            <HomeGuest />
            <Footer />
        </>
    )
}

ReactDOM.render(<Main />, document.querySelector("#app"))

// to load JavaScript asynchronously without refreshing the page
if (module.hot) {
    module.hot.accept()
}

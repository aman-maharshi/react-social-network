import React, { useEffect, useContext } from "react"
import { Link } from "react-router-dom"
import DispatchContext from "../DispatchContext"
import StateContext from "../StateContext"
import ReactToolTip from "react-tooltip"

function HeaderLoggedIn(props) {
    const appDispatch = useContext(DispatchContext)
    const appState = useContext(StateContext)

    function handleLogout() {
        appDispatch({ type: "logout" })
    }

    function handleSearchIcon(e) {
        e.preventDefault()
        appDispatch({ type: "openSearch" })
    }

    return (
        <div className="flex-row my-3 my-md-0">
            <a onClick={handleSearchIcon} data-for="search" data-tip="Search" href="#" className="text-white mr-2 header-search-icon">
                <i className="fas fa-search"></i>
            </a>
            <ReactToolTip place="bottom" id="search" className="custom-tooltip" />{" "}
            <span className="mr-2 header-chat-icon text-white" data-for="chat" data-tip="Chat">
                <i className="fas fa-comment"></i>
                <span className="chat-count-badge text-white"> </span>
            </span>
            <ReactToolTip place="bottom" id="chat" className="custom-tooltip" />{" "}
            <Link to={`/profile/${appState.user.username}`} data-for="profile" data-tip="Profile" className="mr-2">
                <img className="small-header-avatar" src={appState.user.avatar} />
            </Link>
            <ReactToolTip place="bottom" id="profile" className="custom-tooltip" />{" "}
            <Link className="btn btn-sm btn-success mr-2" to="/create-post">
                Create Post
            </Link>{" "}
            <button onClick={handleLogout} className="btn btn-sm btn-secondary">
                Sign Out
            </button>
        </div>
    )
}

export default HeaderLoggedIn

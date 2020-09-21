import React, { useEffect, useContext } from "react"
import DispatchContext from "../DispatchContext"
import { useImmer } from "use-immer"
import Axios from "axios"
import { Link } from "react-router-dom"

function Search() {
    const appDispatch = useContext(DispatchContext)

    const [state, setState] = useImmer({
        searchTerm: "",
        results: [],
        show: "neither",
        requestCount: 0
    })

    function handleCloseIcon() {
        appDispatch({ type: "closeSearch" })
    }

    useEffect(() => {
        document.addEventListener("keyup", searchKeyPressHandler)

        return () => {
            document.removeEventListener("keyup", searchKeyPressHandler)
        }
    }, [])

    function searchKeyPressHandler(e) {
        if (e.keyCode == 27) {
            handleCloseIcon()
        }
    }

    function handleInput(e) {
        const value = e.target.value
        setState(draft => {
            draft.searchTerm = value
        })
    }

    useEffect(() => {
        if (state.searchTerm.trim()) {
            setState(draft => {
                draft.show = "loading"
            })
            const timer = setTimeout(() => {
                //console.log(state.searchTerm)
                setState(draft => {
                    draft.requestCount++
                })
            }, 1000)

            return () => clearTimeout(timer)
        } else {
            setState(draft => {
                draft.show = "neither"
            })
        }
    }, [state.searchTerm])

    useEffect(() => {
        if (state.requestCount) {
            // send search post axios request here
            const ourRequest = Axios.CancelToken.source()
            async function fetchResults() {
                try {
                    const response = await Axios.post("/search", { searchTerm: state.searchTerm }, { cancelToken: ourRequest.token })
                    // console.log(response.data)
                    setState(draft => {
                        draft.results = response.data
                        draft.show = "results"
                    })
                } catch (e) {
                    console.log("There was a problem or the request was cancelled.")
                }
            }
            fetchResults()
            return () => ourRequest.cancel()
        }
    }, [state.requestCount])

    return (
        <div className="search-overlay">
            <div className="search-overlay-top shadow-sm">
                <div className="container container--narrow">
                    <label htmlFor="live-search-field" className="search-overlay-icon">
                        <i className="fas fa-search"></i>
                    </label>
                    <input onChange={handleInput} autoFocus type="text" autoComplete="off" id="live-search-field" className="live-search-field" placeholder="What are you interested in?" />
                    <span onClick={handleCloseIcon} className="close-live-search">
                        <i className="fas fa-times-circle"></i>
                    </span>
                </div>
            </div>

            <div className="search-overlay-bottom">
                <div className="container container--narrow py-3">
                    <div className={"circle-loader " + (state.show == "loading" ? "circle-loader--visible" : "")}></div>
                    <div className={"live-search-results " + (state.show == "results" ? "live-search-results--visible" : "")}>
                        {Boolean(state.results.length) && (
                            <div className="list-group shadow-sm">
                                <div className="list-group-item active">
                                    <strong>Search Results</strong> ({state.results.length} {state.results.length > 1 ? "items" : "item"} found)
                                </div>
                                {state.results.map(item => {
                                    const date = new Date(item.createdDate)
                                    const formattedDate = `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}`

                                    return (
                                        <Link onClick={() => appDispatch({ type: "closeSearch" })} key={item._id} to={`/post/${item._id}`} className="list-group-item list-group-item-action">
                                            <img className="avatar-tiny" src={item.author.avatar} /> <strong>{item.title}</strong>{" "}
                                            <span className="text-muted small">
                                                {" "}
                                                by {item.author.username} on {formattedDate}{" "}
                                            </span>
                                        </Link>
                                    )
                                })}
                            </div>
                        )}
                        {!Boolean(state.results.length) && <p className="alert alert-danger text-center shadow-sm">No results found for that search term.</p>}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Search

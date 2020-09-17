import React, { useEffect, useState, useContext } from "react"
import Page from "./Page"
import Axios from "axios"
import { useParams, Link, withRouter } from "react-router-dom"
import ReactMarkdown from "react-markdown"
import ReactTooltip from "react-tooltip"
import NotFound from "./NotFound"
import StateContext from "../StateContext"
import DispatchContext from "../DispatchContext"

import LoadingDotsIcon from "./LoadingDotsIcon"

function ViewSinglePost(props) {
    const appState = useContext(StateContext)
    const appDispatch = useContext(DispatchContext)
    const [isLoading, setIsLoading] = useState(true)
    const [post, setPost] = useState()
    const { id } = useParams()

    useEffect(() => {
        const ourRequest = Axios.CancelToken.source()

        async function fetchPost() {
            try {
                const response = await Axios.get(`/post/${id}`, { cancelToken: ourRequest.token })
                //console.log(response.data)
                setPost(response.data)
                setIsLoading(false)
            } catch (e) {
                console.log(e.response.data)
            }
        }
        fetchPost()

        return () => {
            ourRequest.cancel()
        }
    }, [])

    if (isLoading) {
        return (
            <Page title="...">
                <LoadingDotsIcon />
            </Page>
        )
    }

    if (!isLoading && !post) {
        return <NotFound />
    }

    const date = new Date(post.createdDate)
    const formattedDate = `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}`

    function isOwner() {
        if (appState.loggedIn) {
            return appState.user.username == post.author.username
        }
        return false
    }

    async function deleteHandler() {
        const areYouSure = window.confirm("Do you really want to delete this post?")
        if (areYouSure) {
            try {
                const response = await Axios.delete(`/post/${id}`, { data: { token: appState.user.token } })
                if (response.data == "Success") {
                    appDispatch({ type: "flashMessage", value: "Post was successfully deleted." })
                    // redirect the user to posts page
                    props.history.push(`/profile/${appState.user.username}`)
                }
            } catch (e) {
                console.log("There was a problem.")
            }
        }
    }

    return (
        <Page title={post.title}>
            <div className="d-flex justify-content-between">
                <h2>{post.title}</h2>
                {isOwner() && (
                    <span className="pt-2">
                        <Link to={`/post/${post._id}/edit-post`} data-tip="Edit" data-for="edit" className="text-primary mr-2">
                            <i className="fas fa-edit"></i>
                        </Link>
                        <ReactTooltip id="edit" />{" "}
                        <a onClick={deleteHandler} data-tip="Delete" data-for="delete" className="delete-post-button text-danger">
                            <i className="fas fa-trash"></i>
                        </a>
                        <ReactTooltip id="delete" />
                    </span>
                )}
            </div>

            <p className="text-muted small mb-4">
                <Link to={`/profile/${post.author.username}`}>
                    <img className="avatar-tiny" src={post.author.avatar} />
                </Link>
                Posted by <Link to={`/profile/${post.author.username}`}>{post.author.username}</Link> on {formattedDate}
            </p>

            <div className="body-content">
                <ReactMarkdown source={post.body} allowedTypes={["paragraph", "emphasis", "strong", "heading", "text", "list", "listItem"]} />
            </div>
        </Page>
    )
}

export default withRouter(ViewSinglePost)

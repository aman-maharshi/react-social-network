import React, { useEffect, useState } from "react"
import Axios from "axios"
import { useParams, Link } from "react-router-dom"

import LoadingDotsIcon from "./LoadingDotsIcon"

function ProfilePosts() {
    const { username } = useParams()
    const [isLoading, setIsLoading] = useState(true)
    const [posts, setPosts] = useState([])

    useEffect(() => {
        const ourRequest = Axios.CancelToken.source()

        async function fetchPosts() {
            try {
                const response = await Axios.get(`/profile/${username}/posts`, { cancelToken: ourRequest.token })
                //console.log(response.data)
                setPosts(response.data)
                setIsLoading(false)
            } catch (e) {
                console.log(e.response.data)
            }
        }
        fetchPosts()

        return () => {
            ourRequest.cancel()
        }
    }, [])

    if (isLoading) return <LoadingDotsIcon />

    return (
        <div className="list-group">
            {posts.map(item => {
                const date = new Date(item.createdDate)
                const formattedDate = `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}`

                return (
                    <Link key={item._id} to={`/post/${item._id}`} className="list-group-item list-group-item-action">
                        <img className="avatar-tiny" src={item.author.avatar} /> <strong>{item.title}</strong> <span className="text-muted small">on {formattedDate} </span>
                    </Link>
                )
            })}
        </div>
    )
}

export default ProfilePosts

import React, { useEffect, useState, useContext } from "react"
import Axios from "axios"
import DispatchContext from "../DispatchContext"

function HeaderLoggedOut(props) {
    const appDispatch = useContext(DispatchContext)

    const [username, setUsername] = useState()
    const [password, setPassword] = useState()

    async function handleSubmit(e) {
        e.preventDefault()
        try {
            const result = await Axios.post("/login", { username, password })
            if (result.data) {
                //console.log(result.data)
                localStorage.setItem("goSocialToken", result.data.token)
                localStorage.setItem("goSocialUsername", result.data.username)
                localStorage.setItem("goSocialAvatar", result.data.avatar)
                appDispatch({ type: "login" })
            } else {
                console.log("Incorrect Username / Password")
            }
        } catch (e) {
            console.log(e.response.data)
        }
    }

    return (
        <form onSubmit={handleSubmit} className="mb-0 pt-2 pt-md-0">
            <div className="row align-items-center">
                <div className="col-md mr-0 pr-md-0 mb-3 mb-md-0">
                    <input onChange={e => setUsername(e.target.value)} name="username" className="form-control form-control-sm" type="text" placeholder="Username" autoComplete="off" />
                </div>
                <div className="col-md mr-0 pr-md-0 mb-3 mb-md-0">
                    <input onChange={e => setPassword(e.target.value)} name="password" className="form-control form-control-sm" type="password" placeholder="Password" />
                </div>
                <div className="col-md-auto">
                    <button className="btn btn-success btn-sm">Sign In</button>
                </div>
            </div>
        </form>
    )
}

export default HeaderLoggedOut

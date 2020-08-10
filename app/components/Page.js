import React, { useEffect } from "react"
import Container from "./Container"

function Page(props) {
    // only running the first time the component renders
    useEffect(() => {
        document.title = `${props.title} | goSocial`
        window.scrollTo(0, 0)
    }, [])

    return <Container wide={props.wide}>{props.children}</Container>
}

export default Page

import React from "react"
import ReactDOM from "react-dom"

function ExampleComponent() {
    return (
        <div>
            <h1>Social Network App</h1>
            <p>Starting our first social networking app using React</p>
        </div>
    )
}

ReactDOM.render(<ExampleComponent />, document.querySelector("#app"))

// to load JavaScript asynchronously without refreshing the page
if (module.hot) {
    module.hot.accept()
}

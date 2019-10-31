import React from 'react'


function Navbar(props) {
	let linkName
	let profile
	if (props.props.data.logged) {
		linkName = "Logout"
		profile = false
	}
	else {
		linkName = "Login"
		profile = true
	}

	return (
		<nav className="navbar navbar-expand-lg navbar-light bg-light">
			<button type="button" onClick={props.props.sendToMain.bind(props.props, props.props.history)} className="btn btn-light">Home</button>
			<button type="button" onClick={props.props.logOut.bind(props.props, props.props.history)} className="btn btn-light">{linkName}</button>
			<button type="button" onClick={props.props.sendToProfile.bind(props.props, props.props.history)}
				className="btn btn-light" disabled={profile} >Profile</button>
			<button type="button" className= "btn btn-light" style={{ marginLeft: "auto", float :"right" }} name="dark_light" onClick={props.props.toggleDarkLight}>Dark Mode</button>
		</nav>
	)
}

export default Navbar
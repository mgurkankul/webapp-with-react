import React from "react";
import Navbar from "./navbar";

function Login(props) {
  return (
    <div>
      <Navbar props={props} />
      <div style = {{height: "calc(100vh - 54px"}} className = "d-flex justify-content-center align-items-center container">
        <div>
          <div>
        <form 
        onSubmit={event => {
          event.preventDefault();
        }}
      >
        <div className="form-group">
          <label htmlFor="exampleInputEmail1">Username</label>
          <input
            type="text"
            name="userName"
            value={props.data.userName}
            onChange={props.handleChange}
            className="form-control"
            id="exampleInputEmail1"
            aria-describedby="emailHelp"
            placeholder="Username"
          />
        </div>
        <div className="form-group">
          <label htmlFor="exampleInputPassword1">Password</label>
          <input
            type="password"
            name="password"
            value={props.data.password}
            onChange={props.handleChange}
            className="form-control"
            id="exampleInputPassword1"
            placeholder="Password"
          />
        </div>
        <button
          onClick={props.checkUser.bind(props, props.history)}
          type="submit"
          className="btn btn-primary btn-block"
        >
          Submit
        </button>
        
        <button
          className="btn btn-primary btn-block"
          onClick={props.sendToForm.bind(props, props.history)}
        >
          Register
        </button>
      </form>
      </div>
        </div>
      
      </div>
      
    </div>
  );
}

export default Login;

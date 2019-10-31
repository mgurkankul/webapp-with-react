import React from "react";
import Navbar from "./navbar";

function Form(props) {
  return (
    <div>
      <Navbar props={props} />
      <div style = {{height: "calc(100vh - 54px", minWeight: "100%"}} className = "d-flex justify-content-center align-items-center container">
      <form 
        onSubmit={event => {
          event.preventDefault();
        }}
      >
        <div className="form-row">
          <div className="form-group col-md-6">
            <label htmlFor="inputEmail4">Username</label>
            <input
              type="text"
              name="userName"
              placeholder="Username"
              className="form-control"
              value={props.data.userName}
              id="inputEmail4"
              onChange={props.handleChange}
            />
          </div>
          <div className="form-group col-md-6">
            <label htmlFor="inputPassword4">Password</label>
            <input
              type="password"
              name="password"
              className="form-control"
              id="inputPassword4"
              value={props.data.password}
              placeholder="Password"
              onChange={props.handleChange}
            />
          </div>
        </div>
        <div className="form-group">
          <label htmlFor="inputAddress">Name</label>
          <input
            type="text"
            name="name"
            className="form-control"
            id="inputAddress"
            value={props.data.name}
            placeholder="Name"
            onChange={props.handleChange}
          />
        </div>
        <div className="form-group">
          <label htmlFor="inputAddress2">Age</label>
          <input
            type="number"
            name="age"
            placeholder="Age"
            className="form-control"
            value={props.data.age}
            id="inputAddress2"
            onChange={props.handleChange}
          />
        </div>
        <div className="form-row">
          <div className="form-group col-md-6">
            <label htmlFor="inputCity">City</label>
            <input
              type="text"
              value={props.data.from}
              name="from"
              className="form-control"
              id="inputCity"
              placeholder="City"
              onChange={props.handleChange}
            />
          </div>
          <div className="form-group col-md-4">
            <label htmlFor="inputState">Gender</label>
            <label className="form-check">
              <input
                className="form-check-label"
                htmlFor="gridRadios1"
                type="radio"
                name="gender"
                value="male"
                checked={props.data.gender === "male"}
                onChange={props.handleChange}
              />
              Male
            </label>
            <label className="form-check">
              <input
                className="form-check-label"
                htmlFor="gridRadios1"
                type="radio"
                name="gender"
                value="female"
                checked={props.data.gender === "female"}
                onChange={props.handleChange}
              />
              Female
            </label>
          </div>
        </div>
        <button
          type="submit"
          onClick={props.saveUser.bind(props, props.history)}
          className="btn btn-primary"
        >
          Sign in
        </button>
      </form>
      </div>
    </div>
  );
}

export default Form;

import React from "react";
import { BrowserRouter, Route } from "react-router-dom";
import * as Routes from "./Router";
import Styles from "./App.module.css";

class App extends React.Component {
  serverPort = "http://localhost:1230";
  constructor() {
    super();

    this.state = {
      page: "main",
      name: "",
      userName: "",
      age: 0,
      password: "",
      gender: "",
      from: "",
      logged: false,
      darkMode: false
    };
    this.handleChange = this.handleChange.bind(this);
    this.sendToForm = this.sendToForm.bind(this);
    this.saveUser = this.saveUser.bind(this);
    this.checkUser = this.checkUser.bind(this);
    this.logOut = this.logOut.bind(this);
    this.sendToMain = this.sendToMain.bind(this);
    this.sendToProfile = this.sendToProfile.bind(this);
    this.toggleDarkLight = this.toggleDarkLight.bind(this);
  }

  componentDidMount() {
    fetch(this.serverPort + "/pages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      }
    })
      .then(response => response.json())
      .then(data => {
        this.setState({
          pageData: data
        });
      });
  }

  handleChange(event) {
    const { name, value, type, checked } = event.target;
    type === "checkbox"
      ? this.setState({ [name]: checked })
      : this.setState({ [name]: value });
  }
  sendToProfile(history, event) {
    this.setState({ page: "profile" });
    history.push("/profile");
  }
  sendToForm(history, event) {
    this.setState({ page: "form" });
    history.push("/form");
  }
  sendToMain(history, event) {
    this.setState({ page: "main" });
    history.push("/main");
  }
  logOut(history, event) {
    this.setState({
      page: "login",
      name: "",
      userName: "",
      password: "",
      age: 0,
      gender: "",
      from: "",
      logged: false
    });
    history.push("/login");
  }

  saveUser(history, event) {
    var newUser = {
      userName: this.state.userName,
      password: this.state.password,
      name: this.state.name,
      age: this.state.age,
      gender: this.state.gender,
      from: this.state.from
    };
    fetch(this.serverPort + "/add", {
      method: "POST",
      body: JSON.stringify(newUser),
      headers: {
        "Content-Type": "application/json"
      }
    })
      .then(response => response.json())
      .then(data => {
        if (data.message === "added") {
          this.setState({
            page: "login",
            name: "",
            userName: "",
            password: "",
            age: 0,
            gender: "",
            from: ""
          });
          history.push("/login");
        } else {
          alert("User Already Exists!");
        }
      });
  }

  checkUser(history, event) {
    var check = false;
    var checkVar = {
      userName: this.state.userName,
      password: this.state.password
    };
    fetch(this.serverPort + "/login", {
      method: "POST",
      body: JSON.stringify(checkVar),
      headers: {
        "Content-Type": "application/json"
      }
    })
      .then(response => response.json())
      .then(data => {
        if (data.message === "success") {
          check = true;
          this.setState({
            page: "main",
            logged: true
          });
          history.push("/main");
        }
        if (!check) {
          alert("Wrong username or password");
          this.setState({
            page: "login",
            name: "",
            userName: "",
            password: "",
            gender: "",
            from: ""
          });
        }
      });
  }

  toggleDarkLight() {
    var mode = this.state.darkMode ? false : true;
    this.setState({ darkMode: mode });
  }
  render() {
    if (!this.state.pageData) {
      return <div>Page is loading...</div>;
    }
    return (
      <BrowserRouter>
        <div className={this.state.darkMode ? Styles.darkMode : ""}>
          <BrowserRouter>
            {this.state.pageData.map((page, key) => (
              <Route
                key={key}
                path={page.path}
                render={props => {
                  const Component = Routes[page.component];
                  return (
                    <Component
                      {...props}
                      serverPort={this.serverPort}
                      logOut={this.logOut}
                      checkUser={this.checkUser.bind(this)}
                      sendToMain={this.sendToMain}
                      saveUser={this.saveUser}
                      toggleDarkLight={this.toggleDarkLight}
                      sendToForm={this.sendToForm}
                      data={this.state}
                      sendToProfile={this.sendToProfile}
                      handleChange={this.handleChange}
                    />
                  );
                }}
              />
            ))}
          </BrowserRouter>
        </div>
      </BrowserRouter>
    );
  }
}

export default App;

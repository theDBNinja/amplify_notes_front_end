import React, { Component } from "react";
import {
    Form
} from "react-bootstrap";
import { Auth } from "aws-amplify";
import LoaderButton from "../components/LoaderButton";
import "./Signup.css";

export default class Signup extends Component {
    constructor(props) {
        super(props);

        this.state = {
            isLoading: false,
            username: "",
            name: "",
            email: "",
            password: "",
            confirmPassword: "",
            confirmationCode: "",
            newUser: null
        };
    }

    validateForm() {
        return (
            this.state.username.length > 0 &&
            this.state.name.length > 0 &&
            this.state.email.length > 0 &&
            this.state.password.length > 0 &&
            this.state.password === this.state.confirmPassword
        );
    }

    validateConfirmationForm() {
        return this.state.confirmationCode.length > 0;
    }

    handleChange = event => {
        this.setState({
            [event.target.id]: event.target.value
        });
    };

    handleSubmit = async event => {
        event.preventDefault();

        this.setState({ isLoading: true });

        try {
            let username = this.state.username;
            let password = this.state.password;
            let name = this.state.name;
            let email = this.state.email;

            const newUser = await Auth.signUp({
                username,
                password,
                attributes: {
                    name,
                    email
                }
            });
            this.setState({
                newUser
            });
        } catch (e) {
            alert(e.message);
        }

        this.setState({ isLoading: false });
    };

    handleConfirmationSubmit = async event => {
        event.preventDefault();

        this.setState({ isLoading: true });

        try {
            await Auth.confirmSignUp(this.state.username, this.state.confirmationCode);
            await Auth.signIn(this.state.username, this.state.password);

            this.props.userHasAuthenticated(true);
            this.props.history.push("/");
        } catch (e) {
            alert(e.message);
            this.setState({ isLoading: false });
        }
    };

    renderConfirmationForm() {
        return (
            <form onSubmit={this.handleConfirmationSubmit}>
                <Form.Group controlId="confirmationCode" size="large">
                    <Form.Label>Confirmation Code</Form.Label>
                    <Form.Control
                        autoFocus
                        type="tel"
                        value={this.state.confirmationCode}
                        onChange={this.handleChange}
                    />
                    <Form.Text className="text-muted">Please check your email for the code.</Form.Text>
                </Form.Group>
                <LoaderButton
                    block
                    size="large"
                    disabled={!this.validateConfirmationForm()}
                    type="submit"
                    variant="outline-dark"
                    isLoading={this.state.isLoading}
                    text="Verify"
                    loadingText="Verifying…"
                />
            </form>
        );
    }

    renderForm() {
        return (
            <Form onSubmit={this.handleSubmit}>
                <Form.Group controlId="username" size="large">
                    <Form.Label>Username</Form.Label>
                    <Form.Control
                        autoFocus
                        type="text"
                        value={this.state.username}
                        onChange={this.handleChange}
                    />
                </Form.Group>
                <Form.Group controlId="name" size="large">
                    <Form.Label>Name</Form.Label>
                    <Form.Control
                        autoFocus
                        type="text"
                        value={this.state.name}
                        onChange={this.handleChange}
                    />
                </Form.Group>
                <Form.Group controlId="email" size="large">
                    <Form.Label>Email</Form.Label>
                    <Form.Control
                        autoFocus
                        type="email"
                        value={this.state.email}
                        onChange={this.handleChange}
                    />
                </Form.Group>
                <Form.Group controlId="password" size="large">
                    <Form.Label>Password</Form.Label>
                    <Form.Control
                        value={this.state.password}
                        onChange={this.handleChange}
                        type="password"
                    />
                </Form.Group>
                <Form.Group controlId="confirmPassword" size="large">
                    <Form.Label>Confirm Password</Form.Label>
                    <Form.Control
                        value={this.state.confirmPassword}
                        onChange={this.handleChange}
                        type="password"
                    />
                </Form.Group>
                <LoaderButton
                    block
                    size="large"
                    disabled={!this.validateForm()}
                    type="submit"
                    variant="outline-dark"
                    isLoading={this.state.isLoading}
                    text="Signup"
                    loadingText="Signing up…"
                />
            </Form>
        );
    }

    render() {
        return (
            <div className="Signup">
                {this.state.newUser === null
                    ? this.renderForm()
                    : this.renderConfirmationForm()}
            </div>
        );
    }
}

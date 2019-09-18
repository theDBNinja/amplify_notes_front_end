import React, { Component } from "react";
import ListGroup from "react-bootstrap/ListGroup";
import Card from "react-bootstrap/Card";
import { LinkContainer } from "react-router-bootstrap";
import { API } from "aws-amplify";
import { Auth } from 'aws-amplify';
import "./Home.css";

export default class Home extends Component {
    constructor(props) {
        super(props);

        this.state = {
            isLoading: true,
            notes: []
        };
    }

    async componentDidMount() {
        if (!this.props.isAuthenticated) {
            return;
        }

        try {
            this.getNotes();
        } catch (e) {
            alert(e);
        }

        this.setState({ isLoading: false });
    }

    getNotes() {
        let cognitoidentityid = "hi";

        Auth.currentAuthenticatedUser()
            .then(data => console.log(data))
            .catch(err => console.log(err));

        return API.get("notes", "/notes", {
            body: {
                cognitoId: cognitoidentityid
            }
        }).then(response => {
            console.log(response);
            this.setState({ notes: response });
        }).catch(error => {
            console.log(error.response);
        })
        ;
    }

    renderNotesList(notes) {
        console.log(this.state);
        return [{}].concat(notes).map(
            (note, i) =>
                i !== 0
                    ? <LinkContainer
                        key={note.noteId}
                        to={`/notes/${note.noteId}`}
                    >
                        <ListGroup.Item>
                            <h4>{note.content.trim().split("\n")[0]}</h4>
                            {"Created: " + new Date(parseInt((parseFloat(note.createdAt)*1000).toString().split(".")[0])).toLocaleString()}
                        </ListGroup.Item>
                    </LinkContainer>
                    : <LinkContainer
                        key="new"
                        to="/notes/new"
                    >
                        <ListGroup.Item>
                            <h4>
                                <b>{"\uFF0B"}</b> Create a new note
                            </h4>
                        </ListGroup.Item>
                    </LinkContainer>
        );
    }

    renderLander() {
        return (
            <div className="lander">
                <h1>Scratch</h1>
                <p>A simple note taking app</p>
            </div>
        );
    }

    renderNotes() {
        return (
            <div className="notes">
                <Card>
                    <Card.Header as="h4">Your Notes</Card.Header>
                    <Card.Body>
                        <ListGroup>
                            {!this.state.isLoading && this.renderNotesList(this.state.notes)}
                        </ListGroup>
                    </Card.Body>
                </Card>
            </div>
        );
    }

    render() {
        return (
            <div className="Home">
                {this.props.isAuthenticated ? this.renderNotes() : this.renderLander()}
            </div>
        );
    }
}
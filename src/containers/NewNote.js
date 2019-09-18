import React, { Component } from "react";
import { Form } from "react-bootstrap";
import { API } from "aws-amplify";
import LoaderButton from "../components/LoaderButton";
import { s3Upload } from "../libs/awsLib";
import config from "../config";
import "./NewNote.css";

export default class NewNote extends Component {
    constructor(props) {
        super(props);

        this.file = null;

        this.state = {
            isLoading: null,
            content: ""
        };
    }

    validateForm() {
        return this.state.content.length > 0;
    }

    handleChange = event => {
        this.setState({
            [event.target.id]: event.target.value
        });
    };

    handleFileChange = event => {
        this.file = event.target.files[0];
    };

    handleSubmit = async event => {
        event.preventDefault();

        if (this.file && this.file.size > config.MAX_ATTACHMENT_SIZE) {
            alert(`Please pick a file smaller than ${config.MAX_ATTACHMENT_SIZE/1000000} MB.`);
            return;
        }

        this.setState({ isLoading: true });

        try {
            const attachment = this.file
                ? await s3Upload(this.file)
                : null;

            console.log(attachment);

            await NewNote.createNote({
                attachment,
                content: this.state.content
            });
            this.props.history.push("/");
        } catch (e) {
            alert(e);
            this.setState({ isLoading: false });
        }
    };

    static createNote(note) {
        return API.post("notes", "/notes", {
            body: note,
            headers: {
                // "Access-Control-Allow-Origin": "*"
                // "x-api-key": config.apiGateway.API_KEY
            }
        });
    }

    render() {
        return (
            <div className="NewNote">
                <Form onSubmit={this.handleSubmit}>
                    <Form.Group controlId="content">
                        <Form.Control
                            as="textarea"
                            onChange={this.handleChange}
                            value={this.state.content}
                        />
                    </Form.Group>
                    <Form.Group controlId="file">
                        <Form.Label>Attachment</Form.Label>
                        <Form.Control onChange={this.handleFileChange} type="file" />
                    </Form.Group>
                    <LoaderButton
                        block
                        size="large"
                        disabled={!this.validateForm()}
                        type="submit"
                        variant="outline-dark"
                        isLoading={this.state.isLoading}
                        text="Create"
                        loadingText="Creating…"
                    />
                </Form>
            </div>
        );
    }
}

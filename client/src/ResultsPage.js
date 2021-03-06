import axios from 'axios';
import React, { Component, useState } from 'react';
import RingLoader from "react-spinners/RingLoader";
import { Document, Page, pdfjs } from 'react-pdf';

import testPDF from './Armin.pdf'// debugging purposes
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

class ResultsPage extends Component {

    constructor(props) {
        super(props);
        this.state = {
            isLoading: null,
            results: null,
            previewPDF: null,
            user_id: ''
        };
    }

    getResultsPDF = () => {
        axios.get('http://localhost:5000/results')
    }

    cleanUp = () => {
        axios.get(`http://localhost:5000/get_user/${this.state.user_id}`)
            .then(response => {
                console.log("Deleted...")
            })
        this.props.history.replace('/');
    }


    viewHandler = async () => {
        axios(`http://localhost:4000/pdf`, {
            method: "GET",
            responseType: "blob"
            //Force to receive data in a Blob Format
        })
            .then(response => {
                //Create a Blob from the PDF Stream
                const file = new Blob([response.data], {
                    type: "application/pdf"
                });
                //Build a URL from the file
                const fileURL = URL.createObjectURL(file);
                //Open the URL on new Window
                window.open(fileURL);
            })
            .catch(error => {
                console.log(error);
            });
    };

    componentDidMount = () => {
        this.setState({
            user_id: this.props.match.params.user_id,
            isLoading: true,
            previewPDF: false
        });


        axios(`http://localhost:5000/results`, {
            method: "GET",
            responseType: "blob"
            //Force to receive data in a Blob Format
        }).then(response => {
            //Create a Blob from the PDF Stream
            const file = new Blob([response.data], {
                type: "application/pdf"
            });
            //Build a URL from the file
            const fileURL = URL.createObjectURL(file);
            console.log("fileURL")
            console.log(fileURL)
            this.setState({
                results: fileURL,
                previewPDF: true,
                isLoading: false
            })
        }).catch(error => {
            console.log(error);
        });

        axios.get(`http://localhost:5000/get_file_names/${this.state.user_id}`)
            .then(response => {
                console.log(response)
            })
    }

    render() {

        return (
            <>
                {
                    this.state.isLoading ? <RingLoader size={150} color={"lightblue"} /> :
                        <p>done</p>
                }
                <div>
                    {this.state.previewPDF ?
                        <div>
                            <Document file={this.state.results} onLoadError={console.error}>
                                Armin is cutest
                                <Page pageNumber={1} />
                            </Document>
                        </div>
                        :
                        <p>no res</p>
                    }
                </div>
                <br />
                <button onClick={this.cleanUp}>Return back</button>
            </>

        )
    }
}

export default ResultsPage; 
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

    componentDidMount = () => {
        this.setState({
            user_id: this.state.history,
            isLoading: true,
            previewPDF: false
        });

        axios.get("http://localhost:5000/results")
            .then(response => {

                this.setState({
                    results: response.data,
                    previewPDF: true,
                    isLoading: false
                })
                console.log(response)


            }).catch(error => console.error(error)).then(() => {
                console.log(this.state.results)
            })


        // debugging purposes
        // this.setState({
        //     previewPDF: true,
        //     isLoading: false,
        //     results: testPDF
        // })
        // console.log(testPDF)
        // debugging purposes
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
                            <Document file={testPDF} onLoadError={console.error}>
                                Armin is cutest
                                <Page pageNumber={1} />
                            </Document>
                        </div>
                        :
                        <p>no res</p>
                    }
                </div>
            </>

        )
    }
}

export default ResultsPage; 
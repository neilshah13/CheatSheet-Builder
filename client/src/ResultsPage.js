import axios from 'axios';
import React, { Component } from 'react';
import RingLoader from "react-spinners/RingLoader";
import { Document, Page, pdfjs } from 'react-pdf'rmdir.git
import testPDF from "./e-final-coverpage.pdf"// debugging purposes

class ResultsPage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoading: null,
            results: null,
            previewPDF: null,
        };
    }

    getResultsPDF = () => {
        axios.get('http://localhost:5000/results')
    }

    componentDidMount = () => {
        this.setState({
            isLoading: true,
            previewPDF: false
        });

        axios.get("http://localhost:5000/results")
            .then(response => {

                this.setState({
                    results: response,
                    previewPDF: true,
                    isLoading: false
                })

            }).catch(error => console.error(error))

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
        pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

        return (
            <>
                {
                    this.state.isLoading ? <RingLoader size={150} color={"lightblue"} /> :
                        <p>done</p>
                }
                {
                    this.state.previewPDF ?
                        <Document file={{ data: Buffer.from(this.state.results.data) }}>
                            <Page pageNumber={1}></Page>
                        </Document>
                        :
                        <p>no res</p>
                }
            </>

        )
    }
}

export default ResultsPage; 
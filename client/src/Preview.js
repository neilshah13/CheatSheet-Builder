import React, { useState } from 'react';
import './Preview.css';

const Preview = (props) => {
    return props.previewList.map((val, idx) => {
        const imgUrl = URL.createObjectURL(val[0])
        const fileName = val[1]
        return (
            <>
                <section class="previewContainer">
                    <img src={imgUrl}></img>
                    <p>File Name: {fileName}</p>
                    <button onClick={() => props.delete(val)}> X</button>
                </section>
            </>
        )
    })

}



export default Preview;
import React, { useState } from 'react';
import './Preview.css';
import { Button, Card } from 'ui-neumorphism'
import 'ui-neumorphism/dist/index.css'


const Preview = (props) => {
    return props.previewList.map((val, idx) => {
        const imgUrl = URL.createObjectURL(val[0])
        const fileName = val[1]
        return (
            <Card>
                <img className="previewContainer" src={imgUrl}></img>
            </Card>
        )
    })
}



export default Preview;
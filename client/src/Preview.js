import React, { useState } from 'react';
import './Preview.css';

const Preview = (props) => {
    const [previewList, setPreviewList] = useState(props.previewList)
    const removeImage = idx => {
        const list = [...previewList];
        list.splice(idx, 1);
        setPreviewList(list);
    }

    return previewList.map((val, idx) => {
        const imgUrl = URL.createObjectURL(val[0])
        const fileName = val[1]
        return (
            <>
                <section class="previewContainer" key={val.index}>
                    <img src={imgUrl}></img>
                    <p>File Name: {fileName}</p>
                    <button onClick={() => removeImage(idx)}> X</button>
                </section>
            </>
        )
    })

}



export default Preview;
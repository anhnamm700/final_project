import React, { Component } from 'react';
// import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { CKEditor } from '@ckeditor/ckeditor5-react';

import style from './style.module.scss';

interface Props {
    value: string,
    // onChange: (event:any, editor: any) => void
    onChange: (data: any) => void
}

const CKEditorComponent = (props: Props) => {
        const { value, onChange } = props;

        return (
            <div className={style.editWrapper}>
                <CKEditor
                    editor={ ClassicEditor }
                    data={value}
                    onReady={ (editor: any) => {
                        // You can store the "editor" and use when it is needed.
                        // console.log( 'Editor is ready to use!', editor );
                    } }
                    onChange={ ( event: any, editor: any ) => {
                        const data = editor.getData();
                        // onChange(event, editor);
                        onChange(data);
                        // console.log( { event, editor, data } );
                    } }
                    onBlur={ ( event: any, editor: any ) => {
                        // console.log( 'Blur.', editor );
                    } }
                    onFocus={ ( event: any, editor: any ) => {
                        // console.log( 'Focus.', editor );
                    } }
                />
            </div>
        );
    }

export default CKEditorComponent;
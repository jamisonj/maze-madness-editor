import React from 'react';

const FileUpload = (props, ref) => (
    <input
        type="file"
        name="file"
        hidden
        ref={ref}
        onChange={props.onChange}
    />
);
export default React.forwardRef(FileUpload);

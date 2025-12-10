import React, {useEffect, useState} from "react";

import UploadModel from "../../typescript/models/builder/Upload";
import { Button, Row, Upload as UploadAnt } from "antd";
import { UploadOutlined } from "@ant-design/icons/lib";

import axios from 'axios';

const Upload = (props: any) => {

    let model: UploadModel = props.model;

    const [fileList, setFileList] = useState<any>(model._fileList ?? []);
    const [buttonState, setButtonState] = useState<any>({
        uploadLoading: false,
        uploadDisabled: model._fileWasUploaded,
    });

    let addProps = {
        fileList,
        onRemove: (file: any) => clearFiles(file),
        beforeUpload: (file: any) => {
            setFileList([...fileList, file])
            model._fileList = [...fileList, file];
            return false;
        },
    };

    const clearFiles = (file?: any) =>
    {
        let newFileList = fileList.slice();

        if (file) {
            newFileList.splice(fileList.indexOf(file), 1);
        } else {
            newFileList = [];
        }

        setFileList(newFileList)
        setButtonState({
            uploadLoading: false,
            uploadDisabled: false,
        })

        model._fileList = newFileList;
        model._fileWasUploaded = false;
        model._onFileDeleted();
    }

    const handleUpload = () =>
    {
        const formData = new FormData();

        fileList.forEach((file: any) => {
            formData.append('inspect', file);
        });

        axios({
            method: 'post',
            url: model._url(),
            data: formData,
            headers: model._header ? { ...{ 'Content-Type': 'multipart/form-data' }, ...model._header } : { 'Content-Type': 'multipart/form-data' }
        })
            .then((r) => {
                model._onThen?.(r);
                model._fileWasUploaded = true;
                setButtonState({
                    uploadLoading: false,
                    uploadDisabled: true,
                })
            })
            .catch((r) => {
                model._onCatch?.(r);
                model._fileWasUploaded = false;
                setButtonState({
                    uploadLoading: false,
                    uploadDisabled: false,
                })
            });
    };

    model.clearFiles = () => clearFiles();

    return (
        <Row style={ model._style ?? {}}>
            <UploadAnt {...addProps}>
                <Button disabled={fileList.length} icon={<UploadOutlined/>}>Upload Excel-fil (.xlxs)</Button>
            </UploadAnt>
            <Button
                type="primary"
                onClick={handleUpload}
                disabled={fileList.length === 0 || buttonState.uploadDisabled}
                loading={buttonState.uploadLoading}
                style={{ marginLeft: 12 }}
            >
                Upload
            </Button>
        </Row>
    );
}

export default Upload;
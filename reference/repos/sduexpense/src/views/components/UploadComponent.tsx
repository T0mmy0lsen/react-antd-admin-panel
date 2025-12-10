import React, { useEffect, useState } from "react";
import { Button as ButtonAntd, message, Upload, UploadFile, UploadProps } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import axios from "axios";

const MAX_NAME_LENGTH = 40;

/**
 * Upload component for expense line items
 * Handles file upload, download, and deletion for expense attachments
 */
export const UploadToList = ({ main, page, record, onChange, disabled }: any) => {
    const [fileList, setFileList] = useState<UploadFile[]>([]);

    // Initialize the fileList from record.upload on load
    useEffect(() => {
        if (record.upload && record.upload.length > 0) {
            const initialFileList = record.upload.map((file: any) => {
                const originalName = file.file || "";
                // Truncate the displayed name if > 40 chars
                const displayName = originalName.length > MAX_NAME_LENGTH
                    ? originalName.slice(0, MAX_NAME_LENGTH) + "..."
                    : originalName;

                return {
                    uid: file.id,
                    name: displayName,
                    status: "done",
                    preview: `${main.$config.config.pathToApi}RejseAfregning/${
                        page.formula.params()["id"]
                    }/udgiftpost/${record.id}/attachment/${file.id}`,
                    originalName: originalName,
                };
            });
            setFileList(initialFileList);
        }
    }, [record.upload, page, record]);

    const handleChange: UploadProps["onChange"] = async (info) => {
        // If disabled, don't allow any changes
        if (disabled) return;

        let newFileList = [...info.fileList];
        newFileList = newFileList.map((file) => {
            // If the server responded with an ID, store it as `uid`:
            if (file.response) {
                file.uid = file.response.id;
                file.preview = `${main.$config.config.pathToApi}RejseAfregning/${
                    page.formula.params()["id"]
                }/udgiftpost/${record.id}/attachment/${file.response.id}`;
            }

            // Truncate display name
            const originalName = file.name || "";
            const truncatedName =
                originalName.length > MAX_NAME_LENGTH
                    ? originalName.slice(0, MAX_NAME_LENGTH) + "..."
                    : originalName;

            return {
                ...file,
                name: truncatedName,
                originalName,
            };
        });

        setFileList(newFileList);
        record.upload = newFileList.map((file: any) => ({
            id: file.uid,
            // If you want to store the un-truncated name on the server:
            file: file.originalName,
        }));

        if (onChange) onChange();
    };

    const handleDownload = async (file: UploadFile) => {
        // Download the file from the server using its preview URL
        const response = await axios.get(file.preview!, {
            responseType: "blob",
            headers: {
                Authorization: `Bearer ${main.$account.accessToken}`,
            },
        });

        const blob = new Blob([response.data], { type: response.data.type });
        const url = window.URL.createObjectURL(blob);

        const link = document.createElement("a");
        link.href = url;
        // @ts-ignore – originalName is our custom field
        link.setAttribute("download", file.originalName);
        document.body.appendChild(link);
        link.click();
        link.parentNode?.removeChild(link);

        window.URL.revokeObjectURL(url);

        return false; // Return false to prevent default link behavior
    };

    const handleRemove = async (file: UploadFile) => {
        // If disabled, do nothing
        if (disabled) return false;

        try {
            await axios.delete(
                `${main.$config.config.pathToApi}RejseAfregning/${
                    page.formula.params()["id"]
                }/udgiftpost/${record.id}/attachment/${file.uid}`,
                {
                    headers: {
                        Authorization: `Bearer ${main.$account.accessToken}`,
                    },
                }
            );
            message.success(`${file.name} deleted successfully`);
            let newFileList = fileList.filter((item) => item.uid !== file.uid);
            setFileList(newFileList);
            record.upload = newFileList.map((f: any) => ({ id: f.uid, file: f.originalName }));
        } catch (error) {
            message.error(`Error deleting file: ${error}`);
        }

        if (onChange) onChange();

        // Return false means "don't also remove from fileList automatically"
        // but we did it manually above. If you return true, antd also removes it.
        return false;
    };

    const uploadProps: UploadProps = {
        accept: ".doc,.docx,.xls,.xlsx,.pdf,.png,.jpg,.jpeg",
        multiple: true,
        fileList,
        disabled,  // <-- Disables the upload mechanism
        action: `${main.$config.config.pathToApi}RejseAfregning/${
            page.formula.params()["id"]
        }/udgiftpost/${record.id}/attachment`,
        headers: {
            Authorization: `Bearer ${main.$account.accessToken}`,
        },
        onChange: handleChange,
        onRemove: handleRemove,
        onPreview: handleDownload,
        onDownload: handleDownload,
        // Hide or show icons depending on disabled state:
        showUploadList: {
            showPreviewIcon: true,
            showDownloadIcon: true,
            showRemoveIcon: !disabled, // hide the remove icon if disabled
        },
        listType: "picture",
        style: { width: "100%", marginTop: "-8px" },
    };

    return (
        <Upload {...uploadProps}>
            {/* The button is also disabled if `disabled` is true */}
            <ButtonAntd
                icon={<UploadOutlined />}
                style={{ marginBottom: 4, marginTop: -5 }}
                disabled={disabled}
            >
                Upload
            </ButtonAntd>
        </Upload>
    );
};

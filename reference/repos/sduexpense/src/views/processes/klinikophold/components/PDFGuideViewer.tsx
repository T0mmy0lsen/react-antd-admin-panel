import React, { useState, useEffect } from "react";
import { Document, Page, pdfjs } from 'react-pdf';

// Configure PDF.js worker with correct URL format
pdfjs.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.mjs`;

/**
 * PDF Guide Viewer Component
 * Displays the travel expense guide PDF for users to read
 */
export const PDFGuideViewer: React.FC = () => {
    const [numPages, setNumPages] = useState<number | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        console.log('PDFGuideViewer mounted');
        console.log('PDF.js version:', pdfjs.version);
        console.log('Worker src:', pdfjs.GlobalWorkerOptions.workerSrc);
    }, []);

    const onDocumentLoadSuccess = ({ numPages }: { numPages: number }) => {
        console.log('PDF loaded successfully with', numPages, 'pages');
        setNumPages(numPages);
        setLoading(false);
        setError(null);
    };

    const onDocumentLoadError = (error: Error) => {
        console.error('Error loading PDF:', error);
        setError(error.message);
        setLoading(false);
    };

    return (
        <div style={{ width: '100%', maxWidth: '850px', margin: '0 auto', padding: '20px' }}>
            <Document
                file="/guides/guide-rejseafregning-zexpense.pdf"
                onLoadSuccess={onDocumentLoadSuccess}
                onLoadError={onDocumentLoadError}
            >
                {numPages && Array.from(new Array(numPages), (el, index) => (
                    <div key={`page_${index + 1}`} style={{ marginBottom: '20px' }}>
                        <Page
                            pageNumber={index + 1}
                            width={800}
                            renderTextLayer={false}
                            renderAnnotationLayer={false}
                        />
                    </div>
                ))}
            </Document>
        </div>
    );
};

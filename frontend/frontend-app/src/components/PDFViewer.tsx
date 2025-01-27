import React, { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";
import { Viewer, Worker } from '@react-pdf-viewer/core';
import { defaultLayoutPlugin, DefaultLayoutPlugin } from "@react-pdf-viewer/default-layout";

import '@react-pdf-viewer/core/lib/styles/index.css';
import '@react-pdf-viewer/default-layout/lib/styles/index.css';
import './ui/PDFViewer.css';

// Initialize Supabase client
const supabaseUrl = process.env.REACT_APP_SUPABASE_URL!;
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

function PDFViewer(): JSX.Element {
    const [viewPdf, setViewPdf] = useState<string | null>(null);

    // Initialize PDF viewer plugin
    const newPlugin: DefaultLayoutPlugin = defaultLayoutPlugin();

    // Fetch the PDF file from Supabase
    useEffect(() => {
        const fetchPdf = async () => {
            const currentYear = new Date().getFullYear();
            const currentMonth = new Date().getMonth() + 1;

            const folderPath = currentMonth < 9 ? `${currentYear - 2}-${currentYear-1}` : `${currentYear-1}-${currentYear}`;

            const fileName = "zap2049_olimpiadi_01092023.pdf";
            
            const { data, error } = await supabase
                .storage
                .from('olympiads')
                .download(`${folderPath}/${fileName}`);

            if (error) {
                console.error("Error fetching PDF:", error.message);
                return;
            }

            if (data) {
                const url = URL.createObjectURL(data);
                setViewPdf(url);
            }
        };

        fetchPdf();
    }, []);

    return (
        <div className="container">
            <h2>View PDF</h2>
            <div className="pdf-container">
                <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.4.120/build/pdf.worker.min.js">
                    {viewPdf ? (
                        <Viewer fileUrl={viewPdf} plugins={[newPlugin]} />
                    ) : (
                        <p>Loading PDF... Please wait!</p>
                    )}
                </Worker>
            </div>
        </div>
    );
}

export default PDFViewer;

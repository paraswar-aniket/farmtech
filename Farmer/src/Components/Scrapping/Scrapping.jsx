import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './Scrapping.css'; // Importing the CSS file

export const Scrapping = () => {
    const [data, setData] = useState([]);
    const [headers, setHeaders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get('https://fbackend-zhrj.onrender.com/scrape/vegetables');
                setHeaders(response.data.headers || []);
                setData(response.data.data || []);
            } catch (error) {
                console.error("Error fetching data:", error);
                setError("Failed to load data. Please try again later.");
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    return (
        <div className="scraping-container">
            <h2>Vegetable Market Prices</h2>

            {loading ? (
                <p>Loading data...</p>
            ) : error ? (
                <p className="error-message">{error}</p>
            ) : (
                <div className="table-container">
                    <table className="price-table">
                        <thead>
                            <tr>
                                {headers.map((header, index) => (
                                    <th key={index}>{header}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {data.length > 0 ? (
                                data.map((row, rowIndex) => (
                                    <tr key={rowIndex}>
                                        {row.map((cell, cellIndex) => (
                                            <td key={cellIndex}>{cell}</td>
                                        ))}
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={headers.length} className="no-data">
                                        No data available
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

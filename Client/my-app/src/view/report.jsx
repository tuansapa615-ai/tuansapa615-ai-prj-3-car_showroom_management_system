import React, { useState } from 'react';
import axios from 'axios';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import 'bootstrap/dist/css/bootstrap.min.css';  
import config from '../config';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const Report = () => {
    const [startDate, setStartDate] = useState('2024-01-01'); 
    const [endDate, setEndDate] = useState('2024-12-31'); 
    const [summaryReport, setSummaryReport] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const fetchSummaryReport = async () => {
        setLoading(true);
        setError(null);

        try {
            const response = await axios.get(`${config.apiUrl}/Report/summary`, {
                params: {
                    startDate: startDate,
                    endDate: endDate
                }
            });

            setSummaryReport(response.data);
        } catch (error) {
            setError('Failed to fetch summary report');
        } finally {
            setLoading(false);
        }
    };

    const handleStartDateChange = (e) => setStartDate(e.target.value);
    const handleEndDateChange = (e) => setEndDate(e.target.value);
    const handleSubmit = (e) => {
        e.preventDefault();
        fetchSummaryReport();
    };

    const formatCurrency = (value) => {
        return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value);
    };

    const barChartData = summaryReport ? {
        labels: ['Total Price Sales', 'Total Price Orders ', 'Total Revenue Line'],
        datasets: [
            {
                label: 'Amount in USD',
                data: [
                    summaryReport.totalSalesAmount,
                    summaryReport.totalVehicleImportOrdersAmount,
                    summaryReport.totalRevenue
                ],
                backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56'],
                borderColor: ['#FF6384', '#36A2EB', '#FFCE56'],
                borderWidth: 1,
            },
        ],
    } : null;

    return (
        <div className="container mt-5">
            <h1 className="text-center mb-4">Summary Report</h1>
            <form onSubmit={handleSubmit} className="mb-4">
                <div className="row mb-3">
                    <div className="col-md-6">
                        <label>Start Date:</label>
                        <input
                            type="date"
                            value={startDate}
                            onChange={handleStartDateChange}
                            className="form-control"
                            required
                        />
                    </div>
                    <div className="col-md-6">
                        <label>End Date:</label>
                        <input
                            type="date"
                            value={endDate}
                            onChange={handleEndDateChange}
                            className="form-control"
                            required
                        />
                    </div>
                </div>
                <button type="submit" className="btn btn-primary btn-block">Get Report</button>
            </form>

            {loading && <p className="text-center">Loading...</p>}
            {error && <p className="text-danger text-center">{error}</p>}

            {summaryReport && (
                <div className="report-summary">
                    <div className='d-flex'><div className="col-6">
                        <p><strong>Total Employees:</strong> {summaryReport.totalEmployees}</p>
                        <p><strong>Total Customers:</strong> {summaryReport.totalCustomers}</p>
                        <p><strong>Total quantity Sales:</strong> {summaryReport.totalVehiclesSold}</p>
                        <p><strong>Total quantity Order:</strong> {summaryReport.totalVehiclesimport}</p>
                        <p><strong>Total quantity Vehicles:</strong> {summaryReport.totalVehicles}</p>
                        <p><strong>Total Billing Amount:</strong> {formatCurrency(summaryReport.totalBillingAmount)}</p>
                        <p><strong>Total Paid Amount:</strong> {formatCurrency(summaryReport.totalPaidAmount)}</p>
                        <p><strong>Total Unpaid Amount:</strong> {formatCurrency(summaryReport.totalUnpaidAmount)}</p>
                        <p><strong>Total Revenue Line:</strong> {formatCurrency(summaryReport.totalRevenue)}</p>
                        <p><strong>Total Price Sales:</strong> {formatCurrency(summaryReport.totalSalesAmount)}</p>
                        <p><strong>Total Price Orders:</strong> {formatCurrency(summaryReport.totalVehicleImportOrdersAmount)}</p>
                    </div>
                        <div className="col-6">
                            <div className="text-center">
                                <div style={{ width: '600px', margin: '0 auto' }}>
                                    <Bar
                                        data={barChartData}
                                        options={{
                                            responsive: true,
                                            plugins: {
                                                legend: {
                                                    position: 'top',
                                                },
                                                title: {
                                                    display: true,
                                                    text: 'Billing, Import, and Revenue Comparison',
                                                },
                                                tooltip: {
                                                    callbacks: {
                                                        label: function (tooltipItem) {
                                                            return formatCurrency(tooltipItem.raw);
                                                        }
                                                    }
                                                }
                                            },
                                        }}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Report;

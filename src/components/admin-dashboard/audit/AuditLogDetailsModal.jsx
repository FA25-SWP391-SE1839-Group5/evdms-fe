// File: components/admin-dashboard/system/audit-logs/AuditLogDetailsModal.jsx
import React from 'react';

// Hàm helper để format, có thể dùng lại từ component cha hoặc định nghĩa lại
const formatDateTimestamp = (isoString) => {
    if (!isoString) return 'N/A';
    return new Date(isoString).toLocaleString('en-GB', { dateStyle: 'medium', timeStyle: 'medium' });
};

const AuditLogDetailsModal = ({ show, onClose, log, userMap }) => {
    if (!show || !log) return null;

    const userName = userMap[log.userId]?.name || log.userId || 'System/Unknown';

    return (
        <>
            <div className={`modal fade ${show ? 'show d-block' : ''}`} tabIndex="-1" style={{ backgroundColor: show ? 'rgba(0,0,0,0.5)' : 'transparent' }}>
                <div className="modal-dialog modal-dialog-centered modal-lg" role="document">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title">Log Details - {log.action}</h5>
                            <button type="button" className="btn-close" onClick={onClose} aria-label="Close"></button>
                        </div>
                        <div className="modal-body">
                            <table className="table table-bordered">
                                <tbody>
                                    <tr>
                                        <th scope="row" style={{ width: '25%' }}>Log ID</th>
                                        <td><code>{log.id || 'N/A'}</code></td>
                                    </tr>
                                    <tr>
                                        <th scope="row">Timestamp</th>
                                        <td>{formatDateTimestamp(log.createdAt)}</td>
                                    </tr>
                                     <tr>
                                        <th scope="row">User</th>
                                        <td>{userName} (ID: <code>{log.userId || 'N/A'}</code>)</td>
                                    </tr>
                                    <tr>
                                        <th scope="row">Action</th>
                                        <td><span className="badge bg-label-primary text-uppercase">{log.action || 'N/A'}</span></td>
                                    </tr>
                                    <tr>
                                        <th scope="row">Description</th>
                                        <td>{log.description || '-'}</td>
                                    </tr>
                                    {/* Thêm các trường khác nếu API trả về (vd: IP Address, Target Entity...) */}
                                    {/*
                                    <tr>
                                        <th scope="row">Target ID</th>
                                        <td><code>{log.entityId || '-'}</code></td>
                                    </tr>
                                    <tr>
                                        <th scope="row">IP Address</th>
                                        <td>{log.ipAddress || '-'}</td>
                                    </tr>
                                    */}
                                </tbody>
                            </table>
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-outline-secondary" onClick={onClose}>Close</button>
                        </div>
                    </div>
                </div>
            </div>
            {show && <div className="modal-backdrop fade show"></div>}
        </>
    );
};

export default AuditLogDetailsModal;
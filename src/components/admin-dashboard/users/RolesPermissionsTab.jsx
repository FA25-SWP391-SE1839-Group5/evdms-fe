// File: components/admin-dashboard/users/RolesPermissionsTab.jsx
import React, { useMemo } from 'react';
import { Plus, Edit, Copy, User } from 'lucide-react'; // Example icons

// Helper to get initials or placeholder icon
const getAvatarInitials = (name) => {
    if (!name) return '?';
    const parts = name.split(' ');
    if (parts.length === 1) return name.substring(0, 1).toUpperCase();
    return (parts[0].substring(0, 1) + parts[parts.length - 1].substring(0, 1)).toUpperCase();
};

const RolesPermissionsTab = ({ users = [], formatRoleDisplay }) => { // Receive users and formatter

    // Define the roles you expect (Ideally, this should come from an API)
    const expectedRoles = ['Admin', 'DealerManager', 'DealerStaff', 'EVMStaff'];

    // Calculate user counts per role
    const roleStats = useMemo(() => {
        const stats = users.reduce((acc, user) => {
            const role = user.role || 'Unknown';
            acc[role] = (acc[role] || { count: 0, users: [] });
            acc[role].count++;
            // Store first few users for avatar display
            if (acc[role].users.length < 4) {
                acc[role].users.push(user);
            }
            return acc;
        }, {});

        // Ensure all expected roles appear, even with 0 users
        expectedRoles.forEach(role => {
            if (!stats[role]) {
                stats[role] = { count: 0, users: [] };
            }
        });
        return stats;
    }, [users]); // Recalculate when users change

    const handleEditRole = (role) => {
        alert(`Edit Role "${role}" clicked. (Requires API)`);
        // Here you would open the Edit Role Modal (image_391eff.png)
    };

    const handleAddRole = () => {
        alert('Add New Role clicked. (Requires API)');
        // Here you would open an Add Role Modal (similar to Edit Role)
    };

    return (
        <div>
            {/* Role Cards */}
            <h5 className="mb-4">Roles List</h5>
            <div className="row g-4 mb-4">
                {expectedRoles.map((roleKey) => {
                    const roleData = roleStats[roleKey];
                    const count = roleData?.count || 0;
                    const displayUsers = roleData?.users || [];
                    const extraUsers = Math.max(0, count - displayUsers.length);
                    const formattedRoleName = formatRoleDisplay ? formatRoleDisplay(roleKey) : roleKey; // Use formatter if available

                    return (
                        <div key={roleKey} className="col-xl-4 col-lg-6 col-md-6">
                            <div className="card">
                                <div className="card-body">
                                    <div className="d-flex justify-content-between mb-2">
                                        <h6 className="fw-normal mb-0">Total {count} users</h6>
                                        {/* Avatar Stack */}
                                        <ul className="list-unstyled d-flex align-items-center avatar-group mb-0">
                                            {displayUsers.map((user, index) => (
                                                <li key={user.id || index} data-bs-toggle="tooltip" data-popup="tooltip-custom" data-bs-placement="top" title={user.fullName} className="avatar avatar-sm pull-up">
                                                    {/* Placeholder Avatar - Replace with real images if available */}
                                                     <span className="avatar-initial rounded-circle bg-label-secondary">{getAvatarInitials(user.fullName)}</span>
                                                    {/* <img className="rounded-circle" src={`/path/to/avatars/${user.id}.png`} alt="Avatar" /> */}
                                                </li>
                                            ))}
                                             {extraUsers > 0 && (
                                                <li className="avatar avatar-sm">
                                                    <span className="avatar-initial rounded-circle pull-up bg-label-secondary" data-bs-toggle="tooltip" data-bs-placement="top" title={`${extraUsers} more users`}>+{extraUsers}</span>
                                                </li>
                                            )}
                                        </ul>
                                    </div>
                                    <div className="d-flex justify-content-between align-items-end">
                                        <div className="role-heading">
                                            <h5 className="mb-1">{formattedRoleName}</h5>
                                            <a href="#" onClick={(e) => { e.preventDefault(); handleEditRole(roleKey); }} className="role-edit-modal">
                                                <small>Edit Role</small>
                                            </a>
                                        </div>
                                        {/* Optional: Copy button if needed */}
                                        {/* <a href="#" onClick={(e) => e.preventDefault()} className="text-muted"><Copy size={18} /></a> */}
                                    </div>
                                </div>
                            </div>
                        </div>
                    );
                })}

                {/* Add Role Card */}
                <div className="col-xl-4 col-lg-6 col-md-6">
                    <div className="card h-100">
                        <div className="row h-100">
                            <div className="col-sm-5">
                                <div className="d-flex align-items-end h-100 justify-content-center mt-sm-0 mt-3">
                                    {/* Placeholder Illustration */}
                                    <img src="https://demos.themeselection.com/sneat-bootstrap-html-admin-template/assets/img/illustrations/lady-with-laptop-light.png" className="img-fluid" alt="Image" width="120" />
                                </div>
                            </div>
                            <div className="col-sm-7">
                                <div className="card-body text-sm-end text-center ps-sm-0">
                                    <button
                                        onClick={handleAddRole}
                                        className="btn btn-primary mb-3 text-nowrap add-new-role"
                                    >
                                        Add New Role
                                    </button>
                                    <p className="mb-0">Add new role,
                                         <br></br>if it doesn't exist.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div> {/* End Row */}

            {/* Permissions Section (Placeholder) */}
            <h5 className="mt-4 mb-4">Permissions List</h5>
            <div className="card">
                <div className="card-body">
                    <p>Permissions management requires dedicated backend APIs (GET/POST/PUT/DELETE for permissions and role-permission links).</p>
                    <p>Placeholder for Permissions Table (`image_392281.png`) would go here.</p>
                     <button className="btn btn-primary" disabled>
                        <Plus size={18} className="me-1"/> Add Permission (Requires API)
                    </button>
                </div>
            </div>

             {/* Modals (Placeholders - Render triggered by state, not shown here) */}
             {/* <EditRoleModal show={showEditRoleModal} onClose={...} role={...} allPermissions={...} /> */}
             {/* <EditPermissionModal show={showEditPermissionModal} onClose={...} permission={...} /> */}

        </div> // End main div
    );
};

export default RolesPermissionsTab;
import React from 'react'

export default function ProfileImageUpload() {
  return (
    <div className="d-flex align-items-start align-items-sm-center gap-4">
        <img
            src="../assets/img/avatars/1.png"
            alt="user-avatar"
            className="d-block rounded"
            height={100}
            width={100}
            id="uploadedAvatar"
        />
        <div className="button-wrapper">
            <label
                htmlFor="upload"
                className="btn btn-primary me-2 mb-4"
                tabIndex={0}
            >
            <span className="d-none d-sm-block">
                Upload new photo
            </span>
            <i className="bx bx-upload d-block d-sm-none" />
            <input
                type="file"
                id="upload"
                className="account-file-input"
                hidden=""
                accept="image/png, image/jpeg"
            />
            </label>
            <button
                type="button"
                className="btn btn-outline-secondary account-image-reset mb-4"
            >
                <i className="bx bx-reset d-block d-sm-none" />
                <span className="d-none d-sm-block">Reset</span>
            </button>
            <p className="text-muted mb-0">
                Allowed JPG, GIF or PNG. Max size of 800K
            </p>
        </div>
    </div>
  )
}

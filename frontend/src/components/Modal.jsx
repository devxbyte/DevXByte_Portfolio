import React, { useEffect } from 'react';
import { HiX, HiExternalLink } from 'react-icons/hi';
import '../styles/modal.css';

const Modal = ({ isOpen, onClose, data, type }) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isOpen]);

  if (!isOpen || !data) return null;

  return (
    <div className="modal-overlay active" onClick={onClose}>
      <div className="modal-content-glass" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>
          <HiX size={24} />
        </button>
        
        <div className="modal-image-container" style={{ flex: data.pdf ? '1 1 100%' : undefined, minHeight: data.pdf ? '70vh' : undefined }}>
          {data.pdf ? (
            <iframe src={data.pdf} width="100%" height="100%" style={{ border: 'none', minHeight: '70vh', borderRadius: '8px' }} title={data.title} />
          ) : data.image ? (
            <img src={data.image} alt={data.title} className="modal-image" />
          ) : (
            <div className="modal-image-placeholder">No Image Available</div>
          )}
        </div>

        <div className="modal-details">
          <h2 className="modal-title">{data.title}</h2>
          
          {type === 'project' && data.techStack && (
            <div className="modal-tech-stack">
              {data.techStack.map((tech, i) => (
                <span key={i} className="modal-tech-tag">{tech}</span>
              ))}
            </div>
          )}

          {type === 'certificate' && data.issuer && (
            <div className="modal-issuer">
              <strong>Issuer:</strong> {data.issuer}
            </div>
          )}

          <div className="modal-description">
            {data.description || 'No description provided.'}
          </div>

          {type === 'project' && data.liveUrl && (
            <div className="modal-actions">
              <a href={data.liveUrl} target="_blank" rel="noopener noreferrer" className="modal-btn primary">
                Visit Website <HiExternalLink />
              </a>
              {data.githubUrl && (
                <a href={data.githubUrl} target="_blank" rel="noopener noreferrer" className="modal-btn secondary">
                  View Source
                </a>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Modal;

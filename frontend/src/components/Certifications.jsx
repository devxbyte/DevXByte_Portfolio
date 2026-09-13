import { useState } from 'react';
import { useGsapFadeIn, useGsapStagger } from '../hooks/useGsap';
import { HiShieldCheck } from 'react-icons/hi';
import Modal from './Modal';

const Certifications = ({ data }) => {
  const [selectedCert, setSelectedCert] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const sectionRef = useGsapFadeIn();
  const gridRef = useGsapStagger('.cert-card');

  if (!data || !data.length) return null;

  return (
    <section className="section" id="certifications">
      <div className="container">
        <div className="section-header" ref={sectionRef}>
          <span className="section-label">Achievements</span>
          <h2 className="section-title">Certifications</h2>
        </div>

        <div className="certs-grid" ref={gridRef}>
          {data.map((cert, i) => (
            <div 
              key={cert._id || i} 
              className="cert-card"
              onClick={() => { setSelectedCert(cert); setIsModalOpen(true); }}
              style={{ cursor: 'pointer' }}
            >
              <div className="cert-icon">
                <HiShieldCheck />
              </div>
              <h3 className="cert-title">{cert.title}</h3>
              <p className="cert-issuer">{cert.issuer}</p>
              {cert.description && (
                <p className="cert-desc">{cert.description}</p>
              )}
            </div>
          ))}
        </div>
      </div>
      <Modal 
        isOpen={isModalOpen} 
        onClose={() => { setIsModalOpen(false); setSelectedCert(null); }} 
        data={selectedCert} 
        type="certificate" 
      />
    </section>
  );
};

export default Certifications;

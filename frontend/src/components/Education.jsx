import { useGsapFadeIn, useGsapStagger } from '../hooks/useGsap';
import { HiAcademicCap, HiLocationMarker, HiCalendar } from 'react-icons/hi';

const Education = ({ data }) => {
  const sectionRef = useGsapFadeIn();
  const gridRef = useGsapStagger('.education-card');

  if (!data || !data.length) return null;

  return (
    <section className="section" id="education">
      <div className="container">
        <div className="section-header" ref={sectionRef}>
          <span className="section-label">Background</span>
          <h2 className="section-title">Education</h2>
        </div>

        <div className="education-grid" ref={gridRef}>
          {data.map((edu, i) => (
            <div key={edu._id || i} className="education-card">
              <div className="education-icon">
                <HiAcademicCap />
              </div>
              <h3 className="education-degree">{edu.degree}</h3>
              <p className="education-institution">{edu.institution}</p>
              <div className="education-meta">
                {edu.location && (
                  <span><HiLocationMarker style={{ verticalAlign: 'middle' }} /> {edu.location}</span>
                )}
                <span><HiCalendar style={{ verticalAlign: 'middle' }} /> {edu.startDate} - {edu.endDate}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Education;

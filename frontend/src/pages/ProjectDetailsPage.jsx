import { useParams, Navigate } from 'react-router-dom';
import { HiExternalLink } from 'react-icons/hi';
import CTASection from '../components/CTASection';
import Footer from '../components/Footer';

const ProjectDetailsPage = ({ projects }) => {
  const { id } = useParams();
  
  // Find project by _id (or fallback to index-based for mock data)
  const project = projects?.find((p, index) => p._id === id || index.toString() === id);

  if (!project) {
    return <Navigate to="/work" replace />;
  }

  return (
    <>
      <div className="project-detail-hero" style={{ 
        padding: '120px 24px 40px', 
        minHeight: '40vh', 
        display: 'flex', 
        flexDirection: 'column', 
        justifyContent: 'center' 
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', width: '100%' }}>
          <h1 style={{
            fontSize: 'clamp(40px, 8vw, 80px)',
            fontWeight: 500,
            letterSpacing: '-2px',
            lineHeight: 1.1,
            marginBottom: '32px',
            color: 'var(--text-primary)'
          }}>
            {project.title}
          </h1>

          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', marginBottom: '40px' }}>
            {project.techStack?.map((tech, i) => (
              <span key={i} style={{
                background: 'var(--bg-secondary)',
                border: '1px solid var(--border)',
                color: 'var(--text-primary)',
                padding: '8px 16px',
                borderRadius: '100px',
                fontSize: '14px',
                fontWeight: '500'
              }}>
                {tech}
              </span>
            ))}
          </div>
        </div>
      </div>

      <div style={{ padding: '0 24px 60px' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', width: '100%' }}>
          {project.image && (
            <div style={{ 
              width: '100%', 
              aspectRatio: '16/9',
              borderRadius: '16px', 
              overflow: 'hidden',
              marginBottom: '40px',
              border: '1px solid var(--border)',
              background: 'var(--bg-secondary)'
            }}>
              <img 
                src={project.image} 
                alt={project.title} 
                style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
              />
            </div>
          )}

          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', 
            gap: '32px' 
          }}>
            <div>
              <h3 style={{ fontSize: '24px', marginBottom: '20px', color: 'var(--text-primary)' }}>Overview</h3>
              <p className="project-detail-desc" style={{ fontSize: '18px', lineHeight: 1.8, color: 'var(--text-secondary)', whiteSpace: 'pre-wrap' }}>
                {project.description}
              </p>
            </div>

            <div>
              <h3 style={{ fontSize: '24px', marginBottom: '20px', color: 'var(--text-primary)' }}>Links</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {project.liveUrl && (
                  <a href={project.liveUrl} target="_blank" rel="noopener noreferrer" style={{
                    display: 'inline-flex', alignItems: 'center', gap: '10px',
                    padding: '16px 32px', background: 'var(--accent)', color: 'white',
                    borderRadius: '100px', textDecoration: 'none', fontWeight: 500,
                    width: 'fit-content'
                  }}>
                    Visit Live Site <HiExternalLink size={20} />
                  </a>
                )}
                {project.githubUrl && (
                  <a href={project.githubUrl} target="_blank" rel="noopener noreferrer" style={{
                    display: 'inline-flex', alignItems: 'center', gap: '10px',
                    padding: '16px 32px', background: 'transparent', color: 'var(--text-primary)',
                    border: '1px solid var(--border)', borderRadius: '100px', 
                    textDecoration: 'none', fontWeight: 500, width: 'fit-content'
                  }}>
                    View Source Code
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <CTASection />
      <Footer />
    </>
  );
};

export default ProjectDetailsPage;

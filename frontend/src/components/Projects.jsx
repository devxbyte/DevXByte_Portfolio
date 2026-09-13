import { useGsapFadeIn, useGsapStagger } from '../hooks/useGsap';
import { FiExternalLink, FiGithub } from 'react-icons/fi';

const Projects = ({ data }) => {
  const sectionRef = useGsapFadeIn();
  const gridRef = useGsapStagger('.project-card');

  if (!data || !data.length) return null;

  return (
    <section className="section" id="projects">
      <div className="container">
        <div className="section-header" ref={sectionRef}>
          <span className="section-label">Portfolio</span>
          <h2 className="section-title">Featured Projects</h2>
          <p className="section-subtitle">
            Here are some of the projects I've built using modern web technologies.
          </p>
        </div>

        <div className="projects-grid" ref={gridRef}>
          {data.map((project, i) => (
            <div key={project._id || i} className="project-card">
              <div className="project-number">
                {String(i + 1).padStart(2, '0')}
              </div>
              <h3 className="project-title">{project.title}</h3>
              <p className="project-desc">{project.description}</p>

              {project.techStack && (
                <div className="project-tech">
                  {project.techStack.map((tech, j) => (
                    <span key={j} className="tech-tag">{tech}</span>
                  ))}
                </div>
              )}

              <div className="project-links">
                {project.liveUrl && (
                  <a href={project.liveUrl} className="project-link" target="_blank" rel="noopener noreferrer">
                    <FiExternalLink /> Live Demo
                  </a>
                )}
                {project.githubUrl && (
                  <a href={project.githubUrl} className="project-link" target="_blank" rel="noopener noreferrer">
                    <FiGithub /> GitHub
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Projects;

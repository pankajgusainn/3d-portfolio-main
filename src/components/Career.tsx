import "./styles/Career.css";

const Career = () => {
  return (
    <div className="career-section section-container">
      <div className="career-container">
        <h2>
          My career <span>&</span>
          <br /> experience
        </h2>
        <div className="career-info">
          <div className="career-timeline">
            <div className="career-dot"></div>
          </div>
          <div className="career-info-box">
            <div className="career-info-in">
              <div className="career-role">
                <h4>Associate Consultant</h4>
                <h5>LTIMindtree</h5>
              </div>
              <h3>SEP 2025 - Present</h3>
            </div>
            <p>
              Supporting a life sciences project applications at LTIMindtree
              Focused on system monitoring and incident resolution.
            </p>
          </div>
          <div className="career-info-box">
            <div className="career-info-in">
              <div className="career-role">
                <h4>Han Digital</h4>
                <h5>Data Annotator</h5>
              </div>
              <h3>June 2025 - SEP 2025</h3>
            </div>
            <p>
              Worked as a Japanese Data Annotator at Han Digital for AWS AI models
              Performed data labeling with a focus on accuracy and quality.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Career;

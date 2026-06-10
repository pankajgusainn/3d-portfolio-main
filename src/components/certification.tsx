import "./styles/certification.css";

const Certification = () => {
  return (
    <div className="certification-section">
      <a
        href="https://www.credly.com/badges/33c78ce3-6644-4a04-b901-2dd86b8be860/public_url"
        target="_blank"
        rel="noopener noreferrer"
        className="certification-card"
      >
        <img
          src="/images/awsbadge.png"
          alt="AWS Certified Solutions Architect Associate"
        />

        <div className="certification-info">
          <h3>AWS Certified Solutions Architect – Associate</h3>
          <p>Verify on Credly →</p>
        </div>
      </a>
    </div>
  );
};

export default Certification;
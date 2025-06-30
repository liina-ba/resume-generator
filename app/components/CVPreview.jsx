import React from "react";

const CVPreview = ({ answers }) => {
  return (
    <div id="cv-content" style={{ width: "210mm", padding: "20mm", fontFamily: "Arial, sans-serif", color: "#000" }}>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "2px solid #eee", paddingBottom: "10px" }}>
        <div>
          <h1 style={{ margin: 0 }}>{answers.name}</h1>
          <p>{answers.location} | {answers.phone} | {answers.email}</p>
        </div>
        {answers.photo && (
          <img src={answers.photo} alt="Profile" style={{ height: "80px", borderRadius: "50%" }} />
        )}
      </div>

      {/* Summary */}
      <p style={{ marginTop: "20px" }}>{answers.summary}</p>

      {/* Skills */}
      <h3>COMPÉTENCES</h3>
      <ul>
        {answers.skills?.split("\n").map((skill, index) => <li key={index}>{skill}</li>)}
      </ul>

      {/* Experience */}
      <h3>EXPÉRIENCE PROFESSIONNELLE</h3>
      {answers.experience?.split("\n\n").map((block, index) => (
        <div key={index}>
          <strong>{block.split("\n")[0]}</strong>
          <p>{block.split("\n").slice(1).join("\n")}</p>
        </div>
      ))}

      {/* Education */}
      <h3>FORMATION</h3>
      <p>{answers.education}</p>

      {/* Additional Experience */}
      {answers.additionalExperience && (
        <>
          <h3>EXPÉRIENCES COMPLÉMENTAIRES</h3>
          <p>{answers.additionalExperience}</p>
        </>
      )}
    </div>
  );
};

export default CVPreview;

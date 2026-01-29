"use client";

import { useState } from "react";

type CertificateResponse = {
  owner_name: string;
  course_name: string;
  offered_by: string;
  covered_topics: string[];
  issue_date: string;
  pdf_path: string;
  code: string;
};

export default function CertificatePage() {
  const [ownerName, setOwnerName] = useState("");
  const [courseName, setCourseName] = useState("");
  const [offeredBy, setOfferedBy] = useState("");
  const [topicsInput, setTopicsInput] = useState("");
  const [certificate, setCertificate] = useState<CertificateResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function createCertificate() {
    setLoading(true);
    setError(null);

    const coveredTopics = topicsInput
      .split(",")
      .map(t => t.trim())
      .filter(Boolean);

    try {
      // 1️⃣ Create certificate (JSON)
      const res = await fetch(
        "http://localhost:8080/api/v1/certificates",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            owner_name: ownerName,
            course_name: courseName,
            offered_by: offeredBy,
            covered_topics: coveredTopics
          })
        }
      );

      if (!res.ok) {
        throw new Error("Failed to create certificate");
      }

      const cert: CertificateResponse = await res.json();
      setCertificate(cert);
    } catch (err: any) {
      setError(err.message ?? "Unexpected error");
    } finally {
      setLoading(false);
    }
  }

  async function downloadPdf() {
    if (!certificate) return;

    const res = await fetch(
      `http://localhost:8080/api/v1/certificates/${certificate.code}/pdf`
    );

    if (!res.ok) {
      alert("Failed to download PDF");
      return;
    }

    const blob = await res.blob();
    const url = window.URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = `${certificate.code}.pdf`;
    document.body.appendChild(a);
    a.click();

    a.remove();
    window.URL.revokeObjectURL(url);
  }

  return (
    <div style={{ maxWidth: 520 }}>
      <h2>Create Certificate</h2>

      <input
        placeholder="Owner name"
        value={ownerName}
        onChange={(e) => setOwnerName(e.target.value)}
      />

      <input
        placeholder="Course name"
        value={courseName}
        onChange={(e) => setCourseName(e.target.value)}
      />

      <input
        placeholder="Offered by"
        value={offeredBy}
        onChange={(e) => setOfferedBy(e.target.value)}
      />

      <input
        placeholder="Covered topics (comma separated)"
        value={topicsInput}
        onChange={(e) => setTopicsInput(e.target.value)}
      />

      <button onClick={createCertificate} disabled={loading}>
        {loading ? "Creating..." : "Create Certificate"}
      </button>

      {error && <p style={{ color: "red" }}>{error}</p>}

      {certificate && (
        <>
          <hr />

          <h3>Certificate Created</h3>

          <p><b>Owner:</b> {certificate.owner_name}</p>
          <p><b>Course:</b> {certificate.course_name}</p>
          <p><b>Issued:</b> {new Date(certificate.issue_date).toLocaleString()}</p>
          <p><b>Code:</b> {certificate.code}</p>

          <button onClick={downloadPdf}>
            Download PDF
          </button>
        </>
      )}
    </div>
  );
}

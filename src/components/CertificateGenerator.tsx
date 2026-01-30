"use client";

import { useState } from "react";
import Link from "next/link";

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
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Unexpected error");
      }
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
  <div className="min-h-screen bg-white overflow-hidden relative">
    
    <div className="absolute inset-0 bg-gradient-to-br from-white via-blue-50/30 to-white pointer-events-none"></div>
    <div className="flex h-screen gap-6 p-6 relative z-10 items-center justify-center">
      
      <div className="flex-none w-96 h-auto flex flex-col justify-center backdrop-blur-xl bg-white/30 border border-white/40 rounded-3xl p-6 shadow-xl hover:bg-white/35 transition-all duration-300">
          <Link
              href="/verify"
              className="inline-block mt-3 text-sm font-semibold text-blue-600 hover:text-blue-800 transition"
            >
              → Go to Verify Certificate
            </Link>
        {/* ===== HEADER SECTION ===== */}
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-2 drop-shadow-sm">
            Create Certificate
          </h2>
          {/* Decorative line under title */}
          <div className="h-1 w-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"></div>
          <p className="text-gray-700 text-xs mt-2 font-medium">
            Fill in the details below
          </p>
          
        </div>
        <div className="space-y-3">
          
          {/* ===== INPUT FIELD 1: Owner Name ===== */}
          <div className="group">
            <label className="block text-xs font-semibold text-gray-800 mb-1">
              Owner Name *
            </label>
            <input
              placeholder="e.g., John Doe"
              value={ownerName}
              onChange={(e) => setOwnerName(e.target.value)}
              className="w-full px-3 py-2 backdrop-blur-sm bg-white/40 border-2 border-white/50 rounded-lg text-sm text-gray-900 placeholder-gray-500 focus:outline-none focus:bg-white/50 focus:border-blue-400 focus:ring-2 focus:ring-blue-300 transition-all duration-200 font-medium"
            />
          </div>

          {/* ===== INPUT FIELD 2: Course Name ===== */}
          <div className="group">
            <label className="block text-xs font-semibold text-gray-800 mb-1">
              Course Name *
            </label>
            <input
              placeholder="e.g., React Patterns"
              value={courseName}
              onChange={(e) => setCourseName(e.target.value)}
              className="w-full px-3 py-2 backdrop-blur-sm bg-white/40 border-2 border-white/50 rounded-lg text-sm text-gray-900 placeholder-gray-500 focus:outline-none focus:bg-white/50 focus:border-blue-400 focus:ring-2 focus:ring-blue-300 transition-all duration-200 font-medium"
            />
          </div>

          {/* ===== INPUT FIELD 3: Offered By ===== */}
          <div className="group">
            <label className="block text-xs font-semibold text-gray-800 mb-1">
              Offered By *
            </label>
            <input
              placeholder="e.g., Tech Academy"
              value={offeredBy}
              onChange={(e) => setOfferedBy(e.target.value)}
              className="w-full px-3 py-2 backdrop-blur-sm bg-white/40 border-2 border-white/50 rounded-lg text-sm text-gray-900 placeholder-gray-500 focus:outline-none focus:bg-white/50 focus:border-blue-400 focus:ring-2 focus:ring-blue-300 transition-all duration-200 font-medium"
            />
          </div>

          {/* ===== INPUT FIELD 4: Covered Topics ===== */}
          <div className="group">
            <label className="block text-xs font-semibold text-gray-800 mb-1">
              Topics (comma separated)
            </label>
            <textarea
              placeholder="e.g., Hooks, State, Performance"
              value={topicsInput}
              onChange={(e) => setTopicsInput(e.target.value)}
              className="w-full px-3 py-2 backdrop-blur-sm bg-white/40 border-2 border-white/50 rounded-lg text-sm text-gray-900 placeholder-gray-500 focus:outline-none focus:bg-white/50 focus:border-blue-400 focus:ring-2 focus:ring-blue-300 transition-all duration-200 rows-2 resize-none font-medium"
            />
            <p className="text-xs text-gray-600 mt-1">Separated by comma</p>
          </div>
        </div>

        {/* ===== ERROR MESSAGE ===== */}
        {error && (
          <div className="mt-4 p-3 backdrop-blur-sm bg-red-100/60 border-l-4 border-red-500 rounded-lg">
            <p className="text-xs text-red-800 font-semibold">
              ⚠️ {error}
            </p>
          </div>
        )}

        {/* ===== SUBMIT BUTTON ===== */}
        <button
          onClick={createCertificate}
          disabled={loading}
          className="w-full mt-4 bg-gradient-to-r from-blue-500 to-purple-500 text-white font-bold py-2 px-3 rounded-lg text-sm hover:from-blue-600 hover:to-purple-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 shadow-lg hover:shadow-xl flex items-center justify-center gap-2 group"
        >
          {loading ? (
            <>
              <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Creating...
            </>
          ) : (
            <>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Generate
            </>
          )}
        </button>
      </div>

      {/* ===== RIGHT SIDE: RESULT SECTION ===== */}
      <div className="flex-1 h-full backdrop-blur-xl bg-white/30 border border-white/40 rounded-3xl p-8 shadow-xl hover:bg-white/35 transition-all duration-300 flex items-center justify-center min-h-0 overflow-y-auto">
        
        {/* ===== EMPTY STATE ===== */}
        {!certificate && (
          <div className="text-center">
            <svg className="w-24 h-24 mx-auto text-gray-300 mb-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="text-gray-700 text-lg font-semibold">
              Fill the form and create a certificate
            </p>
            <p className="text-gray-500 text-sm mt-2">
              Your certificate will appear here
            </p>
          </div>
        )}

        {/* ===== SUCCESS STATE: Certificate Details ===== */}
        {certificate && (
          <div className="w-full flex flex-col justify-center animate-in fade-in slide-in-from-right-5 duration-500">
            
            {/* ===== SUCCESS HEADER ===== */}
            <div className="text-center mb-8">
              <div className="flex justify-center mb-4">
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-green-400 to-blue-400 rounded-full blur-lg opacity-60"></div>
                  <svg className="relative w-16 h-16 text-green-500 bg-white rounded-full p-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                </div>
              </div>
              <h3 className="text-3xl font-bold text-gray-900 mb-2">
                Certificate Created! 🎉
              </h3>
              <p className="text-gray-600 text-sm">
                Your certificate is ready to download
              </p>
            </div>

            {/* ===== CERTIFICATE INFO CARD ===== */}
            <div className="backdrop-blur-sm bg-white/50 border border-white/60 rounded-2xl p-6 space-y-4 mb-6">
              
              {/* Owner Info */}
              <div className="pb-4 border-b border-gray-300/50">
                <p className="text-gray-600 text-xs font-bold uppercase tracking-widest mb-2">Owner</p>
                <p className="text-gray-900 text-lg font-bold break-words">
                  {certificate.owner_name}
                </p>
              </div>

              {/* Course Info */}
              <div className="pb-4 border-b border-gray-300/50">
                <p className="text-gray-600 text-xs font-bold uppercase tracking-widest mb-2">Course</p>
                <p className="text-gray-900 text-lg font-bold break-words">
                  {certificate.course_name}
                </p>
              </div>

              {/* Issue Date */}
              <div className="pb-4 border-b border-gray-300/50">
                <p className="text-gray-600 text-xs font-bold uppercase tracking-widest mb-2">Issued Date</p>
                <p className="text-gray-900 text-lg font-bold">
                  {new Date(certificate.issue_date).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </p>
              </div>

              {/* Certificate Code with Copy Button */}
              <div>
                <p className="text-gray-600 text-xs font-bold uppercase tracking-widest mb-2">Certificate Code</p>
                <div className="relative group">
                  <div className="bg-gradient-to-r from-blue-200/30 to-purple-200/30 backdrop-blur-sm border border-blue-300/50 rounded-lg p-3 pr-12 flex items-center">
                    <p className="text-blue-700 font-mono text-sm font-bold break-all flex-1">
                      {certificate.code}
                    </p>
                    
                    {/* Auto Copy Button */}
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(certificate.code);
                      }}
                      className="absolute right-3 top-1/2 -translate-y-1/2 bg-blue-300/20 hover:bg-blue-400/40 rounded-lg p-2 transition-all duration-200"
                      title="Click to copy certificate code"
                    >
                      <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                      </svg>
                    </button>
                  </div>
                  <p className="text-xs text-blue-600 mt-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    Click to copy
                  </p>
                </div>
              </div>
            </div>

            {/* Download Button */}
            <button
              onClick={downloadPdf}
              className="w-full bg-gradient-to-r from-green-500 to-emerald-500 text-white font-bold py-3 px-4 rounded-lg hover:from-green-600 hover:to-emerald-600 transition-all duration-300 shadow-lg hover:shadow-xl flex items-center justify-center gap-2 group"
            >
              <svg className="w-5 h-5 group-hover:translate-y-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              Download PDF Certificate
            </button>
          </div>
        )}
      </div>

    </div>
  </div>
);
}
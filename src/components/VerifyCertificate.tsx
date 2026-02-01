"use client";

import { useState, useRef, DragEvent } from "react";
import Link from "next/link";

type VerifyResponse = {
  is_valid: boolean;
};

export default function VerifyCertificate() {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);
  const [result, setResult] = useState<boolean | null>(null);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = () => setIsDragOver(false);

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(false);
    if (e.dataTransfer.files?.[0]) {
      setFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) setFile(e.target.files[0]);
  };

  const verifyCertificate = async () => {
    if (!file) {
      alert("Please upload a PDF");
      return;
    }

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch(
        "http://localhost:8080/api/v1/certificates/verify/upload",
        { method: "POST", body: formData }
      );

      if (!res.ok) {
        throw new Error("Failed to verify certificate");
      }

      const data: VerifyResponse = await res.json();
      setResult(data.is_valid);

    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Unexpected error");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4">
      <div className="w-full max-w-xl bg-white rounded-3xl shadow-2xl p-8">
             <Link
              href="/create"
              className="inline-block mt-3 text-sm font-semibold text-blue-600 hover:text-blue-800 transition"
            >
              → Go to Create Certificate
            </Link>

  
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-blue-600 rounded-2xl mx-auto flex items-center justify-center mb-4">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622z"
              />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-slate-900">Verify Certificate</h1>
          <p className="text-slate-600 mt-2">
            Upload a PDF to verify authenticity
          </p>
        </div>

    
        {result !== null && (
          <div className="text-center mb-6">
            <div
              className={`w-24 h-24 mx-auto rounded-full flex items-center justify-center mb-4 ${
                result ? "bg-green-600" : "bg-red-600"
              }`}
            >
              <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {result ? (
                  <path strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                ) : (
                  <path strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                )}
              </svg>
            </div>
            <h2 className={`text-2xl font-bold ${result ? "text-green-600" : "text-red-600"}`}>
              {result ? "Certificate is VALID" : "Certificate is INVALID"}
            </h2>
            <button
              onClick={() => setResult(null)}
              className="mt-4 px-6 py-2 bg-slate-100 rounded-xl font-semibold"
            >
              Verify Another
            </button>
          </div>
        )}

   
        {result === null && (
          <>
            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition ${
                isDragOver
                  ? "border-blue-500 bg-blue-50"
                  : "border-slate-300 hover:border-blue-400"
              }`}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept="application/pdf"
                onChange={handleFileChange}
                className="hidden"
              />

              {file ? (
                <div>
                  <p className="font-semibold text-slate-900">{file.name}</p>
                  <p className="text-sm text-slate-500">
                    {(file.size / 1024).toFixed(2)} KB
                  </p>
                </div>
              ) : (
                <div>
                  <p className="text-lg font-medium text-slate-900">
                    Drag & drop your PDF here
                  </p>
                  <p className="text-slate-500 mt-1">
                    or click to browse
                  </p>
                </div>
              )}
            </div>

            <button
              onClick={verifyCertificate}
              disabled={loading || !file}
              className="mt-6 w-full py-4 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {loading && (
                <svg className="animate-spin w-5 h-5" viewBox="0 0 24 24">
                  <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                </svg>
              )}
              {loading ? "Verifying..." : "Verify Certificate"}
            </button>

            {error && (
              <div className="mt-4 text-red-600 bg-red-50 p-3 rounded-lg">
                {error}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

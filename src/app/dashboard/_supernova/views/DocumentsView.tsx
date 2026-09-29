"use client";

import { useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { useApp } from "../components/AppProvider";
import { DOCUMENTS } from "../lib/fixtures";
import { Button, Card, Icon, StatusBadge, EmptyState } from "../components/ui";
export default function DocumentsView() {
  const { persona, uploads, notify } = useApp(),
    item = useSearchParams().get("item");
  useEffect(() => {
    if (!item) return;
    const el = document.getElementById(`document-${item}`);
    el?.scrollIntoView({ block: "center", behavior: "auto" });
    el?.focus({ preventScroll: true });
  }, [item, persona]);
  return (
    <>
      <label
        className="sn-drop"
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => {
          e.preventDefault();
          uploads.add([...e.dataTransfer.files]);
        }}
      >
        <Icon name="documents" size={28} />
        <b>Drop a file here or click to upload</b>
        <small>PDF, JPG or PNG up to 10 MB</small>
        <input
          aria-label="Upload documents"
          type="file"
          accept=".pdf,.jpg,.jpeg,.png"
          multiple
          onChange={(e) => {
            uploads.add([...(e.target.files || [])]);
            e.target.value = "";
          }}
        />
      </label>
      {uploads.error && (
        <p className="sn-error" role="alert" style={{ marginBottom: 12 }}>
          {uploads.error}
        </p>
      )}
      <Card>
        {!DOCUMENTS[persona].length && !uploads.files.length && (
          <EmptyState>
            No documents yet. Start with your passport and latest transcripts —
            they’ll be ready the moment you need them for an application or a
            chance check.
          </EmptyState>
        )}
        {DOCUMENTS[persona].map((d) => (
          <div
            className={`sn-doc ${item === d.id ? "sn-doc-selected" : ""}`}
            id={`document-${d.id}`}
            tabIndex={-1}
            key={d.id}
            data-document
          >
            <span className="sn-doc-icon">PDF</span>
            <div className="sn-doc-main">
              <b>{d.name}</b>
              <small>{d.meta}</small>
            </div>
            <div className="sn-doc-used">
              <small>USED IN</small>
              {d.used.map((u) => (
                <StatusBadge key={u}>{u}</StatusBadge>
              ))}
            </div>
          </div>
        ))}
        {uploads.files.map((f) => (
          <div
            className={`sn-doc ${item === f.id ? "sn-doc-selected" : ""}`}
            id={`document-${f.id}`}
            tabIndex={-1}
            key={f.id}
            data-document
          >
            <span className="sn-doc-icon">
              {f.type === "application/pdf" ? "PDF" : "IMG"}
            </span>
            <div className="sn-doc-main">
              <b>{f.name}</b>
              <small>
                {Math.ceil(f.size / 1024)} KB · Local file · Ready to use
              </small>
            </div>
            <a
              href={f.url}
              target="_blank"
              rel="noreferrer"
              className="sn-button secondary"
            >
              Preview
            </a>
            <a href={f.url} download={f.name} className="sn-button secondary">
              Download
            </a>
            <Button
              variant="quiet"
              aria-label={`Remove ${f.name}`}
              onClick={() => {
                uploads.remove(f.id);
                notify("Document removed.");
              }}
            >
              <Icon name="close" size={15} />
            </Button>
          </div>
        ))}
      </Card>
    </>
  );
}

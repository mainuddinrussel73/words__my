import logo from './logo.svg';
import './App.css';
import {NotoSansBengali} from"./NotoSansBengali"; 
import React, { useEffect, useState } from "react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable"; // Correct import
const App = () => {
  const [words, setWords] = useState([]);
  const getRandomWords = (data, count = 10) => {
    const shuffled = [...data].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
  };
  const [showModal, setShowModal] = useState(false);

  const handleShowWords = () => {
    const selectedWords = getRandomWords(words, 10);
    setWords(selectedWords);
    setShowModal(true);
  };

  useEffect(() => {
    fetch(`https://api.jsonsilo.com/public/acbd9048-8278-41b9-a00f-a77eb88beb06`)
    .then((res) => {
      if (!res.ok) throw new Error('Failed to fetch');
      return res.json();
    })
    .then((data) => {
      console.log('Loaded JSON:', data);
      setWords(data);
    })
    .catch((err) => {
      console.error('Error loading JSON:', err);
    });
  }, []);
  const exportPDF = () => {
    const doc = new jsPDF();
    doc.text("Vocabulary Word Info", 4, 15);
    doc.addFileToVFS("NotoSansBengali.ttf", NotoSansBengali);
    doc.addFont("NotoSansBengali.ttf", "NotoSansBengali", "normal");


    const rows = Object.entries(words).map(([key,val]) => 
      [key,val.WORD, val.MEANINGE, val.MEANINGB,val.SYNONYM,val.ANTONYM]);

    doc.autoTable({
      head: [["No","Word", "Meaning","Meaning Bengali","Synonyms","Antonyms"]],
      body: rows,
      startY: 20,
      margin: { left: 5 },
      styles: { fontSize: 10, cellPadding: 3, font: "NotoSansBengali"  },
      columnStyles: { 0: { cellWidth: 15 }, 1: { cellWidth: 25 },2: { cellWidth: 40 }, 3: { cellWidth: 40 },4: { cellWidth: 40 },5: { cellWidth: 40 } },
    });
    doc.save("vocabulary-word.pdf");
  };
  return (
    <div className="p-6 container">
      <h1 className="text-2xl font-bold mb-6">Vocabulary Table</h1>
      <button className="export-button" onClick={exportPDF}>
            Export to PDF
      </button>
      <button className="export-button"onClick={handleShowWords}>Show 10 Random Words</button>

      <div className="overflow-x-auto table-wrapper ">
        <table className="min-w-full responsive-table border border-gray-300 rounded-md">
          <thead className="bg-gray-200 text-left">
            <tr>
              <th className="border p-2">ID</th>
              <th className="border p-2">Word</th>
              <th className="border p-2">Meaning (Bengali)</th>
              <th className="border p-2">Meaning (English)</th>
              <th className="border p-2">Synonyms</th>
              <th className="border p-2">Antonyms</th>
            </tr>
          </thead>
          <tbody>
            {words.map((item) => (
              <tr key={item.ID} className="hover:bg-gray-50">
                <td className="border p-2">{item.ID}</td>
                <td className="border p-2 font-semibold text-blue-600">{item.WORD}</td>
                <td className="border p-2 whitespace-pre-wrap">{item.MEANINGB}</td>
                <td className="border p-2 whitespace-pre-wrap">{item.MEANINGE}</td>
                <td className="border p-2 whitespace-pre-wrap">{item.SYNONYM}</td>
                <td className="border p-2 whitespace-pre-wrap">{item.ANTONYM}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
     
      {showModal && (
        <div className="modal">
          <div className="modal-content">
          <span
              onClick={() => setShowModal(false)}
              style={{
                position: "absolute",
                top: "10px",
                right: "15px",
                fontSize: "24px",
                cursor: "pointer",
                color: "#999",
              }}
            >
              &times;
            </span>
            <h3>Random Words</h3>
            <table className="responsive-table">
              <thead>
                <tr>
                  <th>WORD</th>
                  <th>MEANING (Bengali)</th>
                  <th>MEANING (English)</th>
                </tr>
              </thead>
              <tbody>
                {words.map((word) => (
                  <tr key={word.ID}>
                    <td>{word.WORD}</td>
                    <td>{word.MEANINGB}</td>
                    <td>{word.MEANINGE}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <button onClick={() => setShowModal(false)}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
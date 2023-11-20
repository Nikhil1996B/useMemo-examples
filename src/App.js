import "./styles.css";
import React, { useState, useEffect, useMemo } from "react";
import useFetchData from "./hooks/useFetchData";
import { PropTypes } from "prop-types";

const ReducedDisplay = ({ data }) => {
  if (!data) {
    return <div>No data</div>;
  }
  const tableTitle = useMemo(
    () => Object.keys((data || [])?.[0] || {}),
    [data],
  );

  const ifValuePresent = (data, key, value) =>
    data.some((filter) => filter[key] === value);

  const filteredAndReducedData = useMemo(
    () =>
      data.reduce((accumalator, curr) => {
        const { name, id, subject, score } = curr;
        const fallBackSubjectScore = { subject, score };
        if (ifValuePresent(accumalator || [], "id", curr?.id)) {
          accumalator = (accumalator || [])?.map((acc) => {
            const subjectScore = [...(acc?.subjectScore || [])];
            return acc?.id === curr?.id
              ? {
                  name: name,
                  id: id,
                  subjectScore: ifValuePresent(
                    acc?.subjectScore || [],
                    "subject",
                    subject,
                  )
                    ? subjectScore.map((subjectEntity) =>
                        subjectEntity?.subject === subject
                          ? {
                              ...(subjectEntity || {}),
                              score: (subjectEntity?.score || 0) + score,
                            }
                          : fallBackSubjectScore,
                      )
                    : [...subjectScore, fallBackSubjectScore],
                }
              : acc;
          });
          return accumalator;
        } else {
          accumalator.push({
            name,
            id,
            subjectScore: [fallBackSubjectScore],
          });
        }
        return accumalator;
      }, []),
    [data],
  );

  return (
    <>
      <pre>{JSON.stringify(filteredAndReducedData, null, 4)}</pre>
      <table>
        <tr>
          {tableTitle.map((title, index) => (
            <th key={index}>{title}</th>
          ))}
        </tr>
        {data.map((row) => (
          <tr key={row.id}>
            <td>{row.id}</td>
            <td>{row.name}</td>
            <td>{row.score}</td>
            <td>{row.subject}</td>
          </tr>
        ))}
      </table>
    </>
  );
};

ReducedDisplay.propTypes = {
  data: PropTypes.array,
};

const MemoizedTable = React.memo(ReducedDisplay);

export default function App() {
  const [displayTable, setDisplayTable] = useState(false);
  const { data, loading, error, fetchData } = useFetchData(
    "https://rf22v8-3001.csb.app/studentEntry",
  );

  useEffect(() => {
    fetchData();
  }, []);

  if (error) {
    return <div className="red-100 bg-slate-400 p-4">{error}</div>;
  }
  if (loading) {
    return (
      <div className="container mx-auto max-w-md mt-4">
        <div className="p-2 border rounded bg-yellow-500 text-white">
          Loading...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto max-w-md mt-4">
        {JSON.stringify(error)}
      </div>
    );
  }

  const handleReduceData = () => setDisplayTable((prev) => !prev);

  return (
    <div className="container mx-auto max-w-xl mt-4">
      {data ? (
        <>
          <pre>{JSON.stringify(data, null, 4)}</pre>
          <button
            className="outlined border rounded text-green"
            onClick={handleReduceData}
          >
            Display students data in table
          </button>
        </>
      ) : (
        data && data.length === 0 && <div>No data available</div>
      )}
      {displayTable && <MemoizedTable data={data} />}
    </div>
  );
}

import { useState } from "react";
import "./App.css";

const subjects = ["DAA", "CN", "Web Tech", "DS"];

const initialStudent = {
  prn: "",
  name: "",
  branch: "",
  semester: "",
};

const initialMarks = {
  DAA: {
    mse: "",
    ese: "",
  },
  CN: {
    mse: "",
    ese: "",
  },
  "Web Tech": {
    mse: "",
    ese: "",
  },
  DS: {
    mse: "",
    ese: "",
  },
};

/* =========================================
   GRADE CALCULATION
========================================= */

const getGrade = (marks) => {
  if (marks >= 91) return "A+";
  if (marks >= 81) return "A";
  if (marks >= 71) return "B+";
  if (marks >= 61) return "B";
  if (marks >= 51) return "C+";
  if (marks >= 40) return "C";

  return "F";
};

/* =========================================
   MAIN APP
========================================= */

function App() {
  const [student, setStudent] = useState(initialStudent);

  const [marks, setMarks] = useState(initialMarks);

  const [errors, setErrors] = useState({});

  const [result, setResult] = useState(null);

  /* =========================================
     STUDENT DETAILS
  ========================================= */

  const handleStudentChange = (event) => {
    const { name, value } = event.target;

    /* -----------------------------------------
       PRN VALIDATION
       Numbers only
    ----------------------------------------- */

    if (name === "prn") {
      if (!/^\d*$/.test(value)) {
        setErrors((previous) => ({
          ...previous,
          prn: "PRN Number must contain numbers only",
        }));

        return;
      }
    }

    /* -----------------------------------------
       STUDENT NAME VALIDATION
       Letters and spaces only
    ----------------------------------------- */

    if (name === "name") {
      if (!/^[A-Za-z ]*$/.test(value)) {
        setErrors((previous) => ({
          ...previous,
          name:
            "Student Name must contain letters and spaces only",
        }));

        return;
      }
    }

    /* -----------------------------------------
       BRANCH VALIDATION
       Letters and spaces only
    ----------------------------------------- */

    if (name === "branch") {
      if (!/^[A-Za-z ]*$/.test(value)) {
        setErrors((previous) => ({
          ...previous,
          branch:
            "Branch must contain letters and spaces only",
        }));

        return;
      }
    }

    /* -----------------------------------------
       UPDATE STUDENT DATA
    ----------------------------------------- */

    setStudent((previous) => ({
      ...previous,
      [name]: value,
    }));

    /* -----------------------------------------
       CLEAR ERROR AFTER VALID INPUT
    ----------------------------------------- */

    setErrors((previous) => ({
      ...previous,
      [name]: "",
    }));
  };

  /* =========================================
     MARKS INPUT
  ========================================= */

  const handleMarksChange = (
    subject,
    type,
    value
  ) => {
    /* -----------------------------------------
       ALLOW EMPTY VALUE
    ----------------------------------------- */

    if (value === "") {
      setMarks((previous) => ({
        ...previous,

        [subject]: {
          ...previous[subject],
          [type]: "",
        },
      }));

      setErrors((previous) => ({
        ...previous,
        [`${subject}-${type}`]: "",
      }));

      return;
    }

    const numericValue = Number(value);

    /* -----------------------------------------
       MARKS MUST BE BETWEEN 0 AND 100
    ----------------------------------------- */

    if (
      numericValue < 0 ||
      numericValue > 100
    ) {
      setErrors((previous) => ({
        ...previous,

        [`${subject}-${type}`]:
          "Marks must be between 0 and 100",
      }));

      return;
    }

    /* -----------------------------------------
       UPDATE MARKS
    ----------------------------------------- */

    setMarks((previous) => ({
      ...previous,

      [subject]: {
        ...previous[subject],
        [type]: value,
      },
    }));

    /* -----------------------------------------
       CLEAR ERROR
    ----------------------------------------- */

    setErrors((previous) => ({
      ...previous,
      [`${subject}-${type}`]: "",
    }));
  };

  /* =========================================
     FORM VALIDATION
  ========================================= */

  const validateForm = () => {
    const newErrors = {};

    /* -----------------------------------------
       PRN VALIDATION
    ----------------------------------------- */

    if (!student.prn.trim()) {
      newErrors.prn =
        "PRN Number is required";
    } else if (!/^\d+$/.test(student.prn.trim())) {
      newErrors.prn =
        "PRN Number must contain numbers only";
    }

    /* -----------------------------------------
       STUDENT NAME VALIDATION
    ----------------------------------------- */

    if (!student.name.trim()) {
      newErrors.name =
        "Student name is required";
    } else if (
      !/^[A-Za-z ]+$/.test(student.name.trim())
    ) {
      newErrors.name =
        "Student Name must contain letters and spaces only";
    }

    /* -----------------------------------------
       BRANCH VALIDATION
    ----------------------------------------- */

    if (!student.branch.trim()) {
      newErrors.branch =
        "Branch is required";
    } else if (
      !/^[A-Za-z ]+$/.test(student.branch.trim())
    ) {
      newErrors.branch =
        "Branch must contain letters and spaces only";
    }

    /* -----------------------------------------
       SEMESTER VALIDATION
    ----------------------------------------- */

    if (!student.semester) {
      newErrors.semester =
        "Semester is required";
    }

    /* -----------------------------------------
       SUBJECT MARKS VALIDATION
    ----------------------------------------- */

    subjects.forEach((subject) => {
      const mse = marks[subject].mse;

      const ese = marks[subject].ese;

      /* MSE */

      if (mse === "") {
        newErrors[
          `${subject}-mse`
        ] = "Required";
      } else if (
        Number(mse) < 0 ||
        Number(mse) > 100
      ) {
        newErrors[
          `${subject}-mse`
        ] =
          "Marks must be between 0 and 100";
      }

      /* ESE */

      if (ese === "") {
        newErrors[
          `${subject}-ese`
        ] = "Required";
      } else if (
        Number(ese) < 0 ||
        Number(ese) > 100
      ) {
        newErrors[
          `${subject}-ese`
        ] =
          "Marks must be between 0 and 100";
      }
    });

    setErrors(newErrors);

    return (
      Object.keys(newErrors).length === 0
    );
  };

  /* =========================================
     GENERATE RESULT
  ========================================= */

  const generateResult = () => {
    if (!validateForm()) {
      setResult(null);
      return;
    }

    /* -----------------------------------------
       CALCULATE SUBJECT RESULTS
    ----------------------------------------- */

    const calculatedSubjects =
      subjects.map((subject) => {
        const mse =
          Number(marks[subject].mse);

        const ese =
          Number(marks[subject].ese);

        /*
          Final Marks =
          30% of MSE + 70% of ESE
        */

        const finalMarks =
          mse * 0.30 +
          ese * 0.70;

        const roundedMarks =
          Number(finalMarks.toFixed(2));

        const grade =
          getGrade(roundedMarks);

        const status =
          roundedMarks >= 40
            ? "PASS"
            : "FAIL";

        return {
          subject,

          mse,

          ese,

          finalMarks:
            roundedMarks,

          grade,

          status,
        };
      });

    /* =========================================
       TOTAL MARKS
    ========================================= */

    const total =
      calculatedSubjects.reduce(
        (sum, subject) =>
          sum + subject.finalMarks,
        0
      );

    const roundedTotal =
      Number(total.toFixed(2));

    /*
      Maximum marks = 400
    */

    const percentage =
      Number(
        (
          (roundedTotal / 400) *
          100
        ).toFixed(2)
      );

    /* =========================================
       OVERALL RESULT
    ========================================= */

    /*
      If even ONE subject has final marks
      below 40, complete result is FAIL.
    */

    const overallPass =
      calculatedSubjects.every(
        (subject) =>
          subject.finalMarks >= 40
      );

    setResult({
      subjects:
        calculatedSubjects,

      total:
        roundedTotal,

      percentage,

      overallResult:
        overallPass
          ? "PASS"
          : "FAIL",
    });

    /* -----------------------------------------
       SCROLL TO RESULT
    ----------------------------------------- */

    setTimeout(() => {
      document
        .getElementById(
          "result-section"
        )
        ?.scrollIntoView({
          behavior: "smooth",
        });
    }, 100);
  };

  /* =========================================
     RESET
  ========================================= */

  const resetForm = () => {
    setStudent(initialStudent);

    setMarks(initialMarks);

    setErrors({});

    setResult(null);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  /* =========================================
     PRINT
  ========================================= */

  const printResult = () => {
    window.print();
  };

  /* =========================================
     RETURN
  ========================================= */

  return (
    <div className="app">

      {/* =====================================
          HEADER
      ===================================== */}

      <header className="header">

        <div className="header-inner">

          <h1>
            Student Result Generation System
          </h1>

          <p>
              {/* Web Technology Assignment */}
          </p>

        </div>

      </header>


      <main className="container">

        {/* =====================================
            STUDENT INFORMATION
        ===================================== */}

        <section className="card">

          <div className="section-title">

            <h2>
              Student Information
            </h2>

            <p>
              Enter student details.
            </p>

          </div>


          <div className="student-grid">

            {/* PRN */}

            <div className="field">

              <label>
                PRN Number
              </label>

              <input
                type="text"
                name="prn"
                value={student.prn}
                onChange={
                  handleStudentChange
                }
                placeholder="Enter PRN Number"
                inputMode="numeric"
              />

              {errors.prn && (

                <span className="error">
                  {errors.prn}
                </span>

              )}

            </div>


            {/* NAME */}

            <div className="field">

              <label>
                Student Name
              </label>

              <input
                type="text"
                name="name"
                value={student.name}
                onChange={
                  handleStudentChange
                }
                placeholder="Enter Student Name"
              />

              {errors.name && (

                <span className="error">
                  {errors.name}
                </span>

              )}

            </div>


            {/* BRANCH */}

            <div className="field">

              <label>
                Branch
              </label>

              <input
                type="text"
                name="branch"
                value={student.branch}
                onChange={
                  handleStudentChange
                }
                placeholder="Enter Branch"
              />

              {errors.branch && (

                <span className="error">
                  {errors.branch}
                </span>

              )}

            </div>


            {/* SEMESTER */}

            <div className="field">

              <label>
                Semester
              </label>

              <select
                name="semester"
                value={
                  student.semester
                }
                onChange={
                  handleStudentChange
                }
              >

                <option value="">
                  Select Semester
                </option>

                {[1, 2, 3, 4, 5, 6, 7, 8]
                  .map((semester) => (

                    <option
                      key={semester}
                      value={semester}
                    >
                      Semester {semester}
                    </option>

                  ))}

              </select>


              {errors.semester && (

                <span className="error">
                  {errors.semester}
                </span>

              )}

            </div>

          </div>

        </section>


        {/* =====================================
            MARKS SECTION
        ===================================== */}

        <section className="card">

          <div className="section-title">

            <h2>
              Enter Marks
            </h2>

            <p>
              Enter MSE and ESE marks out of 100.
            </p>

          </div>


          {/* RULES */}

          <div className="rules">

            <div>

              <strong>
                MSE
              </strong>

              <span>
                30%
              </span>

            </div>


            <div>

              <strong>
                ESE
              </strong>

              <span>
                70%
              </span>

            </div>


            <div>

              <strong>
                Passing
              </strong>

              <span>
                40 / 100
              </span>

            </div>


            <div>

              <strong>
                Total
              </strong>

              <span>
                400
              </span>

            </div>

          </div>


          {/* MARKS TABLE */}

          <div className="table-container">

            <table>

              <thead>

                <tr>

                  <th>
                    Subject
                  </th>

                  <th>
                    MSE
                    <br />
                    / 100
                  </th>

                  <th>
                    ESE
                    <br />
                    / 100
                  </th>

                </tr>

              </thead>


              <tbody>

                {subjects.map(
                  (subject) => (

                    <tr
                      key={subject}
                    >

                      <td className="subject">
                        {subject}
                      </td>


                      <td>

                        <input
                          type="number"
                          min="0"
                          max="100"
                          step="1"
                          value={
                            marks[
                              subject
                            ].mse
                          }
                          placeholder="0 - 100"
                          onChange={(event) =>
                            handleMarksChange(
                              subject,
                              "mse",
                              event.target.value
                            )
                          }
                        />


                        {errors[
                          `${subject}-mse`
                        ] && (

                          <span className="error">

                            {
                              errors[
                                `${subject}-mse`
                              ]
                            }

                          </span>

                        )}

                      </td>


                      <td>

                        <input
                          type="number"
                          min="0"
                          max="100"
                          step="1"
                          value={
                            marks[
                              subject
                            ].ese
                          }
                          placeholder="0 - 100"
                          onChange={(event) =>
                            handleMarksChange(
                              subject,
                              "ese",
                              event.target.value
                            )
                          }
                        />


                        {errors[
                          `${subject}-ese`
                        ] && (

                          <span className="error">

                            {
                              errors[
                                `${subject}-ese`
                              ]
                            }

                          </span>

                        )}

                      </td>

                    </tr>

                  )
                )}

              </tbody>

            </table>

          </div>


          {/* FORMULA */}

          <div className="formula">

            <strong>
              Calculation:
            </strong>

            Final Marks =
            (MSE × 30%) +
            (ESE × 70%)

          </div>


          {/* BUTTONS */}

          <div className="buttons">

            <button
              className="primary-button"
              onClick={
                generateResult
              }
            >
              Generate Result
            </button>


            <button
              className="secondary-button"
              onClick={
                resetForm
              }
            >
              Reset
            </button>

          </div>

        </section>


        {/* =====================================
            RESULT
        ===================================== */}

        {result && (

          <section
            id="result-section"
            className="result"
          >

            {/* RESULT HEADER */}

            <div className="result-heading">

            <img
           src="/vit-logo.png"
           alt="VIT Pune Logo"
           className="college-logo"
           />

           <h1>
            VISHWAKARMA INSTITUTE OF TECHNOLOGY, PUNE
            </h1>

            <h2>
            STUDENT RESULT
           </h2>

            <p>
            STATEMENT OF MARKS
            </p>

           </div>


            {/* STUDENT DETAILS */}

            <div className="result-info">

              <div>

                <span>
                  PRN Number
                </span>

                <strong>
                  {student.prn}
                </strong>

              </div>


              <div>

                <span>
                  Student Name
                </span>

                <strong>
                  {student.name}
                </strong>

              </div>


              <div>

                <span>
                  Branch
                </span>

                <strong>
                  {student.branch}
                </strong>

              </div>


              <div>

                <span>
                  Semester
                </span>

                <strong>
                  Semester {student.semester}
                </strong>

              </div>

            </div>


            {/* RESULT TABLE */}

            <div className="table-container">

              <table className="result-table">

                <thead>

                  <tr>

                    <th>
                      Sr.
                    </th>

                    <th>
                      Subject
                    </th>

                    <th>
                      MSE
                      <br />
                      /100
                    </th>

                    <th>
                      ESE
                      <br />
                      /100
                    </th>

                    <th>
                      Final
                      <br />
                      /100
                    </th>

                    <th>
                      Grade
                    </th>

                    <th>
                      Status
                    </th>

                  </tr>

                </thead>


                <tbody>

                  {result.subjects.map(
                    (subject, index) => (

                      <tr
                        key={
                          subject.subject
                        }
                      >

                        <td>
                          {index + 1}
                        </td>

                        <td className="subject">
                          {
                            subject.subject
                          }
                        </td>

                        <td>
                          {subject.mse}
                        </td>

                        <td>
                          {subject.ese}
                        </td>

                        <td className="bold">
                          {
                            subject.finalMarks
                          }
                        </td>

                        <td className="grade">
                          {subject.grade}
                        </td>

                        <td>

                          <span
                            className={
                              subject.status ===
                              "PASS"
                                ? "pass"
                                : "fail"
                            }
                          >
                            {
                              subject.status
                            }
                          </span>

                        </td>

                      </tr>

                    )
                  )}

                </tbody>

              </table>

            </div>


            {/* SUMMARY */}

            <div className="summary">

              <div>

                <span>
                  Total Marks
                </span>

                <strong>
                  {result.total} / 400
                </strong>

              </div>


              <div>

                <span>
                  Percentage
                </span>

                <strong>
                  {result.percentage}%
                </strong>

              </div>


              <div
                className={
                  result.overallResult ===
                  "PASS"
                    ? "overall-pass"
                    : "overall-fail"
                }
              >

                <span>
                  Overall Result
                </span>

                <strong>
                  {
                    result.overallResult
                  }
                </strong>

              </div>

            </div>


            {/* GRADE SCALE */}

            <div className="grade-scale">

              <h3>
                Grade Scale
              </h3>


              <table>

                <thead>

                  <tr>

                    <th>
                      Marks
                    </th>

                    <th>
                      Grade
                    </th>

                  </tr>

                </thead>


                <tbody>

                  <tr>
                    <td>
                      91 - 100
                    </td>
                    <td>
                      A+
                    </td>
                  </tr>

                  <tr>
                    <td>
                      81 - 90
                    </td>
                    <td>
                      A
                    </td>
                  </tr>

                  <tr>
                    <td>
                      71 - 80
                    </td>
                    <td>
                      B+
                    </td>
                  </tr>

                  <tr>
                    <td>
                      61 - 70
                    </td>
                    <td>
                      B
                    </td>
                  </tr>

                  <tr>
                    <td>
                      51 - 60
                    </td>
                    <td>
                      C+
                    </td>
                  </tr>

                  <tr>
                    <td>
                      40 - 50
                    </td>
                    <td>
                      C
                    </td>
                  </tr>

                  <tr>
                    <td>
                      Below 40
                    </td>
                    <td>
                      F
                    </td>
                  </tr>

                </tbody>

              </table>

            </div>


            {/* NOTE */}

            <div className="note">

              <strong>
                Note:
              </strong>

              <p>
                Final marks are calculated using
                30% of MSE and 70% of ESE.
                A minimum of 40 marks is required
                in every subject. Failure in any
                one subject results in an overall
                FAIL.
              </p>

            </div>


            {/* PRINT BUTTON */}

            <div className="print-area">

              <button
                className="print-button"
                onClick={
                  printResult
                }
              >
                Print Result
              </button>

            </div>

          </section>

        )}

      </main>


      {/* =====================================
          FOOTER
      ===================================== */}

      <footer>
        Student Result Generation System
        | React
      </footer>

    </div>
  );
}

export default App;
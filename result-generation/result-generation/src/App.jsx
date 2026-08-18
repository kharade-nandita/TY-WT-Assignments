import { useState } from "react";
import QRCode from "qrcode";
import "./App.css";

const subjects = ["DAA", "CN", "Web Tech", "DS"];

const initialStudent = {
  prn: "",
  name: "",
  branch: "",
  semester: "",
};

const createInitialMarks = () => ({
  DAA: {
    mse: "",
    ese: "",
    mseAbsent: false,
    eseAbsent: false,
  },

  CN: {
    mse: "",
    ese: "",
    mseAbsent: false,
    eseAbsent: false,
  },

  "Web Tech": {
    mse: "",
    ese: "",
    mseAbsent: false,
    eseAbsent: false,
  },

  DS: {
    mse: "",
    ese: "",
    mseAbsent: false,
    eseAbsent: false,
  },
});

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

  const [marks, setMarks] = useState(createInitialMarks());

  const [errors, setErrors] = useState({});

  const [result, setResult] = useState(null);

  const [qrCode, setQrCode] = useState("");

  const [currentStep, setCurrentStep] = useState(1);

  /* =========================================
     STUDENT DETAILS
  ========================================= */

  const handleStudentChange = (event) => {
    const { name, value } = event.target;

    /* PRN */
    if (name === "prn") {
      if (!/^\d*$/.test(value)) {
        setErrors((previous) => ({
          ...previous,
          prn: "PRN Number must contain numbers only",
        }));

        return;
      }
    }

    /* NAME */
    if (name === "name") {
      if (!/^[A-Za-z ]*$/.test(value)) {
        setErrors((previous) => ({
          ...previous,
          name: "Student Name must contain letters and spaces only",
        }));

        return;
      }
    }

    /* BRANCH */
    if (name === "branch") {
      if (!/^[A-Za-z ]*$/.test(value)) {
        setErrors((previous) => ({
          ...previous,
          branch: "Branch must contain letters and spaces only",
        }));

        return;
      }
    }

    setStudent((previous) => ({
      ...previous,
      [name]: value,
    }));

    setErrors((previous) => ({
      ...previous,
      [name]: "",
    }));
  };

  /* =========================================
     MARKS CHANGE
  ========================================= */

  const handleMarksChange = (subject, type, value) => {
    const errorKey = `${subject}-${type}`;

    /* Allow empty input */
    if (value === "") {
      setMarks((previous) => ({
        ...previous,

        [subject]: {
          ...previous[subject],
          [type]: "",
          [`${type}Absent`]: false,
        },
      }));

      setErrors((previous) => ({
        ...previous,
        [errorKey]: "",
      }));

      return;
    }

    const numericValue = Number(value);

    /* Validate marks */
    if (
      Number.isNaN(numericValue) ||
      numericValue < 0 ||
      numericValue > 100
    ) {
      setErrors((previous) => ({
        ...previous,
        [errorKey]: "Marks must be between 0 and 100",
      }));

      return;
    }

    setMarks((previous) => ({
      ...previous,

      [subject]: {
        ...previous[subject],
        [type]: value,
        [`${type}Absent`]: false,
      },
    }));

    setErrors((previous) => ({
      ...previous,
      [errorKey]: "",
    }));
  };

  /* =========================================
     ABSENT HANDLER
  ========================================= */

  const handleAbsentChange = (subject, type, isAbsent) => {
    setMarks((previous) => ({
      ...previous,

      [subject]: {
        ...previous[subject],

        [type]: isAbsent ? "" : previous[subject][type],

        [`${type}Absent`]: isAbsent,
      },
    }));

    setErrors((previous) => ({
      ...previous,
      [`${subject}-${type}`]: "",
    }));
  };

  /* =========================================
     VALIDATION
  ========================================= */

  const validateForm = () => {
    const newErrors = {};

    /* PRN */

    if (!student.prn.trim()) {
      newErrors.prn = "PRN Number is required";
    } else if (!/^\d+$/.test(student.prn.trim())) {
      newErrors.prn = "PRN Number must contain numbers only";
    }

    /* NAME */

    if (!student.name.trim()) {
      newErrors.name = "Student name is required";
    } else if (!/^[A-Za-z ]+$/.test(student.name.trim())) {
      newErrors.name =
        "Student Name must contain letters and spaces only";
    }

    /* BRANCH */

    if (!student.branch.trim()) {
      newErrors.branch = "Branch is required";
    } else if (!/^[A-Za-z ]+$/.test(student.branch.trim())) {
      newErrors.branch =
        "Branch must contain letters and spaces only";
    }

    /* SEMESTER */

    if (!student.semester) {
      newErrors.semester = "Semester is required";
    }

    /* SUBJECT MARKS */

    subjects.forEach((subject) => {
      const subjectMarks = marks[subject];

      const mse = subjectMarks.mse;
      const ese = subjectMarks.ese;

      const mseAbsent = subjectMarks.mseAbsent;
      const eseAbsent = subjectMarks.eseAbsent;

      /* MSE */

      if (!mseAbsent && mse === "") {
        newErrors[`${subject}-mse`] = "Required";
      }

      if (
        !mseAbsent &&
        mse !== "" &&
        (Number(mse) < 0 || Number(mse) > 100)
      ) {
        newErrors[`${subject}-mse`] =
          "Marks must be between 0 and 100";
      }

      /* ESE */

      if (!eseAbsent && ese === "") {
        newErrors[`${subject}-ese`] = "Required";
      }

      if (
        !eseAbsent &&
        ese !== "" &&
        (Number(ese) < 0 || Number(ese) > 100)
      ) {
        newErrors[`${subject}-ese`] =
          "Marks must be between 0 and 100";
      }
    });

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  /* =========================================
     GENERATE QR CODE
  ========================================= */

  const generateQRCode = async (
    calculatedSubjects,
    total,
    percentage,
    overallResult
  ) => {
    const qrData = `
VISHWAKARMA INSTITUTE OF TECHNOLOGY, PUNE

STUDENT RESULT

PRN: ${student.prn}
Name: ${student.name}
Branch: ${student.branch}
Semester: ${student.semester}

Total Marks: ${total}/400
Percentage: ${percentage}%
Overall Result: ${overallResult}

SUBJECT RESULTS

${calculatedSubjects
  .map(
    (subject) =>
      `${subject.subject}: ${subject.status}${
        subject.status === "PASS" || subject.status === "FAIL"
          ? ` | Final: ${subject.finalMarks} | Grade: ${subject.grade}`
          : ""
      }`
  )
  .join("\n")}
    `;

    try {
      const qr = await QRCode.toDataURL(qrData, {
        width: 220,
        margin: 2,
      });

      setQrCode(qr);
    } catch (error) {
      console.error("QR Code generation failed:", error);
      setQrCode("");
    }
  };

  /* =========================================
     GENERATE RESULT
  ========================================= */

  const generateResult = async () => {
    /* Validate */

    if (!validateForm()) {
      setResult(null);
      return;
    }

    /* =========================================
       CALCULATE SUBJECT RESULTS
    ========================================= */

    const calculatedSubjects = subjects.map((subject) => {
      const subjectMarks = marks[subject];

      const mseAbsent = subjectMarks.mseAbsent;
      const eseAbsent = subjectMarks.eseAbsent;

      const isAbsent = mseAbsent || eseAbsent;

      /* =========================================
         ABSENT
      ========================================= */

      if (isAbsent) {
        return {
          subject,

          mse: mseAbsent ? "ABSENT" : Number(subjectMarks.mse),

          ese: eseAbsent ? "ABSENT" : Number(subjectMarks.ese),

          finalMarks: 0,

          grade: "-",

          status: "ABSENT",
        };
      }

      /* =========================================
         NORMAL MARKS
      ========================================= */

      const mse = Number(subjectMarks.mse);

      const ese = Number(subjectMarks.ese);

      /*

        Final Marks =
        (MSE × 30%) + (ESE × 70%)

      */

      const finalMarks =
        mse * 0.3 +
        ese * 0.7;

      const roundedMarks = Number(
        finalMarks.toFixed(2)
      );

      /* Grade */

      const grade = getGrade(roundedMarks);

      /* Status */

      const status =
        roundedMarks >= 40
          ? "PASS"
          : "FAIL";

      return {
        subject,

        mse,

        ese,

        finalMarks: roundedMarks,

        grade,

        status,
      };
    });

    /* =========================================
       TOTAL
    ========================================= */

    const total = calculatedSubjects.reduce(
      (sum, subject) => sum + subject.finalMarks,
      0
    );

    const roundedTotal = Number(total.toFixed(2));

    /* =========================================
       PERCENTAGE
    ========================================= */

    const percentage = Number(
      ((roundedTotal / 400) * 100).toFixed(2)
    );

    /* =========================================
       OVERALL RESULT
    ========================================= */

    const overallPass = calculatedSubjects.every(
      (subject) => subject.status === "PASS"
    );

    const overallResult = overallPass
      ? "PASS"
      : "FAIL";

    /* =========================================
       PERFORMANCE
    ========================================= */

    const hasFailedSubject =
      calculatedSubjects.some(
        (subject) => subject.status === "FAIL"
      );

    const hasAbsentSubject =
      calculatedSubjects.some(
        (subject) => subject.status === "ABSENT"
      );

    let performance;

    if (hasFailedSubject || hasAbsentSubject) {
      performance = "Needs Improvement";
    } else if (percentage >= 90) {
      performance = "Excellent";
    } else if (percentage >= 75) {
      performance = "Very Good";
    } else if (percentage >= 60) {
      performance = "Good";
    } else if (percentage >= 50) {
      performance = "Satisfactory";
    } else {
      performance = "Needs Improvement";
    }

    /* =========================================
       SAVE RESULT
    ========================================= */

    setResult({
      subjects: calculatedSubjects,

      total: roundedTotal,

      percentage,

      overallResult,

      performance,
    });

    /* =========================================
       STEP 3
    ========================================= */

    setCurrentStep(3);

    /* =========================================
       GENERATE QR CODE
    ========================================= */

    await generateQRCode(
      calculatedSubjects,
      roundedTotal,
      percentage,
      overallResult
    );

    /* =========================================
       SCROLL TO RESULT
    ========================================= */

    setTimeout(() => {
      document
        .getElementById("result-section")
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

    setMarks(createInitialMarks());

    setErrors({});

    setResult(null);

    setQrCode("");

    setCurrentStep(1);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  /* =========================================
     PRINT / SAVE PDF
  ========================================= */

  const printResult = () => {
    window.print();
  };

  /* =========================================
     GO TO MARKS
  ========================================= */

  const goToMarks = () => {
    const studentErrors = {};

    /* PRN */

    if (!student.prn.trim()) {
      studentErrors.prn =
        "PRN Number is required";
    } else if (!/^\d+$/.test(student.prn.trim())) {
      studentErrors.prn =
        "PRN Number must contain numbers only";
    }

    /* NAME */

    if (!student.name.trim()) {
      studentErrors.name =
        "Student name is required";
    } else if (
      !/^[A-Za-z ]+$/.test(
        student.name.trim()
      )
    ) {
      studentErrors.name =
        "Student Name must contain letters and spaces only";
    }

    /* BRANCH */

    if (!student.branch.trim()) {
      studentErrors.branch =
        "Branch is required";
    } else if (
      !/^[A-Za-z ]+$/.test(
        student.branch.trim()
      )
    ) {
      studentErrors.branch =
        "Branch must contain letters and spaces only";
    }

    /* SEMESTER */

    if (!student.semester) {
      studentErrors.semester =
        "Semester is required";
    }

    setErrors(studentErrors);

    if (
      Object.keys(studentErrors).length === 0
    ) {
      setCurrentStep(2);

      setTimeout(() => {
        document
          .getElementById("marks-section")
          ?.scrollIntoView({
            behavior: "smooth",
          });
      }, 100);
    }
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

          <div className="header-brand">

            <img
              src="/vit-logo.png"
              alt="VIT Pune Logo"
              className="header-logo"
            />

            <div>

              <h1>
                Vishwakarma Institute of Technology , Pune 
              </h1>

              <p>
                Student Result Generation System
              </p>

            </div>

          </div>

        </div>

      </header>


      <main className="container">

        {/* =====================================
            STEP INDICATOR
        ===================================== */}

        <div className="step-container">

          {/* STEP 1 */}

          <div
            className={
              currentStep >= 1
                ? "step active"
                : "step"
            }
          >

            <div className="step-number">
              1
            </div>

            <div>

              <strong>
                Student Information
              </strong>

              <span>
                Enter student details
              </span>

            </div>

          </div>


          <div className="step-line"></div>


          {/* STEP 2 */}

          <div
            className={
              currentStep >= 2
                ? "step active"
                : "step"
            }
          >

            <div className="step-number">
              2
            </div>

            <div>

              <strong>
                Enter Marks
              </strong>

              <span>
                Enter MSE and ESE
              </span>

            </div>

          </div>


          <div className="step-line"></div>


          {/* STEP 3 */}

          <div
            className={
              currentStep >= 3
                ? "step active"
                : "step"
            }
          >

            <div className="step-number">
              3
            </div>

            <div>

              <strong>
                Result
              </strong>

              <span>
                View & download result
              </span>

            </div>

          </div>

        </div>


        {/* =====================================
            STEP 1
        ===================================== */}

        <section className="card">

          <div className="section-title">

            <div className="section-heading-row">

              <div className="section-icon">
                1
              </div>

              <div>

                <h2>
                  Student Information
                </h2>

                <p>
                  Enter the student's academic details.
                </p>

              </div>

            </div>

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
                onChange={handleStudentChange}
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
                onChange={handleStudentChange}
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
                onChange={handleStudentChange}
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
                value={student.semester}
                onChange={handleStudentChange}
              >

                <option value="">
                  Select Semester
                </option>

                {[1, 2, 3, 4, 5, 6, 7, 8].map(
                  (semester) => (
                    <option
                      key={semester}
                      value={semester}
                    >
                      Semester {semester}
                    </option>
                  )
                )}

              </select>

              {errors.semester && (
                <span className="error">
                  {errors.semester}
                </span>
              )}

            </div>

          </div>


          <div className="step-action">

            <button
              className="primary-button"
              onClick={goToMarks}
            >
              Continue to Marks →
            </button>

          </div>

        </section>


        {/* =====================================
            STEP 2
        ===================================== */}

        <section
          id="marks-section"
          className="card"
        >

          <div className="section-title">

            <div className="section-heading-row">

              <div className="section-icon">
                2
              </div>

              <div>

                <h2>
                  Enter Marks
                </h2>

                <p>
                  Enter MSE and ESE marks for each subject.
                </p>

              </div>

            </div>

          </div>


          {/* RULES */}

          <div className="rules">

            <div className="rule-card">

              <div className="rule-icon">
                M
              </div>

              <div>

                <strong>
                  MSE
                </strong>

                <span>
                  30%
                </span>

              </div>

            </div>


            <div className="rule-card">

              <div className="rule-icon">
                E
              </div>

              <div>

                <strong>
                  ESE
                </strong>

                <span>
                  70%
                </span>

              </div>

            </div>


            <div className="rule-card">

              <div className="rule-icon">
                ✓
              </div>

              <div>

                <strong>
                  Passing
                </strong>

                <span>
                  40 / 100
                </span>

              </div>

            </div>


            <div className="rule-card">

              <div className="rule-icon">
                Σ
              </div>

              <div>

                <strong>
                  Maximum
                </strong>

                <span>
                  400
                </span>

              </div>

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


                      {/* MSE */}

                      <td>

                        <input
                          type="number"
                          min="0"
                          max="100"
                          value={
                            marks[subject].mse
                          }
                          placeholder={
                            marks[subject]
                              .mseAbsent
                              ? "Absent"
                              : "0 - 100"
                          }
                          disabled={
                            marks[subject]
                              .mseAbsent
                          }
                          onChange={
                            (event) =>
                              handleMarksChange(
                                subject,
                                "mse",
                                event.target.value
                              )
                          }
                        />

                        <label className="absent-option">

                          <input
                            type="checkbox"
                            checked={
                              marks[subject]
                                .mseAbsent
                            }
                            onChange={
                              (event) =>
                                handleAbsentChange(
                                  subject,
                                  "mse",
                                  event.target.checked
                                )
                            }
                          />

                          Absent

                        </label>


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


                      {/* ESE */}

                      <td>

                        <input
                          type="number"
                          min="0"
                          max="100"
                          value={
                            marks[subject].ese
                          }
                          placeholder={
                            marks[subject]
                              .eseAbsent
                              ? "Absent"
                              : "0 - 100"
                          }
                          disabled={
                            marks[subject]
                              .eseAbsent
                          }
                          onChange={
                            (event) =>
                              handleMarksChange(
                                subject,
                                "ese",
                                event.target.value
                              )
                          }
                        />

                        <label className="absent-option">

                          <input
                            type="checkbox"
                            checked={
                              marks[subject]
                                .eseAbsent
                            }
                            onChange={
                              (event) =>
                                handleAbsentChange(
                                  subject,
                                  "ese",
                                  event.target.checked
                                )
                            }
                          />

                          Absent

                        </label>


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

            {" "}
            Final Marks =
            (MSE × 30%) +
            (ESE × 70%)

          </div>


          {/* BUTTONS */}

          <div className="buttons">

            <button
              className="primary-button"
              onClick={generateResult}
            >
              Generate Result →
            </button>

            <button
              className="secondary-button"
              onClick={resetForm}
            >
              Reset
            </button>

          </div>

        </section>


        {/* =====================================
            STEP 3 RESULT
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

              <p>
                STUDENT RESULT
              </p>

              <span>
                STATEMENT OF MARKS
              </span>

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
                    (subject, index) => {

                      const isAbsent =
                        subject.status === "ABSENT";

                      return (

                        <tr
                          key={subject.subject}
                        >

                          <td>
                            {index + 1}
                          </td>

                          <td className="subject">
                            {subject.subject}
                          </td>

                          <td>

                            {subject.mse === "ABSENT"
                              ? (
                                <span className="absent-text">
                                  ABSENT
                                </span>
                              )
                              : subject.mse}

                          </td>


                          <td>

                            {subject.ese === "ABSENT"
                              ? (
                                <span className="absent-text">
                                  ABSENT
                                </span>
                              )
                              : subject.ese}

                          </td>


                          <td className="bold">

                            {isAbsent
                              ? "-"
                              : subject.finalMarks}

                          </td>


                          <td className="grade">

                            {isAbsent
                              ? "-"
                              : subject.grade}

                          </td>


                          <td>

                            <span
                              className={
                                subject.status === "PASS"
                                  ? "pass"
                                  : subject.status === "ABSENT"
                                  ? "absent"
                                  : "fail"
                              }
                            >

                              {subject.status}

                            </span>

                          </td>

                        </tr>

                      );
                    }
                  )}

                </tbody>

              </table>

            </div>


            {/* =====================================
                PERFORMANCE CARDS
            ===================================== */}

            <div className="performance-grid">

              {/* PERCENTAGE */}

              <div className="performance-card">

                <div className="performance-icon">
                  %
                </div>

                <div>

                  <span>
                    Percentage
                  </span>

                  <strong>
                    {result.percentage}%
                  </strong>

                  <small>
                    Overall percentage
                  </small>

                </div>

              </div>


              {/* PERFORMANCE */}

              <div className="performance-card">

                <div className="performance-icon">
                  ★
                </div>

                <div>

                  <span>
                    Performance
                  </span>

                  <strong>
                    {result.performance}
                  </strong>

                  <small>
                    Based on subject-wise performance
                  </small>

                </div>

              </div>


              {/* RESULT */}

              <div
                className={
                  result.overallResult === "PASS"
                    ? "performance-card result-pass"
                    : "performance-card result-fail"
                }
              >

                <div className="performance-icon">
                  ✓
                </div>

                <div>

                  <span>
                    Overall Result
                  </span>

                  <strong>
                    {result.overallResult}
                  </strong>

                  <small>
                    Academic status
                  </small>

                </div>

              </div>

            </div>


            {/* =====================================
                QR CODE
            ===================================== */}

            <div className="qr-section">

              <div>

                <h3>
                  Result Verification
                </h3>

                <p>
                  Scan the QR code to view
                  the student's result information.
                </p>

              </div>


              {qrCode && (

                <img
                  src={qrCode}
                  alt="Result QR Code"
                  className="qr-code"
                />

              )}

            </div>


            {/* =====================================
                GRADE SCALE
            ===================================== */}

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
                    <td>91 - 100</td>
                    <td>A+</td>
                  </tr>

                  <tr>
                    <td>81 - 90</td>
                    <td>A</td>
                  </tr>

                  <tr>
                    <td>71 - 80</td>
                    <td>B+</td>
                  </tr>

                  <tr>
                    <td>61 - 70</td>
                    <td>B</td>
                  </tr>

                  <tr>
                    <td>51 - 60</td>
                    <td>C+</td>
                  </tr>

                  <tr>
                    <td>40 - 50</td>
                    <td>C</td>
                  </tr>

                  <tr>
                    <td>Below 40</td>
                    <td>F</td>
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
                FAIL. If a student is absent in
                MSE or ESE, that examination is
                marked as ABSENT.
              </p>

            </div>


            {/* BUTTONS */}

            <div className="print-area">

              <button
                className="print-button"
                onClick={printResult}
              >
                🖨 Print / Save as PDF
              </button>


              <button
                className="secondary-button"
                onClick={resetForm}
              >
                Generate Another Result
              </button>

            </div>

          </section>

        )}

      </main>


      {/* =====================================
          FOOTER
      ===================================== */}

      <footer>

        <strong>
          Vishwakarma Institute of Technology, Pune
        </strong>

        <span>
          Student Result Generation System
        </span>

      </footer>

    </div>
  );
}

export default App;
const express = require("express");
const router = express.Router();
const { body, validationResult } = require("express-validator");
const fetchUser = require("../middleWare/fetchUser");
const questionModel = require("../models/questionModel");
const dotenv = require("dotenv");
const fetch = require("node-fetch");
dotenv.config();

const endpoint = "871e4043.problems.sphere-engine.com";
const accessToken = process.env.SphereEngine;

//admin can create question
async function createProblem(name, details) {
  var problemData = {
    name: name,
    body: details,
    masterjudgeId: 1001,
  };
  const response = await fetch(
    "https://" + endpoint + "/api/v4/problems?access_token=" + accessToken,
    {
      method: "POST",
      body: JSON.stringify(problemData),
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
  const json = await response.json();
  return json;
}

//admin can add test case
async function createNewTestCase(input, output, problemId) {
  var testcaseData = {
    input: input,
    output: output,
    timelimit: 5,
    judgeId: 1,
  };

  const response = await fetch(
    "https://" +
      endpoint +
      "/api/v4/problems/" +
      problemId +
      "/testcases?access_token=" +
      accessToken,
    {
      method: "POST",
      body: JSON.stringify(testcaseData),
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
  const json = await response.json();
  console.log(json);
  return json;
}

//user can submit sol
async function createSol(problemId, code) {
  var submissionData = {
    problemId: problemId,
    compilerId: 1,
    source: code,
  };
  const response = await fetch(
    "https://" + endpoint + "/api/v4/submissions?access_token=" + accessToken,
    {
      method: "POST",
      body: JSON.stringify(submissionData),
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
  const json = await response.json();
  console.log(json);
  return json;
}

//user can fetch the submission report
async function submissionResult(solId) {
  const response = await fetch(
    "https://" +
      endpoint +
      "/api/v4/submissions/" +
      solId +
      "?access_token=" +
      accessToken,
    {
      method: "GET",
    }
  );
  const json = await response.json();
  console.log(json);
  return json;
}

//admin can update the question details
async function updateProblem(problemId, name, details) {
  var problemData = {
    name: name,
    body: details,
  };
  const response = await fetch(
    "https://" +
      endpoint +
      "/api/v4/problems/" +
      problemId +
      "?access_token=" +
      accessToken,
    {
      method: "PUT",
      body: JSON.stringify(problemData),
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
  const json = await response.json();
  console.log(json);
  return json;
}

//admin can delete problem
async function deleteProblem(problemId) {
  const response = await fetch(
    "https://" +
      endpoint +
      "/api/v4/problems/" +
      problemId +
      "?access_token=" +
      accessToken,
    {
      method: "DELETE",
    }
  );
  const json = await response.json();
  console.log(json);
  return json;
}

//route fetch desired no. of problems
router.post("/fetch", fetchUser, async (req, res) => {
  let success = false;
  try {
    //set the count to desired number or the length of the collection
    const count = req.body.count
      ? req.body.count
      : await questionModel.countDocuments();

    //fetching data from db
    const response = await questionModel.find().limit(count);

    //sending response
    res.send({ success: true, response });
  } catch (error) {
    //to handle any internal error
    res.status(500).send({ success, error: "Some internal error occured" });
  }
});

//route for admin to create a new problem
router.post(
  "/create",
  fetchUser,
  [
    body("details", "Can't be empty").exists(),
    body("name", "Can't be empty").exists(),
  ],
  async (req, res) => {
    let success = false;
    try {
      //validation
      const result = validationResult(req.body);
      if (!result.isEmpty()) {
        return res.status(400).json({ success, errors: errors.array() });
      }

      //checking for valid access to perform operation
      const user = req.user;
      if (user.role !== "admin") {
        return res.status(400).json({ success, errors: "Invalid access" });
      }

      //calling sphereEngine API
      const createProblemRes = await createProblem(
        req.body.name,
        req.body.details
      );

      //adding data in db
      const response = await questionModel.create({
        name: req.body.name,
        details: req.body.details,
        problemId: createProblemRes.id,
      });

      //sending response
      res.send({ success: true, response });
    } catch (error) {
      // to handle any internal error
      res.status(500).send({ success, error: "Some internal error occured" });
    }
  }
);

//route for admin to add a new test case
router.post(
  "/createtestcase",
  fetchUser,
  [
    body("problemId", "problem is must").exists(),
    body("input", "inputs are required").exists(),
    body("output", "output is required").exists(),
  ],
  async (req, res) => {
    let success = false;
    try {
      //validation
      const result = validationResult(req.body);
      if (!result.isEmpty()) {
        return res.status(400).json({ success, error: errors.array() });
      }

      //checking for valid access to perform operation
      const user = req.user;
      if (user.role !== "admin") {
        return res.status(400).json({ success, errors: "Invalid access" });
      }

      //calling sphereEngine API
      const createTestCasesRes = await createNewTestCase(
        req.body.input,
        req.body.output,
        req.body.problemId
      );

      //sending response
      res.send({ success: true, createTestCasesRes });
    } catch (error) {
      //to handle any internal error
      res.status(500).send({ success, error: "Some internal error occured" });
    }
  }
);

//route for user to submit a solution
router.post(
  "/solution",
  [
    body("code", "solution can't be empty").exists(),
    body("problemId", "question id is must").exists(),
  ],

  async (req, res) => {
    let success = false;
    try {
      //validation
      const result = validationResult(req.body);
      if (!result.isEmpty()) {
        return res.status(400).json({ success, error: errors.array() });
      }

      //calling sphereEngine API
      const solRes = await createSol(req.body.problemId, req.body.code);

      //sending response
      res.send({ success: true, solRes });
    } catch (error) {
      //to handle any internal error
      res.status(500).send({ success, error: "Some internal error occured" });
    }
  }
);

//route to user to get the result of a submission
router.post(
  "/result",
  [body("solId", "solId is must").exists()],
  async (req, res) => {
    let success = false;
    try {
      //validation
      const result = validationResult(req.body);
      if (!result.isEmpty()) {
        return res.status(400).json({ success, error: errors.array() });
      }

      //calling sphereEngine API
      const status = await submissionResult(req.body.solId);
      const response = status.result;

      //sending response
      res.send({
        success: true,
        status: response.status.name,
        score: response.score,
      });
    } catch (error) {
      //to handle any internal error
      res.status(500).send({ success, error: "Some internal error occured" });
    }
  }
);

//route for admin to update the problem details
router.put(
  "/updateproblem",
  fetchUser,
  [
    body("problemId", "problemId is must").exists(),
    body("details", "Can't be empty").exists(),
    body("name", "Can't be empty").exists(),
  ],
  async (req, res) => {
    let success = false;
    try {
      //validation
      const result = validationResult(req.body);
      if (!result.isEmpty()) {
        return res.status(400).json({ success, error: errors.array() });
      }

      //checking for valid access to perform operation
      const user = req.user;
      if (user.role !== "admin") {
        return res.status(400).json({ success, errors: "Invalid access" });
      }

      //calling sphereEngine API
      const updateProbRes = await updateProblem(
        req.body.problemId,
        req.body.name,
        req.body.details
      );

      //fetching data from db
      let response = await questionModel.findOne({
        problemId: req.body.problemId,
      });

      //updating the response if there is changes
      if (response.name !== req.body.name) {
        response.name = req.body.name;
      }
      if (response.details !== req.body.details) {
        response.details = req.body.details;
      }

      //pushing the updated data to db
      response = await questionModel.updateOne(
        { problemId: req.body.problemId },
        { $set: response },
        { new: true }
      );

      //sending response
      res.send({ success: true, updateProbRes, response });
    } catch (error) {
      //to handle any internal error
      res.status(500).send({ success, error: "Some internal error occured" });
    }
  }
);

// route for admin to delete a problem
router.delete(
  "/deleteproblem",
  fetchUser,
  [body("problemId", "problemId is must").exists()],
  async (req, res) => {
    let success = false;
    try {
      //validation
      const result = validationResult(req.body);
      if (!result.isEmpty()) {
        return res.status(400).json({ success, error: errors.array() });
      }

      //checking for valid access to perform operation
      const user = req.user;
      if (user.role !== "admin") {
        return res.status(400).json({ success, errors: "Invalid access" });
      }

      //calling the sphereEngine API
      const deleteProbRes = await deleteProblem(req.body.problemId);

      //deleting data from db
      const response = await questionModel.findOneAndDelete({
        problemId: req.body.problemId,
      });

      //sending response
      res.send({ success: true, deleteProbRes, response });
    } catch (error) {
      //to handle any internal error
      res.status(500).send({ success, error: "Some internal error occured" });
    }
  }
);

module.exports = router;

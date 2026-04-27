/**
 * Acadlytics Database Seeder — Real Excel Data
 *
 * Data sources:
 *   CO Attainment         : 80 student responses
 *   Curricular Gap        : 79 student responses
 *   Teacher Feedback (AAD): 78 student responses
 *   Student Feedback (BM) : 83 student responses
 *
 * Run: node src/seed.js
 */

import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

import User from "./models/user.model.js";
import Course from "./models/course.model.js";
import CourseOutcome from "./models/courseOutcome.model.js";
import FeedbackForm from "./models/feedbackForm.model.js";
import Question from "./models/question.model.js";
import FeedbackSubmission from "./models/feedbackSubmission.model.js";
import Response from "./models/response.model.js";
import AnalyticsSnapshot from "./models/analyticsSnapshot.model.js";
import { DB_NAME } from "./constants.js";

// ─── Option → numeric score mappings ─────────────────────────────────────────

const CO_OPTION_MAP = { "Option 1": 1.67, "Option 2": 3.33, "Option 3": 5.0 };
const GAP_OPTION_MAP = {
  "Option 1": 1,
  "Option 2": 2,
  "Option 3": 3,
  "Option 4": 4,
  "Option 5": 5,
};

// ─── Real student list (union of all 4 sheets) ───────────────────────────────
// [name, regNo]
const ALL_STUDENTS = [
  ["Pritik Balabantaray", "24110366"],
  ["Rohan Pattanayak", "24110416"],
  ["Pratik Kumar Mohanty", "24110346"],
  ["Suvam Kumar Swain", "24110395"],
  ["Priti Ram", "24110259"],
  ["Akash Kumar Munda", "24110408"],
  ["Chandan Kumar Mallick", "24110357"],
  ["Amrita Sahu", "24110405"],
  ["Snehasis Rath", "24110808"],
  ["Ashish kumar tajan", "24110353"],
  ["Subhransu Sekhar Baliarsingh", "24110394"],
  ["Mrutyunjay Mahanta", "24110364"],
  ["Anurag Choudhury", "24110387"],
  ["Pritam Rout", "24110383"],
  ["Girish Mahapatra", "24110398"],
  ["NITESH KUMAR DASH", "24110372"],
  ["Pratyush Pattanaik", "24110393"],
  ["Anmol Pattnaik", "24110417"],
  ["Soyam Swatik Satapathy", "24110365"],
  ["Udit Arun Nath", "24110402"],
  ["Rudra Narayan Samantaray", "24110982"],
  ["Bhawani Shankar Pany", "24110354"],
  ["Swayam Swostik Behera", "24110406"],
  ["Sunita Satpathy", "24110344"],
  ["Amisha Tripathy", "24110618"],
  ["Akankshya Priyadarshini Tarai", "24110407"],
  ["Dibyajeet Mohanty", "24110360"],
  ["G. Sowmya", "24110342"],
  ["Ashis Kumar Jena", "24110347"],
  ["Somanath Biswal", "24110400"],
  ["Tushar Ranjan Kallo", "24110367"],
  ["Rittu Rath", "24110363"],
  ["Abhisek Panda", "24110376"],
  ["Punam Sahoo", "24110411"],
  ["Yash Pratihari", "24110389"],
  ["Prabhat Kiran Patro", "24110384"],
  ["Ashutosh Das", "25120039"],
  ["Adyasha Daspattnaik", "24110575"],
  ["Mritunjay Patra", "24110371"],
  ["Subhankita Mahapatra", "24110358"],
  ["Aparupa satapathy", "25120038"],
  ["SatyaSuva Sundar Sahoo", "24110348"],
  ["Sandeep Sahu", "24111196"],
  ["Pankaj Maity", "24110352"],
  ["Shreyanshi singh", "24110388"],
  ["Pratyush Jena", "24120036"],
  ["Saranya Sarangi", "24110381"],
  ["Natasha Neha Patnaik", "24110340"],
  ["RUDRA PRATAP MALLICK", "24110350"],
  ["Sourav Sahoo", "24110356"],
  ["Pabitra Pal", "24110386"],
  ["Mahaveer Mundaluhari", "24110409"],
  ["Soumya Ranjan Nanda", "24110362"],
  ["prince senapati", "244110359"],
  ["Ipsita Pradhan", "24110412"],
  ["Biswaprakash Giri", "24110392"],
  ["Aditya Dungdung", "24110397"],
  ["ANIL KUMAR ROUT", "24110343"],
  ["Ashutosh Dalbehera", "24110414"],
  ["Sweta Jena", "24110403"],
  ["Soumya Ranjan Panda", "24110415"],
  ["Sumit Panigrahi", "24110380"],
  ["Priyabrat Sahoo", "24110401"],
  ["Baishnabi Samal", "24110370"],
  ["Gayatree Bhardwaj Nayak", "25120040"],
  ["Prince Senapati", "24110359"],
  ["Akarsh", "24110391"],
  ["Priyansu Nayak", "25120041"],
  ["Soumyajeet Routray", "24110351"],
  ["Subham Nath", "24110396"],
  ["Subhrata Biswal", "24110374"],
  ["Prince Raj Sarangi", "24110399"],
  ["suneeti aryaa", "24110369"],
  ["Sanjib Kumar mandal", "24110390"],
  ["Rupashree paramanik", "25120042"],
  ["Ritesh Samantaray", "24110375"],
  ["Smruti Manjari padhi", "25120043"],
  ["Kamalakanta Giri", "24110385"],
  ["Arindam Rout", "24110368"],
  ["Gayatree Bhardwaj Nayak", "251200400"],
  ["Student_24110361", "24110361"],
  ["Student_24100373", "24100373"],
  ["Student_24110377", "24110377"],
  ["Bhumika Kalasi", "23110641"],
  ["Biswajeet Dash", "23110643"],
  ["SAI PRASAD KAR", "23110677"],
  ["GYANARANJAN MOHARANA", "23110655"],
  ["Akash Lakra", "23110631"],
  ["Pradyush Kumar Jena", "23110464"],
  ["Smarika Behera", "23110694"],
  ["Anandita Sahoo", "23110633"],
  ["Sambit Kumar Mohanty", "23110899"],
  ["Milan Dhal", "23110660"],
  ["Dibyaranjan Katual", "23110651"],
  ["Arpana Kujur", "23110636"],
  ["Himangi Swain", "23110656"],
  ["Chandan Kumar Satapathy", "23110645"],
  ["Divyasha nayak", "23110653"],
  ["Debanshu Kumar Pradhan", "23110648"],
  ["Shubhashree Mohanty", "23110690"],
  ["Smarak Kumar Pradhan", "23110693"],
  ["Siddhi pradayanee sahoo", "24120071"],
  ["PUSPANJALI BEHERA", "23110671"],
  ["RITTIK GOURAV RAUL", "23110799"],
  ["Preetesh khadanga", "23110667"],
  ["Debadutta Patel", "23110432"],
  ["BHUMIKA MAHALIK", "23110642"],
  ["Jyotir Aditya Rout", "23110657"],
  ["Subham Maheswari Jena", "23110696"],
  ["Abhay Abhinandan", "23110625"],
  ["Rasmi Ranjan Nayak", "23110672"],
  ["Saisuman Dash", "23110678"],
  ["Aditya Agrawal", "23110628"],
  ["Jasasmita Sahoo", "24120066"],
  ["Pratik Raj Senapati", "24120067"],
  ["Om Prasad Sahoo", "23110665"],
  ["Sashanka sekhar swain", "23110682"],
  ["GIRINDRA MAHARANA", "23110654"],
  ["Shradha Suman Mohapatra", "23110688"],
  ["Ayush Simon Barwa", "23110639"],
  ["Aditya Kumar Pradhan", "23110629"],
  ["Soumyadeepta Patel", "23110695"],
  ["Novtej Mallick", "23110664"],
  ["Abhisek Panda", "23110627"],
  ["Sarbesh Jena", "2311068"],
  ["M.K. Sanket", "23110658"],
  ["Sankar Kumar Nayak", "23110680"],
  ["Nilima Lakra", "23110663"],
  ["Subhranshu Naik", "23110698"],
  ["B Arya Kumari Sameekshya", "23110640"],
  ["AYUSH DASH", "23110638"],
  ["Sibaditya Ashirbad", "23110692"],
  ["Priyankar Mallick", "23110668"],
  ["Puneet Kumar Dhal", "23110669"],
  ["Navycut Dehury", "23110662"],
  ["Shubhajit Kumar Senapati", "23110689"],
  ["Disha Agarwal", "23110652"],
  ["Utkal Kumar Daa", "23110921"],
  ["Debabrata Sahoo", "23110647"],
  ["Monalisha patra", "23110661"],
  ["Abhijit Panda", "23110626"],
  ["Ratna Bibhusan Panda", "23110673"],
  ["Sudhananda Patra", "23110699"],
  ["Shibananda Sahu", "24120070"],
  ["Chandan kumar Das", "23110644"],
  ["Adwait Prasad Panda", "23110551"],
  ["SUBHENDU KUMAR SATAPATHY", "23110697"],
  ["Anusha Santra", "24120065"],
  ["Purna Chandra Murmu", "23110670"],
  ["Sukumar Dash", "23110700"],
  ["Arpita Mohapatra", "23110637"],
  ["Rudramadhab Panda", "23110674"],
  ["Satyabrata Nayak", "23110684"],
  ["Ankit Kumar Das", "23110634"],
  ["Vaishnavi Sabat", "23110702"],
  ["Ankush Bag", "23110635"],
  ["Prabin Kumar Khamania", "23110666"],
  ["ADITYA NARAYAN MALI", "23110630"],
];

// ─── CO Attainment: 80 real responses ─────────────────────────────────────────
// scores[0..4] = CO1..CO5, already mapped to numeric (1.67/3.33/5.0)
const CO_ATTAINMENT_DATA = [
  {
    name: "Pritik Balabantaray",
    reg: "24110366",
    scores: [5.0, 5.0, 5.0, 5.0, 5.0],
  },
  {
    name: "Rohan Pattanayak",
    reg: "24110416",
    scores: [5.0, 5.0, 5.0, 5.0, 5.0],
  },
  {
    name: "Pratik Kumar Mohanty",
    reg: "24110346",
    scores: [5.0, 5.0, 5.0, 5.0, 5.0],
  },
  {
    name: "Suvam Kumar Swain",
    reg: "24110395",
    scores: [5.0, 5.0, 5.0, 5.0, 5.0],
  },
  { name: "Priti Ram", reg: "24110259", scores: [5.0, 5.0, 5.0, 5.0, 5.0] },
  {
    name: "Akash Kumar Munda",
    reg: "24110408",
    scores: [5.0, 5.0, 5.0, 5.0, 5.0],
  },
  {
    name: "Chandan Kumar Mallick",
    reg: "24110357",
    scores: [5.0, 5.0, 5.0, 5.0, 5.0],
  },
  { name: "Amrita Sahu", reg: "24110405", scores: [5.0, 5.0, 5.0, 5.0, 5.0] },
  { name: "Snehasis Rath", reg: "24110808", scores: [5.0, 5.0, 5.0, 5.0, 5.0] },
  {
    name: "Ashish kumar tajan",
    reg: "24110353",
    scores: [5.0, 5.0, 5.0, 5.0, 5.0],
  },
  {
    name: "Subhransu Sekhar Baliarsingh",
    reg: "24110394",
    scores: [3.33, 3.33, 3.33, 3.33, 3.33],
  },
  {
    name: "Mrutyunjay Mahanta",
    reg: "24110364",
    scores: [5.0, 5.0, 5.0, 5.0, 3.33],
  },
  {
    name: "Anurag Choudhury",
    reg: "24110387",
    scores: [5.0, 5.0, 5.0, 5.0, 5.0],
  },
  { name: "Pritam Rout", reg: "24110383", scores: [5.0, 5.0, 5.0, 5.0, 5.0] },
  {
    name: "Girish Mahapatra",
    reg: "24110398",
    scores: [5.0, 5.0, 5.0, 5.0, 5.0],
  },
  {
    name: "NITESH KUMAR DASH",
    reg: "24110372",
    scores: [5.0, 5.0, 5.0, 5.0, 5.0],
  },
  {
    name: "Pratyush Pattanaik",
    reg: "24110393",
    scores: [5.0, 5.0, 5.0, 5.0, 5.0],
  },
  {
    name: "Anmol Pattnaik",
    reg: "24110417",
    scores: [5.0, 5.0, 5.0, 5.0, 5.0],
  },
  {
    name: "Soyam Swatik Satapathy",
    reg: "24110365",
    scores: [5.0, 5.0, 5.0, 5.0, 5.0],
  },
  {
    name: "Udit Arun Nath",
    reg: "24110402",
    scores: [5.0, 5.0, 5.0, 5.0, 5.0],
  },
  {
    name: "Rudra Narayan Samantaray",
    reg: "24110982",
    scores: [5.0, 5.0, 5.0, 5.0, 5.0],
  },
  {
    name: "Bhawani Shankar Pany",
    reg: "24110354",
    scores: [5.0, 5.0, 5.0, 5.0, 5.0],
  },
  {
    name: "Swayam Swostik Behera",
    reg: "24110406",
    scores: [5.0, 5.0, 5.0, 5.0, 5.0],
  },
  {
    name: "Sunita Satpathy",
    reg: "24110344",
    scores: [5.0, 5.0, 5.0, 5.0, 5.0],
  },
  {
    name: "Amisha Tripathy",
    reg: "24110618",
    scores: [5.0, 5.0, 5.0, 5.0, 5.0],
  },
  {
    name: "Akankshya Priyadarshini Tarai",
    reg: "24110407",
    scores: [5.0, 5.0, 5.0, 5.0, 5.0],
  },
  {
    name: "Dibyajeet Mohanty",
    reg: "24110360",
    scores: [5.0, 5.0, 5.0, 5.0, 5.0],
  },
  { name: "G. Sowmya", reg: "24110342", scores: [5.0, 5.0, 5.0, 5.0, 5.0] },
  {
    name: "Ashis Kumar Jena",
    reg: "24110347",
    scores: [5.0, 5.0, 5.0, 5.0, 5.0],
  },
  {
    name: "Somanath Biswal",
    reg: "24110400",
    scores: [3.33, 3.33, 3.33, 3.33, 3.33],
  },
  {
    name: "Tushar Ranjan Kallo",
    reg: "24110367",
    scores: [5.0, 5.0, 5.0, 5.0, 5.0],
  },
  { name: "Rittu Rath", reg: "24110363", scores: [5.0, 5.0, 5.0, 5.0, 5.0] },
  { name: "Abhisek Panda", reg: "24110376", scores: [5.0, 5.0, 5.0, 5.0, 5.0] },
  { name: "Punam Sahoo", reg: "24110411", scores: [5.0, 5.0, 5.0, 5.0, 5.0] },
  {
    name: "Yash Pratihari",
    reg: "24110389",
    scores: [5.0, 5.0, 5.0, 5.0, 5.0],
  },
  {
    name: "Prabhat Kiran Patro",
    reg: "24110384",
    scores: [5.0, 5.0, 5.0, 5.0, 5.0],
  },
  { name: "Ashutosh Das", reg: "25120039", scores: [5.0, 5.0, 5.0, 5.0, 5.0] },
  {
    name: "Adyasha Daspattnaik",
    reg: "24110575",
    scores: [5.0, 5.0, 5.0, 5.0, 5.0],
  },
  {
    name: "Mritunjay Patra",
    reg: "24110371",
    scores: [5.0, 5.0, 5.0, 5.0, 5.0],
  },
  {
    name: "Subhankita Mahapatra",
    reg: "24110358",
    scores: [5.0, 5.0, 5.0, 5.0, 5.0],
  },
  {
    name: "Aparupa satapathy",
    reg: "25120038",
    scores: [5.0, 5.0, 5.0, 5.0, 5.0],
  },
  {
    name: "SatyaSuva Sundar Sahoo",
    reg: "24110348",
    scores: [5.0, 5.0, 5.0, 5.0, 5.0],
  },
  { name: "Sandeep Sahu", reg: "24111196", scores: [5.0, 5.0, 5.0, 5.0, 5.0] },
  { name: "Pankaj Maity", reg: "24110352", scores: [5.0, 5.0, 5.0, 5.0, 5.0] },
  {
    name: "Shreyanshi singh",
    reg: "24110388",
    scores: [5.0, 5.0, 5.0, 5.0, 5.0],
  },
  {
    name: "Pratyush Jena",
    reg: "24120036",
    scores: [5.0, 3.33, 5.0, 3.33, 3.33],
  },
  {
    name: "Saranya Sarangi",
    reg: "24110381",
    scores: [5.0, 5.0, 5.0, 5.0, 5.0],
  },
  {
    name: "Saranya Sarangi",
    reg: "24110381",
    scores: [5.0, 5.0, 5.0, 5.0, 5.0],
  },
  {
    name: "Natasha Neha Patnaik",
    reg: "24110340",
    scores: [5.0, 5.0, 5.0, 5.0, 5.0],
  },
  {
    name: "RUDRA PRATAP MALLICK",
    reg: "24110350",
    scores: [5.0, 5.0, 5.0, 5.0, 5.0],
  },
  { name: "Sourav Sahoo", reg: "24110356", scores: [5.0, 5.0, 5.0, 5.0, 5.0] },
  { name: "Pabitra Pal", reg: "24110386", scores: [5.0, 3.33, 5.0, 5.0, 3.33] },
  {
    name: "Mahaveer Mundaluhari",
    reg: "24110409",
    scores: [5.0, 5.0, 5.0, 5.0, 5.0],
  },
  {
    name: "Soumya Ranjan Nanda",
    reg: "24110362",
    scores: [5.0, 5.0, 5.0, 5.0, 5.0],
  },
  {
    name: "prince senapati",
    reg: "244110359",
    scores: [5.0, 5.0, 5.0, 5.0, 5.0],
  },
  {
    name: "Ipsita Pradhan",
    reg: "24110412",
    scores: [3.33, 3.33, 3.33, 3.33, 3.33],
  },
  {
    name: "Biswaprakash Giri",
    reg: "24110392",
    scores: [5.0, 5.0, 5.0, 5.0, 5.0],
  },
  {
    name: "Aditya Dungdung",
    reg: "24110397",
    scores: [5.0, 5.0, 5.0, 5.0, 5.0],
  },
  {
    name: "ANIL KUMAR ROUT",
    reg: "24110343",
    scores: [5.0, 5.0, 5.0, 5.0, 5.0],
  },
  {
    name: "Ashutosh Dalbehera",
    reg: "24110414",
    scores: [5.0, 5.0, 5.0, 5.0, 5.0],
  },
  { name: "Sweta Jena", reg: "24110403", scores: [5.0, 5.0, 5.0, 5.0, 5.0] },
  {
    name: "Soumya Ranjan Panda",
    reg: "24110415",
    scores: [5.0, 5.0, 5.0, 5.0, 5.0],
  },
  {
    name: "Sumit Panigrahi",
    reg: "24110380",
    scores: [5.0, 5.0, 5.0, 5.0, 5.0],
  },
  {
    name: "Priyabrat Sahoo",
    reg: "24110401",
    scores: [5.0, 5.0, 5.0, 5.0, 5.0],
  },
  {
    name: "Girish Mahapatra",
    reg: "24110398",
    scores: [5.0, 5.0, 5.0, 5.0, 5.0],
  },
  {
    name: "Baishnabi Samal",
    reg: "24110370",
    scores: [5.0, 5.0, 5.0, 5.0, 5.0],
  },
  {
    name: "Gayatree Bhardwaj Nayak",
    reg: "25120040",
    scores: [3.33, 3.33, 3.33, 3.33, 3.33],
  },
  {
    name: "Anmol Pattnaik",
    reg: "24110417",
    scores: [5.0, 5.0, 5.0, 5.0, 5.0],
  },
  {
    name: "Prince Senapati",
    reg: "24110359",
    scores: [5.0, 5.0, 5.0, 5.0, 5.0],
  },
  { name: "Akarsh", reg: "24110391", scores: [5.0, 3.33, 3.33, 5.0, 5.0] },
  {
    name: "Priyansu Nayak",
    reg: "25120041",
    scores: [1.67, 1.67, 1.67, 1.67, 1.67],
  },
  {
    name: "Soumyajeet Routray",
    reg: "24110351",
    scores: [3.33, 5.0, 5.0, 3.33, 5.0],
  },
  { name: "Subham Nath", reg: "24110396", scores: [5.0, 5.0, 5.0, 5.0, 5.0] },
  {
    name: "Subhrata Biswal",
    reg: "24110374",
    scores: [5.0, 5.0, 5.0, 5.0, 5.0],
  },
  {
    name: "Prince Raj Sarangi",
    reg: "24110399",
    scores: [5.0, 5.0, 5.0, 5.0, 5.0],
  },
  {
    name: "Swayam Swostik Behera",
    reg: "24110406",
    scores: [5.0, 5.0, 5.0, 5.0, 5.0],
  },
  {
    name: "suneeti aryaa",
    reg: "24110369",
    scores: [1.67, 1.67, 1.67, 1.67, 1.67],
  },
  { name: "suneeti aryaa", reg: "24110369", scores: [5.0, 5.0, 5.0, 5.0, 5.0] },
  {
    name: "Sanjib Kumar mandal",
    reg: "24110390",
    scores: [5.0, 5.0, 5.0, 5.0, 5.0],
  },
  {
    name: "Rupashree paramanik",
    reg: "25120042",
    scores: [5.0, 5.0, 5.0, 5.0, 5.0],
  },
];

// ─── Curricular Gap: 79 real responses ────────────────────────────────────────
// scores[0..11] = Q1..Q12, already mapped to numeric (1-5)
const CURRICULAR_GAP_DATA = [
  {
    name: "Mrutyunjay Mahanta",
    reg: "24110364",
    scores: [5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5],
  },
  {
    name: "Aparupa satapathy",
    reg: "25120038",
    scores: [5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5],
  },
  {
    name: "Anurag Choudhury",
    reg: "24110387",
    scores: [5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5],
  },
  {
    name: "Ritesh Samantaray",
    reg: "24110375",
    scores: [5, 5, 5, 5, 5, 3, 5, 5, 5, 5, 5, 5],
  },
  {
    name: "Rohan Pattanayak",
    reg: "24110416",
    scores: [5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5],
  },
  {
    name: "Suvam Kumar Swain",
    reg: "24110395",
    scores: [5, 5, 5, 5, 5, 4, 5, 5, 5, 5, 5, 5],
  },
  {
    name: "Priti Ram",
    reg: "24110259",
    scores: [5, 5, 5, 5, 4, 4, 5, 5, 4, 5, 5, 5],
  },
  {
    name: "Chandan Kumar Mallick",
    reg: "24110357",
    scores: [5, 5, 5, 5, 4, 5, 5, 5, 5, 5, 5, 5],
  },
  {
    name: "Amrita Sahu",
    reg: "24110405",
    scores: [5, 5, 5, 5, 5, 5, 5, 5, 4, 4, 5, 5],
  },
  {
    name: "Snehasis Rath",
    reg: "24110808",
    scores: [5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5],
  },
  {
    name: "Ashish kumar tajan",
    reg: "24110353",
    scores: [5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5],
  },
  {
    name: "Subhransu Sekhar Baliarsingh",
    reg: "24110394",
    scores: [4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4],
  },
  {
    name: "Pritam Rout",
    reg: "24110383",
    scores: [5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5],
  },
  {
    name: "Girish Mahapatra",
    reg: "24110398",
    scores: [5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5],
  },
  {
    name: "Pratyush Pattanaik",
    reg: "24110393",
    scores: [5, 5, 5, 5, 3, 4, 5, 5, 4, 3, 5, 5],
  },
  {
    name: "Nitesh kumar Dash",
    reg: "24110372",
    scores: [5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5],
  },
  {
    name: "Anmol Pattnaik",
    reg: "24110417",
    scores: [5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5],
  },
  {
    name: "Soyam Swatik Satapathy",
    reg: "24110365",
    scores: [5, 5, 5, 5, 5, 5, 5, 5, 4, 5, 5, 5],
  },
  {
    name: "Rudra Narayan Samantaray",
    reg: "24110982",
    scores: [5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5],
  },
  {
    name: "Udit Arun Nath",
    reg: "24110402",
    scores: [5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5],
  },
  {
    name: "Bhawani Shankar Pany",
    reg: "24110353",
    scores: [4, 4, 4, 4, 4, 5, 4, 5, 5, 4, 5, 5],
  },
  {
    name: "Akash Kumar Munda",
    reg: "24110408",
    scores: [5, 5, 5, 4, 5, 5, 5, 5, 5, 5, 5, 4],
  },
  {
    name: "Sunita Satpathy",
    reg: "24110344",
    scores: [4, 4, 5, 5, 3, 3, 4, 5, 5, 4, 5, 5],
  },
  {
    name: "Pratik Kumar Mohanty",
    reg: "24110346",
    scores: [4, 5, 5, 5, 4, 4, 5, 5, 5, 4, 5, 5],
  },
  {
    name: "Swayam Swostik Behera",
    reg: "24110406",
    scores: [4, 3, 3, 4, 3, 3, 5, 5, 4, 4, 5, 5],
  },
  {
    name: "Amisha Tripathy",
    reg: "24110618",
    scores: [5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5],
  },
  {
    name: "Akankshya Priyadarshini Tarai",
    reg: "24110407",
    scores: [5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5],
  },
  {
    name: "Dibyajeet Mohanty",
    reg: "24110360",
    scores: [5, 5, 5, 5, 5, 4, 5, 5, 5, 5, 5, 2],
  },
  {
    name: "G. Sowmya",
    reg: "24110342",
    scores: [5, 5, 4, 5, 4, 4, 5, 5, 5, 5, 5, 5],
  },
  {
    name: "Ashis Kumar Jena",
    reg: "24110347",
    scores: [5, 5, 5, 5, 4, 4, 5, 5, 2, 2, 5, 5],
  },
  {
    name: "Rittu Rath",
    reg: "24110363",
    scores: [5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5],
  },
  {
    name: "Tushar Ranjan Kallo",
    reg: "24110367",
    scores: [5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5],
  },
  {
    name: "Somanath Biswal",
    reg: "24110400",
    scores: [2, 2, 3, 2, 3, 3, 3, 3, 3, 3, 3, 3],
  },
  {
    name: "Abhisek Panda",
    reg: "24110376",
    scores: [5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5],
  },
  {
    name: "Yash Pratihari",
    reg: "24110389",
    scores: [5, 5, 5, 5, 4, 3, 5, 5, 4, 5, 4, 5],
  },
  {
    name: "Punam Sahoo",
    reg: "24110411",
    scores: [5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5],
  },
  {
    name: "Prabhat Kiran Patro",
    reg: "24110384",
    scores: [5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5],
  },
  {
    name: "Ashutosh Das",
    reg: "25120039",
    scores: [5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5],
  },
  {
    name: "Adyasha Daspattnaik",
    reg: "24110575",
    scores: [5, 5, 4, 4, 3, 5, 5, 5, 5, 4, 4, 5],
  },
  {
    name: "Mritunjay Patra",
    reg: "24110371",
    scores: [5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5],
  },
  {
    name: "SUBHANKITA MAHAPATRA",
    reg: "24110358",
    scores: [5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5],
  },
  {
    name: "Mritunjay Patra",
    reg: "24110371",
    scores: [5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5],
  },
  {
    name: "SatyaSuva Sundar Sahoo",
    reg: "24110348",
    scores: [5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5],
  },
  {
    name: "Sandeep Sahu",
    reg: "24111196",
    scores: [5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5],
  },
  {
    name: "Pankaj Maity",
    reg: "24110352",
    scores: [4, 4, 4, 4, 4, 4, 5, 5, 5, 5, 5, 5],
  },
  {
    name: "Shreyanshi singh",
    reg: "24110388",
    scores: [5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5],
  },
  {
    name: "Pratyush Jena",
    reg: "24120036",
    scores: [4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 5],
  },
  {
    name: "Smruti Manjari padhi",
    reg: "25120043",
    scores: [5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5],
  },
  {
    name: "Smruti Manjari Padhi",
    reg: "25120043",
    scores: [5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5],
  },
  {
    name: "Saranya Sarangi",
    reg: "24110381",
    scores: [5, 5, 5, 5, 5, 4, 5, 5, 5, 3, 5, 5],
  },
  {
    name: "Kamalakanta Giri",
    reg: "24110385",
    scores: [5, 5, 5, 5, 5, 3, 5, 5, 5, 5, 5, 5],
  },
  {
    name: "Natasha Neha Patnaik",
    reg: "24110340",
    scores: [5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5],
  },
  {
    name: "RUDRA PRATAP MALLICK",
    reg: "24110350",
    scores: [5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5],
  },
  {
    name: "Sourav Sahoo",
    reg: "24110356",
    scores: [5, 5, 5, 4, 4, 5, 4, 5, 5, 4, 5, 4],
  },
  {
    name: "Pabitra Pal",
    reg: "24110386",
    scores: [5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5],
  },
  {
    name: "Mahaveer Mundaluhari",
    reg: "24110409",
    scores: [4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4],
  },
  {
    name: "Soumya Ranjan Nanda",
    reg: "24110362",
    scores: [5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5],
  },
  {
    name: "Ipsita Pradhan",
    reg: "24110412",
    scores: [4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4],
  },
  {
    name: "Arindam Rout",
    reg: "24110368",
    scores: [5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5],
  },
  {
    name: "Arindam Rout",
    reg: "24110368",
    scores: [5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5],
  },
  {
    name: "Aditya Dungdung",
    reg: "24110397",
    scores: [5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5],
  },
  {
    name: "ANIL KUMAR ROUT",
    reg: "24110343",
    scores: [5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5],
  },
  {
    name: "Ashutosh Dalbehera",
    reg: "24110414",
    scores: [4, 3, 5, 5, 3, 3, 4, 4, 5, 4, 5, 5],
  },
  {
    name: "Ashutosh Dalbehera",
    reg: "24110414",
    scores: [5, 5, 5, 5, 4, 4, 5, 5, 5, 5, 5, 5],
  },
  {
    name: "Sweta Jena",
    reg: "24110403",
    scores: [5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5],
  },
  {
    name: "Soumya Ranjan Panda",
    reg: "24110415",
    scores: [5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5],
  },
  {
    name: "Sumit Panigrahi",
    reg: "24110380",
    scores: [5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5],
  },
  {
    name: "Priyabrat Sahoo",
    reg: "24110401",
    scores: [5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5],
  },
  {
    name: "Baishnabi Samal",
    reg: "24110370",
    scores: [5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5],
  },
  {
    name: "Gayatree Bhardwaj Nayak",
    reg: "251200400",
    scores: [4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4],
  },
  {
    name: "Prince Senapati",
    reg: "24110359",
    scores: [5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5],
  },
  {
    name: "Anmol Pattnaik",
    reg: "24110417",
    scores: [5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5],
  },
  {
    name: "Akarsh",
    reg: "24110391",
    scores: [4, 4, 4, 4, 4, 3, 4, 5, 3, 3, 4, 3],
  },
  {
    name: "Priyansu Nayak",
    reg: "25120041",
    scores: [5, 3, 4, 2, 1, 3, 4, 4, 2, 5, 4, 1],
  },
  {
    name: "Subham Nath",
    reg: "24110396",
    scores: [5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5],
  },
  {
    name: "Subhrata Biswal",
    reg: "24110374",
    scores: [5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5],
  },
  {
    name: "Prince Raj Sarangi",
    reg: "24110399",
    scores: [5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5],
  },
  {
    name: "suneeti aryaa",
    reg: "24110369",
    scores: [5, 5, 5, 5, 5, 4, 5, 5, 5, 5, 5, 5],
  },
  {
    name: "Sanjib Kumar mandal",
    reg: "24110390",
    scores: [5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5],
  },
];

// ─── Teacher Feedback (AAD): 78 real responses ────────────────────────────────
// scores[0..11] = Q1..Q12, already numeric (1-5)
const TEACHER_FEEDBACK_DATA = [
  { reg: "24110395", scores: [4, 5, 5, 5, 5, 4, 5, 5, 5, 5, 5, 5] },
  { reg: "24110386", scores: [5, 5, 5, 5, 5, 4, 5, 5, 4, 5, 5, 5] },
  { reg: "24110411", scores: [5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5] },
  { reg: "24110348", scores: [5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5] },
  { reg: "24110416", scores: [5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5] },
  { reg: "24110360", scores: [5, 5, 5, 5, 5, 5, 5, 4, 5, 5, 4, 5] },
  { reg: "25120038", scores: [5, 3, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5] },
  { reg: "24110357", scores: [4, 4, 5, 5, 5, 5, 5, 5, 5, 4, 3, 4] },
  { reg: "24110982", scores: [5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5] },
  { reg: "24110808", scores: [5, 5, 5, 5, 5, 5, 5, 5, 4, 5, 5, 5] },
  { reg: "24110366", scores: [5, 5, 5, 5, 4, 5, 4, 4, 4, 5, 5, 5] },
  { reg: "25120039", scores: [5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5] },
  { reg: "24110365", scores: [5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5] },
  { reg: "24110387", scores: [5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5] },
  { reg: "24110394", scores: [4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4] },
  { reg: "24110340", scores: [5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5] },
  { reg: "24110618", scores: [5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5] },
  { reg: "24110381", scores: [5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5] },
  { reg: "24110406", scores: [5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5] },
  { reg: "24110354", scores: [5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5] },
  { reg: "24110408", scores: [5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5] },
  { reg: "24110407", scores: [5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5] },
  { reg: "24110369", scores: [5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5] },
  { reg: "24110342", scores: [5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5] },
  { reg: "24110415", scores: [5, 5, 3, 5, 5, 5, 5, 5, 5, 5, 5, 5] },
  { reg: null, scores: [5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5] },
  { reg: "24110358", scores: [5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5] },
  { reg: null, scores: [5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5] },
  { reg: "24110380", scores: [5, 5, 3, 5, 3, 5, 5, 5, 5, 5, 5, 5] },
  { reg: "24110409", scores: [5, 4, 4, 5, 4, 4, 5, 5, 5, 5, 5, 5] },
  { reg: null, scores: [5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5] },
  { reg: "24110374", scores: [4, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5] },
  { reg: "24110405", scores: [5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5] },
  { reg: "24110344", scores: [5, 3, 4, 4, 4, 5, 3, 4, 4, 4, 4, 4] },
  { reg: "24110352", scores: [5, 5, 4, 5, 5, 5, 5, 5, 3, 4, 5, 5] },
  { reg: "24110390", scores: [5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5] },
  { reg: "24110575", scores: [3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3] },
  { reg: "24110367", scores: [5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5] },
  { reg: "24110361", scores: [4, 4, 4, 4, 4, 4, 4, 4, 3, 4, 4, 4] },
  { reg: "25120042", scores: [5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5] },
  { reg: "24110364", scores: [5, 3, 5, 5, 5, 4, 5, 5, 5, 5, 5, 5] },
  { reg: null, scores: [5, 5, 5, 5, 5, 5, 5, 5, 4, 5, 5, 5] },
  { reg: "24110383", scores: [5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5] },
  { reg: "24110371", scores: [5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5] },
  { reg: null, scores: [5, 4, 4, 4, 4, 5, 4, 4, 5, 4, 4, 4] },
  { reg: "24110372", scores: [3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3] },
  { reg: "24110393", scores: [4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4] },
  { reg: "24110363", scores: [5, 4, 5, 5, 5, 5, 5, 5, 4, 4, 5, 5] },
  { reg: "24110362", scores: [5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5] },
  { reg: "24110417", scores: [5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5] },
  { reg: "25120043", scores: [5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5] },
  { reg: "24110398", scores: [5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5] },
  { reg: "24110403", scores: [5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5] },
  { reg: "24110397", scores: [5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5] },
  { reg: "24110347", scores: [5, 3, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5] },
  { reg: "24110368", scores: [3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3] },
  { reg: "24110346", scores: [5, 4, 5, 5, 5, 5, 5, 5, 4, 5, 5, 5] },
  { reg: "24110388", scores: [5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5] },
  { reg: "24110353", scores: [5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5] },
  { reg: "24110402", scores: [5, 5, 5, 4, 5, 5, 5, 5, 5, 5, 5, 5] },
  { reg: "24110414", scores: [4, 4, 5, 4, 4, 2, 5, 5, 4, 4, 4, 4] },
  { reg: "24110412", scores: [4, 5, 5, 4, 4, 4, 4, 4, 4, 4, 4, 4] },
  { reg: "24110401", scores: [5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5] },
  { reg: "24111196", scores: [5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5] },
  { reg: "24110351", scores: [5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5] },
  { reg: "24110359", scores: [5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5] },
  { reg: "24110350", scores: [5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5] },
  { reg: "24110396", scores: [5, 4, 5, 5, 5, 4, 5, 4, 4, 5, 4, 4] },
  { reg: "24110376", scores: [5, 5, 5, 5, 5, 3, 5, 5, 5, 5, 5, 5] },
  { reg: "24110343", scores: [5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5] },
  { reg: "24110399", scores: [5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5] },
  { reg: "24110259", scores: [5, 4, 4, 3, 4, 5, 4, 4, 4, 5, 4, 5] },
  { reg: "24110392", scores: [5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5] },
  { reg: "24100373", scores: [5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5] },
  { reg: "24110391", scores: [3, 4, 3, 4, 4, 4, 4, 4, 4, 4, 4, 4] },
  { reg: "24110380", scores: [5, 5, 5, 5, 4, 5, 5, 5, 5, 5, 5, 5] },
  { reg: "24120036", scores: [4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4] },
  { reg: "24110377", scores: [5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5] },
];

// ─── Student Feedback (Business Management): 83 real responses ────────────────
// scores[0..10] = 11 questions, already numeric (1-5)
const STUDENT_FEEDBACK_BM_DATA = [
  {
    name: "Bhumika Kalasi",
    reg: "23110641",
    scores: [5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5],
  },
  {
    name: "Biswajeet Dash",
    reg: "23110643",
    scores: [5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5],
  },
  {
    name: "SAI PRASAD KAR",
    reg: "23110677",
    scores: [5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5],
  },
  {
    name: "GYANARANJAN MOHARANA",
    reg: "23110655",
    scores: [5, 5, 4, 4, 5, 5, 4, 4, 5, 4, 5],
  },
  {
    name: "Akash Lakra",
    reg: "23110631",
    scores: [5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5],
  },
  {
    name: "Pradyush Kumar Jena",
    reg: "23110464",
    scores: [5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5],
  },
  {
    name: "Smarika Behera",
    reg: "23110694",
    scores: [4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4],
  },
  {
    name: "Anandita Sahoo",
    reg: "23110633",
    scores: [3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3],
  },
  {
    name: "Anandita Sahoo",
    reg: "23110633",
    scores: [5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5],
  },
  {
    name: "Sambit Kumar Mohanty",
    reg: "23110899",
    scores: [4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4],
  },
  {
    name: "Milan Dhal",
    reg: "23110660",
    scores: [5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5],
  },
  {
    name: "Dibyaranjan Katual",
    reg: "23110651",
    scores: [5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5],
  },
  {
    name: "Arpana Kujur",
    reg: "23110636",
    scores: [5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5],
  },
  {
    name: "Himangi Swain",
    reg: "23110656",
    scores: [5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5],
  },
  {
    name: "Chandan Kumar Satapathy",
    reg: "23110645",
    scores: [5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5],
  },
  {
    name: "Divyasha nayak",
    reg: "23110653",
    scores: [5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5],
  },
  {
    name: "Debanshu Kumar Pradhan",
    reg: "23110648",
    scores: [5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5],
  },
  {
    name: "Shubhashree Mohanty",
    reg: "23110690",
    scores: [5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5],
  },
  {
    name: "Smarak Kumar Pradhan",
    reg: "23110693",
    scores: [5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5],
  },
  {
    name: "Siddhi pradayanee sahoo",
    reg: "24120071",
    scores: [5, 5, 5, 5, 2, 5, 5, 5, 5, 5, 5],
  },
  {
    name: "PUSPANJALI BEHERA",
    reg: "23110671",
    scores: [5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5],
  },
  {
    name: "RITTIK GOURAV RAUL",
    reg: "23110799",
    scores: [5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5],
  },
  {
    name: "Preetesh khadanga",
    reg: "23110667",
    scores: [5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5],
  },
  {
    name: "Debadutta Patel",
    reg: "23110432",
    scores: [5, 5, 4, 4, 5, 5, 5, 5, 5, 4, 5],
  },
  {
    name: "BHUMIKA MAHALIK",
    reg: "23110642",
    scores: [5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5],
  },
  {
    name: "Jyotir Aditya Rout",
    reg: "23110657",
    scores: [5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5],
  },
  {
    name: "Subham Maheswari Jena",
    reg: "23110696",
    scores: [5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5],
  },
  {
    name: "Abhay Abhinandan",
    reg: "23110625",
    scores: [5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5],
  },
  {
    name: "Rasmi Ranjan Nayak",
    reg: "23110672",
    scores: [3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3],
  },
  {
    name: "Saisuman Dash",
    reg: "23110678",
    scores: [5, 4, 5, 5, 5, 5, 5, 5, 5, 5, 5],
  },
  {
    name: "Aditya Agrawal",
    reg: "23110628",
    scores: [5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5],
  },
  {
    name: "Jasasmita Sahoo",
    reg: "24120066",
    scores: [5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5],
  },
  {
    name: "Pratik Raj Senapati",
    reg: "24120067",
    scores: [5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5],
  },
  {
    name: "Om Prasad Sahoo",
    reg: "23110665",
    scores: [5, 5, 4, 4, 5, 5, 4, 4, 4, 4, 4],
  },
  {
    name: "Sashanka sekhar swain",
    reg: "23110682",
    scores: [5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5],
  },
  {
    name: "Arpana Kujur",
    reg: "23110636",
    scores: [5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5],
  },
  {
    name: "GIRINDRA MAHARANA",
    reg: "23110654",
    scores: [2, 3, 3, 5, 5, 5, 5, 5, 4, 5, 4],
  },
  {
    name: "Shradha Suman Mohapatra",
    reg: "23110688",
    scores: [5, 4, 5, 5, 5, 5, 4, 4, 4, 5, 5],
  },
  {
    name: "Ayush Simon Barwa",
    reg: "23110639",
    scores: [5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5],
  },
  {
    name: "Aditya Kumar Pradhan",
    reg: "23110629",
    scores: [3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3],
  },
  {
    name: "Soumyadeepta Patel",
    reg: "23110695",
    scores: [5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5],
  },
  {
    name: "Novtej Mallick",
    reg: "23110664",
    scores: [5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5],
  },
  {
    name: "Abhisek Panda",
    reg: "23110627",
    scores: [5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5],
  },
  {
    name: "Sarbesh Jena",
    reg: "2311068",
    scores: [5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5],
  },
  {
    name: "M.K. Sanket",
    reg: "23110658",
    scores: [5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5],
  },
  {
    name: "Sankar Kumar Nayak",
    reg: "23110680",
    scores: [4, 3, 4, 4, 4, 4, 3, 4, 3, 3, 4],
  },
  {
    name: "Nilima Lakra",
    reg: "23110663",
    scores: [4, 4, 5, 4, 4, 4, 4, 4, 4, 4, 4],
  },
  {
    name: "Subhranshu Naik",
    reg: "23110698",
    scores: [4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4],
  },
  {
    name: "B Arya Kumari Sameekshya",
    reg: "23110640",
    scores: [5, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4],
  },
  {
    name: "AYUSH DASH",
    reg: "23110638",
    scores: [5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5],
  },
  {
    name: "Sibaditya Ashirbad",
    reg: "23110692",
    scores: [5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5],
  },
  {
    name: "Priyankar Mallick",
    reg: "23110668",
    scores: [5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5],
  },
  {
    name: "Puneet Kumar Dhal",
    reg: "23110669",
    scores: [5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5],
  },
  {
    name: "Navycut Dehury",
    reg: "23110662",
    scores: [5, 5, 5, 5, 5, 4, 4, 5, 5, 5, 4],
  },
  {
    name: "Shubhajit Kumar Senapati",
    reg: "23110689",
    scores: [5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5],
  },
  {
    name: "Disha Agarwal",
    reg: "23110652",
    scores: [4, 3, 5, 4, 4, 4, 3, 3, 5, 5, 5],
  },
  {
    name: "Utkal Kumar Daa",
    reg: "23110921",
    scores: [5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5],
  },
  {
    name: "Debabrata Sahoo",
    reg: "23110647",
    scores: [5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5],
  },
  {
    name: "Monalisha patra",
    reg: "23110661",
    scores: [5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5],
  },
  {
    name: "Abhijit Panda",
    reg: "23110626",
    scores: [5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5],
  },
  {
    name: "Ratna Bibhusan Panda",
    reg: "23110673",
    scores: [5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5],
  },
  {
    name: "Smarika Behera",
    reg: "23110694",
    scores: [5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5],
  },
  {
    name: "Sudhananda Patra",
    reg: "23110699",
    scores: [3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3],
  },
  {
    name: "Shibananda Sahu",
    reg: "24120070",
    scores: [5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5],
  },
  {
    name: "Chandan kumar Das",
    reg: "23110644",
    scores: [4, 3, 4, 4, 4, 4, 4, 4, 4, 4, 4],
  },
  {
    name: "Adwait Prasad Panda",
    reg: "23110551",
    scores: [4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4],
  },
  {
    name: "Adwait Prasad Panda",
    reg: "23110551",
    scores: [4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4],
  },
  {
    name: "SUBHENDU KUMAR SATAPATHY",
    reg: "23110697",
    scores: [5, 3, 4, 4, 5, 5, 5, 4, 4, 5, 5],
  },
  {
    name: "Dibyaranjan Katual",
    reg: "23110651",
    scores: [4, 4, 4, 5, 5, 5, 4, 4, 5, 4, 5],
  },
  {
    name: "Anusha Santra",
    reg: "24120065",
    scores: [4, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5],
  },
  {
    name: "Akash Lakra",
    reg: "23110631",
    scores: [5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5],
  },
  {
    name: "Purna Chandra Murmu",
    reg: "23110670",
    scores: [4, 4, 3, 3, 4, 3, 3, 3, 3, 3, 5],
  },
  {
    name: "Sukumar Dash",
    reg: "23110700",
    scores: [1, 1, 3, 3, 1, 3, 3, 3, 2, 4, 3],
  },
  {
    name: "Arpita Mohapatra",
    reg: "23110637",
    scores: [3, 3, 5, 4, 5, 5, 4, 4, 4, 5, 5],
  },
  {
    name: "Siddhi pradayanee sahoo",
    reg: "24120071",
    scores: [5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5],
  },
  {
    name: "Rudramadhab Panda",
    reg: "23110674",
    scores: [5, 5, 4, 4, 4, 4, 4, 4, 4, 4, 4],
  },
  {
    name: "Satyabrata Nayak",
    reg: "23110684",
    scores: [4, 4, 5, 5, 5, 4, 5, 5, 5, 5, 2],
  },
  {
    name: "Ankit Kumar Das",
    reg: "23110634",
    scores: [4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4],
  },
  {
    name: "Vaishnavi Sabat",
    reg: "23110702",
    scores: [2, 2, 3, 3, 2, 3, 3, 2, 3, 3, 2],
  },
  {
    name: "Vaishnavi Sabat",
    reg: "23110702",
    scores: [2, 2, 3, 3, 2, 3, 3, 2, 3, 3, 2],
  },
  {
    name: "Ankush Bag",
    reg: "23110635",
    scores: [4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4],
  },
  {
    name: "Prabin Kumar Khamania",
    reg: "23110666",
    scores: [5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5],
  },
  {
    name: "ADITYA NARAYAN MALI",
    reg: "23110630",
    scores: [5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5],
  },
];

// ─── Course & CO definitions ───────────────────────────────────────────────────

const CO_DEFINITIONS = [
  {
    code: "CO1",
    description:
      "Analyze the efficiency of algorithms including different types of sorting, evaluate their time and space complexity",
  },
  {
    code: "CO2",
    description:
      "Able to understand concepts of algorithm design and principles, learn different algorithm design strategies including divide and conquer methodologies and solve recurrences",
  },
  {
    code: "CO3",
    description:
      "Understand the concept and use of different greedy and dynamic algorithms",
  },
  {
    code: "CO4",
    description:
      "Ability to design, analyze and prove correctness of graph algorithms",
  },
  {
    code: "CO5",
    description:
      "Understand different algorithmic design strategies based on back tracking and branch and bound",
  },
];

const CO_ATTAINMENT_Q_DEFS = [
  {
    co: "CO1",
    text: "Rate your attainment of CO1: Analyze the efficiency of algorithms including different types of sorting, evaluate their time and space complexity",
  },
  {
    co: "CO2",
    text: "Rate your attainment of CO2: Understand algorithm design principles, divide and conquer strategies and solve recurrences",
  },
  {
    co: "CO3",
    text: "Rate your attainment of CO3: Understand and apply greedy and dynamic programming algorithms",
  },
  {
    co: "CO4",
    text: "Rate your attainment of CO4: Design, analyze and prove correctness of graph algorithms",
  },
  {
    co: "CO5",
    text: "Rate your attainment of CO5: Understand algorithmic design strategies based on backtracking and branch and bound",
  },
];

const CURRICULAR_GAP_Q_DEFS = [
  {
    co: "CO1",
    text: "Depth of knowledge, critical thinking, and intellectual enrichment acquired through the course content",
  },
  { co: "CO2", text: "Course added value to your skills" },
  { co: "CO3", text: "Course content met the course objectives adequately" },
  {
    co: "CO4",
    text: "Course content is relevant to the degree you enrolled for",
  },
  { co: "CO5", text: "Course content meets the requirements of the industry" },
  { co: "CO1", text: "You have learned concepts beyond the course content" },
  {
    co: "CO2",
    text: "You have learned concepts through examples and applications",
  },
  { co: "CO3", text: "You could access lecture notes and course materials" },
  {
    co: "CO4",
    text: "Curriculum promotes the use of textbooks, reference books, journals, and e-resources",
  },
  { co: "CO5", text: "The curriculum is designed to enhance employability" },
  {
    co: "CO1",
    text: "Teaching hours per week and credit allotted for this course are adequate",
  },
  { co: "CO2", text: "Assessment and evaluation process is fair and unbiased" },
];

const TEACHER_Q_DEFS = [
  {
    co: "CO1",
    text: "Has the teacher covered the entire syllabus as prescribed by the University?",
  },
  {
    co: "CO2",
    text: "Has the teacher covered relevant topics beyond the syllabus?",
  },
  {
    co: "CO3",
    text: "Effectiveness of the teacher in terms of technical content",
  },
  {
    co: "CO4",
    text: "Effectiveness of the teacher in terms of Communication Skills",
  },
  {
    co: "CO5",
    text: "Effectiveness of the teacher in terms of use of teaching aids",
  },
  { co: "CO1", text: "Pace on which contents were covered" },
  { co: "CO2", text: "Motivation and Inspiration for students to learn" },
  {
    co: "CO3",
    text: "Motivation and Inspiration for students to learn - Practical Demonstration",
  },
  {
    co: "CO4",
    text: "Motivation and Inspiration for students to learn - Hands on Training",
  },
  { co: "CO5", text: "Clarity of expectation of students" },
  { co: "CO1", text: "Feedback provided on students' progress" },
  { co: "CO2", text: "Willingness to offer help and advice to students" },
];

const STUDENT_FEEDBACK_BM_Q_DEFS = [
  {
    co: "CO1",
    text: "Has the teacher covered relevant topics beyond the syllabus? [Business Management]",
  },
  {
    co: "CO2",
    text: "Has the teacher covered relevant topics beyond the syllabus? [Business Management] (2)",
  },
  {
    co: "CO3",
    text: "Effectiveness of the teacher in terms of Communication Skills [Business Management]",
  },
  {
    co: "CO4",
    text: "Effectiveness of the teacher in terms of use of teaching aids [Business Management]",
  },
  {
    co: "CO5",
    text: "Pace on which contents were covered [Business Management]",
  },
  {
    co: "CO1",
    text: "Motivation and Inspiration for students to learn [Business Management]",
  },
  {
    co: "CO2",
    text: "Motivation and Inspiration for students to learn - Practical Demonstration [Business Management]",
  },
  {
    co: "CO3",
    text: "Motivation and Inspiration for students to learn - Hands on Training [Business Management]",
  },
  {
    co: "CO4",
    text: "Clarity of expectation of students [Business Management]",
  },
  {
    co: "CO5",
    text: "Feedback provided on students progress [Business Management]",
  },
  {
    co: "CO1",
    text: "Willingness to offer help and advice to students [Business Management]",
  },
];

// ─── Helper ───────────────────────────────────────────────────────────────────

async function findOrCreate(Model, query, data) {
  let doc = await Model.findOne(query);
  if (!doc) doc = await Model.create(data);
  return doc;
}

// ─── Main Seeder ──────────────────────────────────────────────────────────────

async function seed() {
  console.log("🌱 Connecting to MongoDB...");
  await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`);
  console.log("✅ Connected\n");

  const PASSWORD = "Password@123";

  // ── Users ──────────────────────────────────────────────────────────────────

  console.log("👤 Creating admin & faculty...");
  const admin = await findOrCreate(
    User,
    { email: "admin@acadlytics.in" },
    {
      name: "Admin",
      email: "admin@acadlytics.in",
      password: PASSWORD,
      role: "admin",
      isVerified: true,
    }
  );
  const faculty = await findOrCreate(
    User,
    { email: "faculty.aad@acadlytics.in" },
    {
      name: "Dr. Priya Sharma",
      email: "faculty.aad@acadlytics.in",
      password: PASSWORD,
      role: "faculty",
      isVerified: true,
    }
  );
  // BM course faculty
  const bmFaculty = await findOrCreate(
    User,
    { email: "faculty.bm@acadlytics.in" },
    {
      name: "Prof. Business Management",
      email: "faculty.bm@acadlytics.in",
      password: PASSWORD,
      role: "faculty",
      isVerified: true,
    }
  );
  console.log("  ✅ Admin, Faculty (AAD & BM) ready\n");

  console.log("👥 Creating students...");
  const studentMap = {}; // reg → User doc
  let created = 0;
  for (const [name, reg] of ALL_STUDENTS) {
    const email = `${reg}@acadlytics.in`;
    let s = await User.findOne({ email });
    if (!s) {
      s = await User.create({
        name,
        email,
        password: PASSWORD,
        role: "student",
        isVerified: true,
      });
      created++;
    }
    studentMap[reg] = s;
  }
  console.log(
    `  ✅ ${created} new students created (${Object.keys(studentMap).length} total)\n`
  );

  // ── CS2103 — Algorithm Analysis & Design ───────────────────────────────────

  console.log("📚 Creating CS2103 course...");
  const cs2103 = await findOrCreate(
    Course,
    { code: "CS2103" },
    {
      name: "Algorithm Analysis and Design",
      code: "CS2103",
      semester: 4,
      faculty: faculty._id,
    }
  );
  console.log("  ✅ CS2103 ready");

  const coMap = {};
  for (const def of CO_DEFINITIONS) {
    const co = await findOrCreate(
      CourseOutcome,
      { course: cs2103._id, code: def.code },
      { course: cs2103._id, ...def }
    );
    coMap[def.code] = co;
  }
  console.log("  ✅ 5 Course Outcomes ready\n");

  // ── CO Attainment Form ─────────────────────────────────────────────────────

  console.log("📝 Creating CO Attainment form...");
  const coForm = await findOrCreate(
    FeedbackForm,
    { course: cs2103._id, title: "CO Attainment Survey - CS2103" },
    {
      title: "CO Attainment Survey - CS2103",
      course: cs2103._id,
      isActive: false,
      deadline: new Date("2026-04-10"),
    }
  );

  const coQuestions = [];
  for (const qDef of CO_ATTAINMENT_Q_DEFS) {
    const q = await findOrCreate(
      Question,
      { form: coForm._id, text: qDef.text },
      {
        form: coForm._id,
        text: qDef.text,
        type: "rating",
        co: coMap[qDef.co]._id,
        weightage: 1,
      }
    );
    coQuestions.push({ q, coIdx: CO_ATTAINMENT_Q_DEFS.indexOf(qDef) });
  }
  console.log(`  ✅ ${coQuestions.length} CO Attainment questions ready`);

  // Seed CO Attainment submissions
  let coCreated = 0;
  for (const row of CO_ATTAINMENT_DATA) {
    const student = studentMap[row.reg];
    if (!student) {
      console.log(`  ⚠ No user for reg ${row.reg} (${row.name})`);
      continue;
    }
    const exists = await FeedbackSubmission.findOne({
      student: student._id,
      form: coForm._id,
    });
    if (exists) continue;
    const sub = await FeedbackSubmission.create({
      student: student._id,
      form: coForm._id,
      course: cs2103._id,
      submittedAt: new Date("2026-04-02"),
    });
    const responseDocs = coQuestions.map(({ q }, i) => ({
      submission: sub._id,
      question: q._id,
      value: row.scores[i],
    }));
    await Response.insertMany(responseDocs);
    coCreated++;
  }
  console.log(`  ✅ ${coCreated} CO Attainment submissions inserted\n`);

  // ── Curricular Gap Form ────────────────────────────────────────────────────

  console.log("📝 Creating Curricular Gap form...");
  const gapForm = await findOrCreate(
    FeedbackForm,
    { course: cs2103._id, title: "Curricular Gap Analysis - CS2103" },
    {
      title: "Curricular Gap Analysis - CS2103",
      course: cs2103._id,
      isActive: false,
      deadline: new Date("2026-04-10"),
    }
  );

  const gapQuestions = [];
  for (const qDef of CURRICULAR_GAP_Q_DEFS) {
    const q = await findOrCreate(
      Question,
      { form: gapForm._id, text: qDef.text },
      {
        form: gapForm._id,
        text: qDef.text,
        type: "rating",
        co: coMap[qDef.co]._id,
        weightage: 1,
      }
    );
    gapQuestions.push(q);
  }
  console.log(`  ✅ ${gapQuestions.length} Curricular Gap questions ready`);

  let gapCreated = 0;
  for (const row of CURRICULAR_GAP_DATA) {
    const student = studentMap[row.reg];
    if (!student) {
      console.log(`  ⚠ No user for reg ${row.reg} (${row.name})`);
      continue;
    }
    const exists = await FeedbackSubmission.findOne({
      student: student._id,
      form: gapForm._id,
    });
    if (exists) continue;
    const sub = await FeedbackSubmission.create({
      student: student._id,
      form: gapForm._id,
      course: cs2103._id,
      submittedAt: new Date("2026-04-02"),
    });
    const responseDocs = gapQuestions.map((q, i) => ({
      submission: sub._id,
      question: q._id,
      value: row.scores[i],
    }));
    await Response.insertMany(responseDocs);
    gapCreated++;
  }
  console.log(`  ✅ ${gapCreated} Curricular Gap submissions inserted\n`);

  // ── Teacher Feedback Form (AAD) — ACTIVE ──────────────────────────────────

  console.log("📝 Creating Teacher Feedback form (AAD, ACTIVE)...");
  const teacherForm = await findOrCreate(
    FeedbackForm,
    {
      course: cs2103._id,
      title: "Teacher Feedback Survey - Algorithm Analysis and Design",
    },
    {
      title: "Teacher Feedback Survey - Algorithm Analysis and Design",
      course: cs2103._id,
      isActive: true,
      deadline: new Date("2026-06-30"),
    }
  );

  const teacherQuestions = [];
  for (const qDef of TEACHER_Q_DEFS) {
    const q = await findOrCreate(
      Question,
      { form: teacherForm._id, text: qDef.text },
      {
        form: teacherForm._id,
        text: qDef.text,
        type: "rating",
        co: coMap[qDef.co]._id,
        weightage: 1,
      }
    );
    teacherQuestions.push(q);
  }
  console.log(
    `  ✅ ${teacherQuestions.length} Teacher Feedback questions ready`
  );

  let tfCreated = 0;
  for (const row of TEACHER_FEEDBACK_DATA) {
    if (!row.reg || row.reg === "null") continue;
    const student = studentMap[row.reg];
    if (!student) {
      console.log(`  ⚠ No user for reg ${row.reg}`);
      continue;
    }
    const exists = await FeedbackSubmission.findOne({
      student: student._id,
      form: teacherForm._id,
    });
    if (exists) continue;
    const sub = await FeedbackSubmission.create({
      student: student._id,
      form: teacherForm._id,
      course: cs2103._id,
      submittedAt: new Date("2026-02-08"),
    });
    const responseDocs = teacherQuestions.map((q, i) => ({
      submission: sub._id,
      question: q._id,
      value: row.scores[i],
    }));
    await Response.insertMany(responseDocs);
    tfCreated++;
  }
  console.log(`  ✅ ${tfCreated} Teacher Feedback submissions inserted\n`);

  // ── Business Management Course & Feedback ─────────────────────────────────

  console.log("📚 Creating BM course & Student Feedback form...");
  const bmCourse = await findOrCreate(
    Course,
    { code: "BM2101" },
    {
      name: "Business Management",
      code: "BM2101",
      semester: 3,
      faculty: bmFaculty._id,
    }
  );

  // BM uses same CO structure but for different course
  const bmCoMap = {};
  for (const def of CO_DEFINITIONS) {
    const co = await findOrCreate(
      CourseOutcome,
      { course: bmCourse._id, code: def.code },
      { course: bmCourse._id, ...def }
    );
    bmCoMap[def.code] = co;
  }

  const bmForm = await findOrCreate(
    FeedbackForm,
    {
      course: bmCourse._id,
      title: "Student Feedback Survey - Business Management",
    },
    {
      title: "Student Feedback Survey - Business Management",
      course: bmCourse._id,
      isActive: false,
      deadline: new Date("2026-01-10"),
    }
  );

  const bmQuestions = [];
  for (const qDef of STUDENT_FEEDBACK_BM_Q_DEFS) {
    const q = await findOrCreate(
      Question,
      { form: bmForm._id, text: qDef.text },
      {
        form: bmForm._id,
        text: qDef.text,
        type: "rating",
        co: bmCoMap[qDef.co]._id,
        weightage: 1,
      }
    );
    bmQuestions.push(q);
  }
  console.log(`  ✅ ${bmQuestions.length} BM questions ready`);

  let bmCreated = 0;
  for (const row of STUDENT_FEEDBACK_BM_DATA) {
    const student = studentMap[row.reg];
    if (!student) {
      // BM students (23xxxxxx) may not be in CS2103 pool — create them
      const email = `${row.reg}@acadlytics.in`;
      let s = await User.findOne({ email });
      if (!s)
        s = await User.create({
          name: row.name,
          email,
          password: PASSWORD,
          role: "student",
          isVerified: true,
        });
      studentMap[row.reg] = s;
    }
    const s = studentMap[row.reg];
    const exists = await FeedbackSubmission.findOne({
      student: s._id,
      form: bmForm._id,
    });
    if (exists) continue;
    const sub = await FeedbackSubmission.create({
      student: s._id,
      form: bmForm._id,
      course: bmCourse._id,
      submittedAt: new Date("2025-11-28"),
    });
    const responseDocs = bmQuestions.map((q, i) => ({
      submission: sub._id,
      question: q._id,
      value: row.scores[i],
    }));
    await Response.insertMany(responseDocs);
    bmCreated++;
  }
  console.log(`  ✅ ${bmCreated} BM Student Feedback submissions inserted\n`);

  // ── Analytics Snapshot (CS2103) ────────────────────────────────────────────

  console.log("📈 Computing & saving analytics snapshot for CS2103...");

  // CO Attainment: avg per CO across all responses
  const coScoresByCode = { CO1: [], CO2: [], CO3: [], CO4: [], CO5: [] };
  for (const row of CO_ATTAINMENT_DATA) {
    ["CO1", "CO2", "CO3", "CO4", "CO5"].forEach((c, i) =>
      coScoresByCode[c].push(row.scores[i])
    );
  }

  const coAttainment = CO_DEFINITIONS.map((def, idx) => {
    const arr = coScoresByCode[def.code];
    const pct = Number(
      ((arr.reduce((a, b) => a + b, 0) / (arr.length * 5)) * 100).toFixed(2)
    );
    return {
      coCode: def.code,
      description: def.description,
      percentage: pct,
      level: pct >= 70 ? "High" : pct >= 40 ? "Medium" : "Low",
    };
  });

  const allScores = CO_ATTAINMENT_DATA.flatMap((r) => r.scores);
  const averageScore = Number(
    (allScores.reduce((a, b) => a + b, 0) / allScores.length).toFixed(2)
  );

  await AnalyticsSnapshot.findOneAndUpdate(
    { course: cs2103._id, faculty: faculty._id, semester: 4 },
    { averageScore, totalSubmissions: CO_ATTAINMENT_DATA.length, coAttainment },
    { upsert: true, new: true }
  );

  console.log("  ✅ Analytics snapshot saved");
  console.log("\n  📊 CO Attainment Results:");
  coAttainment.forEach((co) =>
    console.log(`     ${co.coCode}: ${co.percentage}% → ${co.level}`)
  );
  console.log(`  📊 Overall avg score: ${averageScore}/5`);

  // ── Done ───────────────────────────────────────────────────────────────────

  console.log(`
🎉 Seeding complete!

═══════════════════════════════════════════════════════
  Login Credentials  (password: Password@123)
═══════════════════════════════════════════════════════
  Admin        : admin@acadlytics.in
  Faculty AAD  : faculty.aad@acadlytics.in
  Faculty BM   : faculty.bm@acadlytics.in
  Student (ex) : 24110375@acadlytics.in
═══════════════════════════════════════════════════════
  CS2103 — Algorithm Analysis & Design (Sem 4)
    CO Attainment form   : ${CO_ATTAINMENT_DATA.length} responses
    Curricular Gap form  : ${CURRICULAR_GAP_DATA.length} responses
    Teacher Feedback     : ${TEACHER_FEEDBACK_DATA.length} responses (ACTIVE)
  BM2101 — Business Management (Sem 3)
    Student Feedback BM  : ${STUDENT_FEEDBACK_BM_DATA.length} responses
═══════════════════════════════════════════════════════
`);

  await mongoose.disconnect();
}

seed().catch((err) => {
  console.error("❌ Seeder failed:", err);
  process.exit(1);
});

/**
 * Created by gijin on 2017-07-10.
 */

import {expect} from 'chai';
import 'mocha';

import {Survey} from "../src/Survey";
import {SurveyQuestion, MultipleChoiceAnswer, MultipleChoiceQuestion} from "../src/ISurveyQuestion";

describe("Basic test for survey", function () {

    let s: Survey;
    let members : SurveyQuestion[];
    let members2 : any[];

    beforeEach(function () {

        let q0 : SurveyQuestion = {num: 0, question: "What is your favourite operating system?", answer: null};
        let q1 : MultipleChoiceQuestion = {
            num:         1,
            question:    "Please select 'C' to preserve your answers",
            answer:      null,
            rightanswer: MultipleChoiceAnswer.C
        };
        let q2 = {num: 2, question: "On a scale of 1 to 5, how much do you enjoy Computer Science?", answer: null};
        let q3 = {num: 3, question: "What is pi to at least 3 decimal places?", answer: ""};

        members = [];
        members.push(q0);
        members.push(q1);
        members.push(q2);
        members.push(q3);

        s = new Survey();
        s.addManyQuestions(members);

        members2 = [{num: 4, question: "What is your favourite sport to play?", answer: ""},
            {num: 5, question: "How many years have you spent in school?", answer: ""},
            {
                num:         6,
                question:    "What year did the French Revolution begin? A. 1492 B. 1779 C. 1792 D. 1812",
                answer:      null,
                rightanswer: MultipleChoiceAnswer.B
            }];

    });

    it("Should return the next question in list and have valid question properties", function () {

        let q = s.getQuestion();
        let expected = members[0];
        expect(q).to.equal(expected);

        let q2 = s.getNextQuestion();
        let allKeys = ["num", "answer", "question", "rightanswer"];

        expect(q2).to.have.all.keys(allKeys);

        let noProp = "rightanswer";
        expect(q).to.not.have.property(noProp);
    });

    it("Should not return any questions if no questions have been initialized", function () {

        let test = new Survey();

        let getActual = () => {test.getQuestion()};
        expect(getActual).to.throw("No questions");

        let getNextActual = () => {test.getNextQuestion()};
        expect(getNextActual).to.throw("No questions");

        let getManyActual = test.getAllQuestions();
        expect(getManyActual).to.have.members([]);

    });

    it("Should return all questions in list when getAllQuestions() invoked", function () {

        s.addQuestion({num: 4, question: "How do you like the command-line interface?", answer: null});

        let qs = s.getAllQuestions();
        let member = {num: 2, question: "On a scale of 1 to 5, how much do you enjoy Computer Science?", answer: null};
        let returnMembers = [{num: 0, question: "What is your favourite operating system?", answer: null},
            {
                num:         1,
                question:    "Please select 'C' to preserve your answers",
                answer:      null,
                rightanswer: MultipleChoiceAnswer.C
            },
            {num: 4, question: "How do you like the command-line interface?", answer: null}
        ];

        console.log(qs);
        expect(qs).to.deep.include(member);
        expect(qs).to.deep.include.members(returnMembers); // deep.include.members checks that target is a superset of expected
    });


    it("Should ensure that question ordinal numbers are consecutive", function () {

        // This matcher determines whether or not all the questions in a survey
        // are consecutive by checking the number of each question
        // return true if test should pass

        expect(s).to.satisfy(function (quiz: Survey) {
            let i = 0;
            quiz.getAllQuestions().forEach(function (q: SurveyQuestion) {
                if (q.num !== i) {
                    return false;
                }
                i++;
            });
            return true;
        });
    });

    it("Should be able to answer a question when answerQuestion invoked and update state", function () {

        let q = s.getQuestion();

        let validAns = () => {
            s.answerQuestion("ArchLinux");
        };
        expect(validAns).to.not.throw();

        let expected = {num: 0, question: "What is your favourite operating system?", answer: "ArchLinux"};
        expect(q).to.deep.equal(expected);

    });


    it("Should be able to answer a MC question as above", function () {

        let q = s.getNextQuestion();
        s.answerQuestion(MultipleChoiceAnswer.A);

        expect(q).to.have.property("answer", MultipleChoiceAnswer.A);

    });


    it("Should be able to answer a complex numerical question as above", function () {

        s.getNextQuestion();
        s.getNextQuestion();
        let q = s.getNextQuestion();

        s.answerQuestion(3.1415926);

        let actual = q.answer;
        expect(actual).to.be.within(3.141, 3.1416);

        expect(q).to.have.property("answer", 3.1415926);

    });


    it("Should be able to throw error for MC question with invalid answer", function () {

        let q = s.getNextQuestion();

        let testFunc = () => {
            s.answerQuestion("Hello World");
        };

        expect(testFunc).to.throw();
        expect(q).to.have.property("answer", null);


    });


    it("Should be able to load a file when invoked, and return contents of file", function () {
        return s.getFileInformation("./sample.txt").then((result) => {
            let expected = '{"num" : 5, "question" : "How many years have you spent in school?", "answer": ""}';
            expect(result).to.contain(expected);
        });
    });

    it("Should return an error when attempting to load illegitimate file", function () {
        return s.getFileInformation("./nonexistent.txt").then((res : any) => {
            throw ("The promise should not have been fulfilled");
        }, function rejected(err : any) {

        })
    });


    it("Should be able to parse questions from a file and store them in Survey object", function () {
        return s.loadQuestionsFromFile("./sample.txt").then((data) => {
            let allQ = s.getAllQuestions();
            expect(allQ).to.have.deep.members(members2);

        })
    });

});
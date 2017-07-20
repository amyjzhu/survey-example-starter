
import {SurveyQuestion, MultipleChoiceQuestion, MultipleChoiceAnswer} from './ISurveyQuestion';


/*
 * @class Represents a survey runner for user.
 * Keeps track of user's position in survey
 * And all questions to be answered.
 */
export class Survey {

    // list of all questions in this survey
    private questions: SurveyQuestion[];

    // the question currently available to answer
    private currentQuestion: number;


    /*
     * Initializes a survey with no questions, starting at index 0.
     */
    constructor() {
        this.questions = [];
        this.currentQuestion = 0;
    }


    /*
     * Returns the current question.
     * If currentQuestion does not exist, throws error.
     *
     * @return {SurveyQuestion | null} The current question
     */
    public getQuestion() : SurveyQuestion {
        let val = this.questions[this.currentQuestion];
        if (val !== undefined) {
            return val;
        } else {
            throw ("No questions");
        }
    }

    /*
     * Returns the next question and increments the currentQuestion counter.
     * If no more questions in list, throws error.
     *
     * @return {SurveyQuestion} The next question
     */
    public getNextQuestion() : SurveyQuestion {
        let val = this.questions[++this.currentQuestion];
        if (val !== undefined) {
            return val;
        } else {
            throw ("No questions");
        }
    }

    /*
     * Returns a list of all questions stored in Survey.
     * This list may be empty.
     *
     * @return {SurveyQuestion[]} Comprehensive list of questions
     */
    public getAllQuestions(): SurveyQuestion[] {
        return this.questions;
    }

    /*
     * Adds a question to the back of questions list.
     *
     * @param {SurveyQuestion} The question to add
     * /
    public addQuestion(sq: SurveyQuestion) {
        this.questions.push(sq);
    }

    /*
     * Adds multiple questions to back of questions list.
     *
     * @param {SurveyQuestion[]} sq a list of valid questions to add
     */
    public addManyQuestions(sq : SurveyQuestion[]) {
        this.questions = this.questions.concat(sq);
    }

    /*
     * Sets the answer of the current question to ans param.
     * If question is MultipleChoiceQuestion but answer is not a MultipleChoiceAnswer
     * or question is null, throw error and do not change answer.
     *
     * @param {any} ans The answer given by user input
     */
    public answerQuestion(ans: any) {
        let curq : SurveyQuestion = this.questions[this.currentQuestion];

        if (curq) {
            if ("rightanswer" in curq && !(ans in MultipleChoiceAnswer)) {
                throw ("This is a multiple choice question");
            }
            curq.answer = ans;
        }
    }

    /*
     * Returns in string format the contents of a .txt file at param fileName
     * If no such file found, raise error.
     *
     * @param {string} fileName The path to the file
     * @return {Promise<string|Error>} The contents of the file as a Promise or error if rejected
     */
    public getFileInformation(fileName : string) : Promise<String> {
        let fs = require('fs');
        return new Promise((fulfill, reject) => {
            fs.readFile(fileName, 'utf8', (err : any, result : any) => {
                if (err) { reject(err); }
                fulfill(result);
            })
        });
    }

    /*
     * Set the questions list to one loaded from a file.
     * File must contain validly-formatted JSON.
     *
     * @param {string} fileName The path to the file
     * @return {Promise<any|err> The parsed JSON object or error if rejected
     */
    public loadQuestionsFromFile(fileName : string) : Promise<any> {
        let that = this; // fat arrows do not create a new this context
        return new Promise((fulfill, reject) => {
            that.getFileInformation(fileName).then((data : string) => {
                let parsed = JSON.parse(data);
                that.questions = parsed;
                fulfill(parsed);
            }).catch((err : any) => {
                console.log(err);
                reject(err);
            })
        })
    }

}
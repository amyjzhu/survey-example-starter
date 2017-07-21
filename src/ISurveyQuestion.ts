/**
 * @class Represents a Survey question
 */
export class SurveyQuestion {

    // the position of this question in the survey
    num: number;

    // the question being asked
    question: string;

    // user's input for the answer
    answer: any;
}

/**
 * @class Represents a MultipleChoiceQuestion
 */
export class MultipleChoiceQuestion extends SurveyQuestion {

    // the user's input; may only be multiple choice
    answer: MultipleChoiceAnswer | null;

    // the correct answer for this question
    rightanswer: MultipleChoiceAnswer;
}

/**
 * @enum MultipleChoiceQuestion answer inputs may only be one of these
 */
export enum MultipleChoiceAnswer {
    A, B, C, D
}
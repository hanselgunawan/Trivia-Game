function q(q_, a_, ia_){
    this.question = q_;
    this.answer = a_;
    this.incorrect_a = ia_;
}

var trivia = {
    chosenQuestion: 0,
    triviaQuestion : [],
    generateQuestion:function () {
        $.ajax({
            url: "https://opentdb.com/api.php?amount=15&category=18&difficulty=medium&type=multiple",
            dataType: "json",
            success: function(data){
                for (var i in data.results)
                {
                    var qq = data.results[i].question;
                    var ca = data.results[i].correct_answer;
                    var ia = data.results[i].incorrect_answers;
                    trivia.triviaQuestion.push(new q(qq,ca,ia));
                }
                trivia.startGame();
            }
        });
    },
    shuffle:function(a)
    {
        var j, x, i;
        for (i = a.length; i; i--) {
            j = Math.floor(Math.random() * i);
            x = a[i - 1];
            a[i - 1] = a[j];
            a[j] = x;
        }
    },
    pushQuestion:function(randomCounter, array)
    {
        array.push(this.triviaQuestion[randomCounter].answer);
        for(var i in this.triviaQuestion[randomCounter].incorrect_a)
        {
            array.push(this.triviaQuestion[randomCounter].incorrect_a[i]);
        }
        return array;
    },
    startGame:function()
    {

        //use trivia.triviaQ.splice(<num of array that you want to delete>,1) to remove an element/object
        console.log(Object.keys(this.triviaQuestion).length);
        if(Object.keys(this.triviaQuestion).length>0)
        {
            var answer_array = [];
            var randomCounter = Math.floor(Math.random() * parseInt(Object.keys(this.triviaQuestion).length));
            $("#displayQuestion").html(this.triviaQuestion[randomCounter].question);
            answer_array = this.pushQuestion(randomCounter, answer_array);
            this.shuffle(answer_array);
            for(var j in answer_array)
            {
                $(".list-"+j+"").html(answer_array[j]);
            }
            this.chosenQuestion = randomCounter;
        }
    },
    displayGiphy:function (userAnswer) {
        const PUBLIC_KEY = 'dc6zaTOxFJmzC';
        const BASE_URL = '//api.giphy.com/v1/gifs/';
        const ENDPOINT = 'search';
        const LIMIT = 1;
        const RATING = 'pg';

        let $resultWrapper = $('.giphy-result');
        let $inputWrapper = $('.input-wrapper');

        let query = {
            text: null,
            offset: 0,
            request() {
                return `${BASE_URL}${ENDPOINT}?q=${this.text}&limit=${LIMIT}&rating=${RATING}&offset=${this.offset}&api_key=${PUBLIC_KEY}`;
            },
            fetch(callback) {
                $.getJSON(this.request())
                    .success(data => {
                        let results = data.data;
                        if (results.length) {
                            let url = results[0].images.downsized.url;
                            console.log(results);
                            callback(url);
                        } else {
                            callback('');
                        }
                    })
                    .fail(error => {
                        console.log(error);
                    });
            }
        };

        function buildImg(src = '//giphy.com/embed/xv3WUrBxWkUPC', classes = 'gif-image') {
            return `<img src="${src}" class="${classes}" alt="gif" />`;
        }

        query.text = userAnswer;
        query.offset = Math.floor(Math.random() * 25);

        if (query.text && query.text.length) {
            $inputWrapper.addClass('active').removeClass('empty');

            query.fetch(url => {
                $resultWrapper.html(buildImg(url));
            });
        }
    },
    checkAnswer:function(chosenQuestion, userAnswer)
    {
        if(this.triviaQuestion[chosenQuestion].answer === userAnswer)
        {
            $("#question-answer").hide();
            $("#correct-answer").show();
        }
        else
        {
            $("#question-answer").hide();
            $("#wrong-answer").show();
        }
        this.displayGiphy(userAnswer);
        trivia.triviaQuestion.splice(chosenQuestion,1);
    }
};

$(document).ready(function() {
    $("#question-answer").show();
    $("#correct-answer").hide();
    $("#wrong-answer").hide();

    trivia.generateQuestion();

    $(".answer-list").on("click", function (event) {
        trivia.checkAnswer(trivia.chosenQuestion, $(event.target).text());
        trivia.startGame();
    });
});
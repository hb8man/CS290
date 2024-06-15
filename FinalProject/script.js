let currentQuestionIndex = 0;
let questions = [];
let score = 0;  // Track the score

document.getElementById('triviaSetup').addEventListener('submit', function(event) {
    event.preventDefault();
    const category = document.getElementById('category').value;
    const difficulty = document.getElementById('difficulty').value;
    fetchTriviaQuestions(category, difficulty);
    score = 0;  // Reset score each time the game starts
    document.getElementById('scoreDisplay').textContent = 'Score: 0';  // Reset score display
});

function fetchTriviaQuestions(category, difficulty) {
    const url = `https://opentdb.com/api.php?amount=10&category=${category}&difficulty=${difficulty}&type=multiple`;
    fetch(url)
        .then(response => response.json())
        .then(data => {
            if (data.response_code !== 0) {
                displayNoQuestions();
            } else {
                questions = data.results;
                currentQuestionIndex = 0;
                displayQuestions(questions[currentQuestionIndex]);
            }
        })
        .catch(error => {
            console.error('Error fetching trivia questions:', error);
            displayNoQuestions();
        });
}

function displayQuestions(question) {
    const questionContainer = document.getElementById('questionContainer');
    const answers = document.getElementById('answers');
    questionContainer.innerHTML = decodeHtml(question.question);
    answers.innerHTML = '';

    let allAnswers = question.incorrect_answers.concat([question.correct_answer]);
    allAnswers.forEach(answer => {
        const button = document.createElement('button');
        button.textContent = decodeHtml(answer);
        button.onclick = () => handleAnswerClick(button, answer, question.correct_answer);
        answers.appendChild(button);
    });

    document.getElementById('nextButton').style.display = 'none';
    openModal();
}

function handleAnswerClick(button, chosenAnswer, correctAnswer) {
    const answers = document.getElementById('answers').getElementsByTagName('button');
    Array.from(answers).forEach(btn => {
        btn.disabled = true; // Disable all buttons after one click
        if (btn.textContent === correctAnswer) {
            btn.classList.add('correct');
        } else {
            btn.classList.add('incorrect');
        }
    });

    // Check if the chosen answer is correct before incrementing the score
    if (chosenAnswer === correctAnswer) {
        score++;  // Increment score only if the answer is correct
    }
    
    document.getElementById('scoreDisplay').textContent = `Score: ${score}`;  // Update score display

    document.getElementById('nextButton').style.display = 'block';  // Show the Next button after an answer is selected
}

document.getElementById('nextButton').addEventListener('click', function() {
    currentQuestionIndex++;
    if (currentQuestionIndex < questions.length) {
        displayQuestions(questions[currentQuestionIndex]);
    } else {
        endTriviaSession();
    }
});

function endTriviaSession() {
    const questionContainer = document.getElementById('questionContainer');
    questionContainer.innerHTML = `Trivia complete! Thanks for playing.`;
    document.getElementById('answers').innerHTML = '';
    document.getElementById('nextButton').style.display = 'none';
    setTimeout(() => { document.getElementById('triviaModal').style.display = 'none'; }, 3000);
}

function openModal() {
    document.getElementById('triviaModal').style.display = 'block';
}

document.getElementsByClassName('close')[0].onclick = function() {
    document.getElementById('triviaModal').style.display = 'none';
}

window.onclick = function(event) {
    let modal = document.getElementById('triviaModal');
    if (event.target === modal) {
        modal.style.display = 'none';
    }
}

function decodeHtml(html) {
    var textArea = document.createElement("textarea");
    textArea.innerHTML = html;
    return textArea.value;
}

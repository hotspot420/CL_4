let cards = {};
let questions = [];
let scores = {
    communityComfort: 0,
    rigidity: 0,
    controversy: 0,
    relationships: 0,
    emotions: 0,
    interests: 0
};

let totalQuestions = 51; // Total number of questions
let questionIndex = 0;

// Load cards and questions
Promise.all([
    fetch('cards.json').then(response => response.json()),
    fetch('questions.json').then(response => response.json())
]).then(data => {
    cards = data[0];
    questions = data[1];
    console.log("Cards Loaded:", cards); // Check if cards are loaded correctly
    initializeQuiz();
});

const vantiroRanges = {
    "Vantiro-1": { min: 4.0, max: 5.0 },
    "Vantiro-2": { min: 3.5, max: 4.5 },
    "Vantiro-4": { min: 4.0, max: 5.0 },
    "Vantiro-5": { min: 3.5, max: 4.5 },
    "Vantiro-6": { min: 2.5, max: 4.0 },
    "Vantiro-7": { min: 3.5, max: 4.5 },
    "Vantiro-9": { min: 3.0, max: 4.5 },
    "Vantiro-11": { min: 2.0, max: 3.5 },
    "Vantiro-12": { min: 4.0, max: 5.0 }
};

function initializeQuiz() {
    displayQuestion();
}

function displayQuestion() {
    if (questionIndex >= totalQuestions) {
        displayResult();
        return; // Exit if all questions are answered
    }

    const currentQuestion = questions[questionIndex];
    const questionContainer = document.getElementById('question-container');
    questionContainer.innerHTML = ''; // Clear previous question

    const questionText = document.createElement('p');
    questionText.innerText = currentQuestion.question;

    const sliderContainer = document.createElement('div');
    const slider = document.createElement('input');
    slider.type = 'range';
    slider.min = 1;
    slider.max = 5;
    slider.value = 3; // Default value
    slider.style.width = '100%'; // Make slider full width

    const labelsContainer = document.createElement('div');
    const labels = ["1", "2", "3", "4", "5"];
    labels.forEach(label => {
        const labelElement = document.createElement('span');
        labelElement.innerText = label;
        labelElement.style.flex = '1'; // Equal spacing
        labelsContainer.appendChild(labelElement);
    });
    labelsContainer.style.display = 'flex';

    sliderContainer.appendChild(slider);
    questionContainer.appendChild(questionText);
    questionContainer.appendChild(sliderContainer);
    questionContainer.appendChild(labelsContainer);

    document.getElementById('next-button').onclick = () => {
        const selectedValue = parseInt(slider.value);
        updateScores(currentQuestion.category, selectedValue);
        updateProgress();
        questionIndex++;
        displayQuestion(); // Display next question
    };
}

function updateScores(category, value) {
    scores[category] += value;
}

function updateProgress() {
    const progressBar = document.getElementById('progress-bar');
    progressBar.value = questionIndex; // Update based on questions answered
    document.getElementById('progress-text').innerText = `${progressBar.value}/${totalQuestions}`;
}

function calculateScores() {
    let averages = {};
    for (const category in scores) {
        averages[category] = (totalQuestions > 0) ? (scores[category] / totalQuestions) : 0; // Avoid NaN
    }
    console.log("Averages:", averages); // Log the averages for debugging
    return averages;
}


function getVantiroBasedOnScores() {
    const averages = calculateScores();
    let selectedVantiro;

    console.log("Averages being checked:", averages); // Log the averages

    for (const [vantiro, ranges] of Object.entries(vantiroRanges)) {
        let matches = true;

        for (const category in averages) {
            console.log(`Checking ${category}: ${averages[category]} against ${ranges.min} to ${ranges.max}`); // Log the check
            if (!(averages[category] >= ranges.min && averages[category] <= ranges.max)) {
                matches = false;
                break;
            }
        }

        if (matches) {
            selectedVantiro = vantiro;
            break;
        }
    }

    console.log("Final Selected Vantiro based on scores:", selectedVantiro); // Log this
    return selectedVantiro;
}



function getRandomImage(vantiro) {
    const folder = cards[vantiro].folder;
    const imageCount = cards[vantiro].image_count;
    const randomIndex = Math.floor(Math.random() * imageCount) + 1;

    return `${folder}/image${randomIndex}.jpg`;
}

function displayResult() {
    const selectedVantiro = getVantiroBasedOnScores();
    console.log("Selected Vantiro:", selectedVantiro); // Check if this is defined

    if (!selectedVantiro) {
        console.error("No valid Vantiro selected.");
        return; // Exit if no valid Vantiro is found
    }

    const imagePath = getRandomImage(selectedVantiro);
    console.log("Image Path:", imagePath); // Log generated image path

    document.getElementById('tarot-card').src = imagePath;
    document.getElementById('tarot-card').style.display = 'block'; // Show image
    document.getElementById('card-description').innerText = cards[selectedVantiro].description;
}

document.getElementById('next-button').onclick = () => {
    const selectedValue = parseInt(slider.value);
    updateScores(currentQuestion.category, selectedValue);
    console.log(`Updated scores:`, scores); // Log scores after updating
    updateProgress();
    questionIndex++;

    if (questionIndex < totalQuestions) {
        fadeOutAndDisplayNext();
    } else {
        displayResult();
    }
};
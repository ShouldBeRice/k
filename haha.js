// Khởi tạo danh sách từ vựng từ localStorage
let vocabList = JSON.parse(localStorage.getItem("vocabList")) || [];
let learningVocab = JSON.parse(localStorage.getItem("learningVocab")) || [];
let learnedVocab = JSON.parse(localStorage.getItem("learnedVocab")) || [];

// Cập nhật số từ trong các danh sách khi khởi động
document.getElementById("new-count").textContent = `${vocabList.length} từ`;
document.getElementById(
  "learning-count"
).textContent = `${learningVocab.length} từ`;
document.getElementById(
  "learned-count"
).textContent = `${learnedVocab.length} từ`;

// Đảm bảo giao diện được cập nhật
updateVocabularyLists();

// Thêm từ vựng mới
function addVocabulary() {
  let vocabInput = document.getElementById("vocab-input");
  let meaningInput = document.getElementById("meaning-input");
  let newWord = vocabInput.value.trim();
  let meaning = meaningInput.value.trim();

  if (newWord && meaning) {
    vocabList.push({ word: newWord, meaning: meaning });
    updateVocabularyLists();
    vocabInput.value = "";
    meaningInput.value = "";
  }
}

// Cập nhật danh sách từ vựng và lưu vào localStorage
function updateVocabularyLists() {
  document.getElementById("new-count").textContent = `${vocabList.length} từ`;
  document.getElementById(
    "learning-count"
  ).textContent = `${learningVocab.length} từ`;
  document.getElementById(
    "learned-count"
  ).textContent = `${learnedVocab.length} từ`;

  localStorage.setItem("vocabList", JSON.stringify(vocabList));
  localStorage.setItem("learningVocab", JSON.stringify(learningVocab));
  localStorage.setItem("learnedVocab", JSON.stringify(learnedVocab));

  // Cập nhật biểu đồ ngay lập tức nếu giao diện thống kê đang hiển thị
  if (document.getElementById("stats-page").style.display === "block") {
    showStatistics(); // Cập nhật dữ liệu biểu đồ
  }
}

// Mở flashcard theo loại từ vựng
function openFlashcard(type) {
  currentType = type;
  let flashcards = getFlashcardsByType(type);

  if (flashcards.length > 0) {
    currentIndex = 0;
    document.getElementById("main-page").style.display = "none";
    document.getElementById("flashcard-page").style.display = "block";
    showFlashcard();
  }
}

// Lấy danh sách từ vựng theo loại
function getFlashcardsByType(type) {
  if (type === "new") return vocabList;
  if (type === "learning") return learningVocab;
  return [];
}

// Hiển thị flashcard hiện tại
function showFlashcard() {
  let flashcards = getFlashcardsByType(currentType);
  if (flashcards.length > 0 && currentIndex < flashcards.length) {
    let currentVocab = flashcards[currentIndex];
    document.getElementById("vocab-word").textContent = currentVocab.word;
    document.getElementById("vocab-meaning").textContent = currentVocab.meaning;

    let flashcard = document.getElementById("flashcard");
    flashcard.classList.add("show-front");
    flashcard.classList.remove("show-back");

    flashcard.onclick = function () {
      if (flashcard.classList.contains("show-front")) {
        flashcard.classList.remove("show-front");
        flashcard.classList.add("show-back");
      } else {
        flashcard.classList.remove("show-back");
        flashcard.classList.add("show-front");
      }
    };
  }
}

// Chuyển flashcard tiếp theo
function nextFlashcard() {
  let flashcards = getFlashcardsByType(currentType);
  if (currentIndex < flashcards.length - 1) {
    currentIndex++;
    showFlashcard();
  } else {
    alert("Đã hết flashcard.");
  }
}

// Quay lại flashcard trước
function prevFlashcard() {
  if (currentIndex > 0) {
    currentIndex--;
    showFlashcard();
  } else {
    alert("Đây là thẻ đầu tiên.");
  }
}

// Đánh dấu từ đã học
function markLearned() {
  if (currentType === "learning") {
    let currentVocab = learningVocab.splice(currentIndex, 1)[0];
    learnedVocab.push(currentVocab);
  } else if (currentType === "new") {
    let currentVocab = vocabList.splice(currentIndex, 1)[0];
    learnedVocab.push(currentVocab);
  }
  updateVocabularyLists();
  adjustIndexAndShowNext();
}

// Đánh dấu từ đang học
function markLearning() {
  if (currentType === "new") {
    let currentVocab = vocabList.splice(currentIndex, 1)[0];
    learningVocab.push(currentVocab);
    updateVocabularyLists();
    adjustIndexAndShowNext();
  }
}

// Điều chỉnh chỉ mục và hiển thị flashcard tiếp theo
function adjustIndexAndShowNext() {
  let flashcards = getFlashcardsByType(currentType);
  if (currentIndex >= flashcards.length) {
    currentIndex = flashcards.length - 1;
  }
  if (flashcards.length > 0) {
    showFlashcard();
  } else {
    goBack();
  }
}

// Xem danh sách từ đã học
function viewLearnedWords() {
  document.getElementById("main-page").style.display = "none";
  document.getElementById("learned-page").style.display = "block";

  let learnedList = document.getElementById("learned-list");
  learnedList.innerHTML = "";

  learnedVocab.forEach((item) => {
    let li = document.createElement("li");
    li.textContent = `${item.word}: ${item.meaning}`;
    learnedList.appendChild(li);
  });
}

// Quay lại giao diện chính
function goBack() {
  document.getElementById("main-page").style.display = "block";
  document.getElementById("flashcard-page").style.display = "none";
  document.getElementById("learned-page").style.display = "none";
  document.getElementById("matching-page").style.display = "none";
  document.getElementById("stats-page").style.display = "none";
}

// Bắt đầu trò chơi ghép nối
function startMatching() {
  document.getElementById("main-page").style.display = "none";
  document.getElementById("matching-page").style.display = "block";
  generateMatchingGame();
}

// Tạo trò chơi ghép nối
function generateMatchingGame() {
  let matchingContainer = document.getElementById("matching-container");
  matchingContainer.innerHTML = "";

  let allWords = [...learnedVocab];
  let shuffled = allWords.sort(() => Math.random() - 0.5);
  let words = shuffled.map((item) => ({ type: "word", text: item.word }));
  let meanings = shuffled.map((item) => ({
    type: "meaning",
    text: item.meaning,
  }));

  let items = [...words, ...meanings].sort(() => Math.random() - 0.5);
  let selectedItems = [];

  items.forEach((item) => {
    let div = document.createElement("div");
    div.className = "matching-item";
    div.textContent = item.text;
    div.dataset.type = item.type;
    div.dataset.text = item.text;

    div.addEventListener("click", () => {
      if (selectedItems.length < 2 && !div.classList.contains("selected")) {
        div.classList.add("selected");
        selectedItems.push(div);

        if (selectedItems.length === 2) {
          checkMatch(selectedItems);
        }
      }
    });

    matchingContainer.appendChild(div);
  });
}

// Kiểm tra kết quả ghép nối
function checkMatch(selectedItems) {
  let [first, second] = selectedItems;

  let firstText = first.dataset.text;
  let secondText = second.dataset.text;

  let match = false;
  for (let vocab of learnedVocab) {
    if (
      (firstText === vocab.word && secondText === vocab.meaning) ||
      (firstText === vocab.meaning && secondText === vocab.word)
    ) {
      match = true;
      break;
    }
  }

  if (match) {
    first.style.backgroundColor = "#4caf50";
    second.style.backgroundColor = "#4caf50";
    setTimeout(() => {
      first.style.visibility = "hidden";
      second.style.visibility = "hidden";
    }, 1000);
  } else {
    first.style.backgroundColor = "#ff5733";
    second.style.backgroundColor = "#ff5733";
    setTimeout(() => {
      first.classList.remove("selected");
      second.classList.remove("selected");
      first.style.backgroundColor = "#e0e0e0";
      second.style.backgroundColor = "#e0e0e0";
    }, 1000);
  }

  setTimeout(() => {
    selectedItems.length = 0;
  }, 1000);
}

// Đặt lại ứng dụng
function resetApplication() {
  if (confirm("Bạn có chắc muốn đặt lại toàn bộ dữ liệu không?")) {
    vocabList = [];
    learningVocab = [];
    learnedVocab = [];
    updateVocabularyLists();
    alert("Dữ liệu đã được đặt lại!");
  }
}

// Kết thúc trò chơi
function endGame() {
  alert("Kết thúc trò chơi! Bạn đã hoàn thành bài luyện tập.");
  goBack();
}
let progressChart; // Biến lưu biểu đồ toàn cục

// Hiển thị thống kê tiến độ học tập
function showStatistics() {
  document.getElementById("main-page").style.display = "none";
  document.getElementById("stats-page").style.display = "block";

  const ctx = document.getElementById("progressChart").getContext("2d");

  const data = {
    labels: ["Từ mới", "Đang học", "Đã học"],
    datasets: [
      {
        label: "Tiến độ học tập",
        data: [vocabList.length, learningVocab.length, learnedVocab.length],
        backgroundColor: ["#ff6384", "#36a2eb", "#4caf50"],
        hoverOffset: 4,
      },
    ],
  };

  // Nếu biểu đồ đã tồn tại, cập nhật dữ liệu thay vì tạo lại
  if (progressChart) {
    progressChart.data.datasets[0].data = [
      vocabList.length,
      learningVocab.length,
      learnedVocab.length,
    ];
    progressChart.update(); // Cập nhật biểu đồ
  } else {
    const config = {
      type: "pie",
      data: data,
      options: {
        responsive: true,
        plugins: {
          legend: {
            position: "top",
          },
          tooltip: {
            callbacks: {
              label: function (context) {
                return `${context.label}: ${context.raw} từ`;
              },
            },
          },
        },
      },
    };

    progressChart = new Chart(ctx, config); // Lưu biểu đồ vào biến toàn cục
  }
}

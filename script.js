
const API_KEY = process.env.MY_API_KEY
const submitButton = document.querySelector("#submit");
const answerCloudPtag = document.querySelector(".bubble-p");
const inputElement = document.querySelector(".input-question");
const magazineDiv = document.querySelector(".magazine-div");
const magazinePDFbutton = document.querySelector(".magazine-pdf-btn");

//Fetch
async function getMessage() {
  console.log("clicked");
  const options = {
    method: "POST",
    headers: {
      Authorization: `Bearer ${API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: inputElement.value }],
      max_tokens: 1000,
    }),
  };
  try {
    const response = await fetch(
      "https://api.openai.com/v1/chat/completions",
      options
    );
    const data = await response.json();
    console.log(data);
    answerCloudPtag.textContent = data.choices[0].message.content;
    if (data.choices[0].message.content) {
      const QandA = document.createElement("div");
      QandA.classList.add("q-and-a");

      const question = document.createElement("p");
      const answer = document.createElement("p");
      question.classList.add("q-a");
      answer.classList.add("q-a");
      question.contentEditable = true;
      answer.contentEditable = true;
      question.textContent = inputElement.value;
      answer.textContent = data.choices[0].message.content;

      const removeQA = document.createElement("span");
      removeQA.classList.add("remove-q-a");
      removeQA.textContent = "❌";
      removeQA.addEventListener("click", (e) =>
        e.target.parentElement.remove()
      );

      const backColorPicker = document.createElement("input");
      backColorPicker.type = "color";
      backColorPicker.classList.add("back-color-picker-q-a");
      backColorPicker.addEventListener(
        "change",
        (e) => (e.target.parentElement.style.backgroundColor = e.target.value)
      );

      const colorPicker = document.createElement("input");
      colorPicker.type = "color";
      colorPicker.classList.add("color-picker-q-a");
      colorPicker.addEventListener(
        "change",
        (e) => (e.target.parentElement.style.color = e.target.value)
      );

      const borderRemove = document.createElement("span");
      borderRemove.classList.add("border-remove-q-a");
      borderRemove.textContent = "📍";
      borderRemove.addEventListener("click", (e) =>
        e.target.parentElement.style.border == "none"
          ? (e.target.parentElement.style.border = "2px solid black")
          : (e.target.parentElement.style.border = "none")
      );

      const resetQA = document.createElement("span");
      resetQA.classList.add("reset-q-a");
      resetQA.textContent = "🔄";
      resetQA.addEventListener("click", (e) => {
        e.target.parentElement.style.backgroundColor = "rgb(120, 60, 60)";
        e.target.parentElement.style.border = "2px solid black";
        e.target.parentElement.style.color = "aliceblue";
      });

      QandA.append(
        removeQA,
        resetQA,
        backColorPicker,
        borderRemove,
        colorPicker,
        question,
        answer
      );

      magazineDiv.append(QandA);
    }
  } catch (error) {
    console.log(error);
  }
}

submitButton.addEventListener("click", () => {
  inputElement.value == ""
    ? (answerCloudPtag.textContent =
        "You must ask me question or tell me something. I can't tell you anything if you don't ask me anything 😒")
    : getMessage();
});

//Print PDF
window.onload = function () {
  magazinePDFbutton.addEventListener("click", () => {
    const stampa = this.document.querySelector(".magazine-div");
    let opt = {
      margin: 1,
      backgroundColor: "red",
      filename: "Magazine.pdf",
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: "in", format: "letter", orientation: "portrait" },
    };
    if (magazineDiv.childNodes.length == 0) {
      answerCloudPtag.textContent =
        "You can't print empty script. Ask me something to fill your script. 😎";
    } else {
      html2pdf().from(stampa).set(opt).save();
    }
  });
};

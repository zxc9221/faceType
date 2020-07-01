import "./desqus.js";
(() => {
  const gender = document.querySelector(".gender"),
    form = document.querySelector(".form-container form"),
    file = document.querySelector(".file-upload"),
    loadingWrapper = document.querySelector(".loading-wrapper"),
    imageContainer = document.querySelector(".image-container"),
    image = document.querySelector(".image-container .uploaded-image"),
    resultContainer = document.querySelector(".result-container");
  const URL = "https://teachablemachine.withgoogle.com/models/dHp8p6nGI/";
  //"https://teachablemachine.withgoogle.com/models/Y-Co67h1I/",
  //"https://teachablemachine.withgoogle.com/models/loodq_8rz/",

  let isMale = true,
    model,
    maxPredictions,
    resultObj = {};
  const types = {
    egg: {
      type: "계란 얼굴형",
      typeImage: "./assets/image/egg.png",
      content:
        "얼굴의 균형이 잡혀있으며, 적당하게 하고싶은 말을 하고 참을 수 있는 그런 균형을 가지고 있어 기본적인 성향이 남에게 잘 맞춰주고 협조성이 뛰어나 조직에서도 잘 어울이는 사림이다.\n 조화를 중요시하다 보니 개성적인 면이 없어 주변에 묻일 가능성도 있습나다.\n 보통 계란형 얼굴은 미남미녀가 많고 성격이 안정되어 있는 느낌이 있습니다.",
      male: {
        hair:
          "어떤 헤어 스타일이 잘 소화할수 있는 타입이지만 앞머리를 내리거나 너무 컬이 많이 들어간 헤어는 인상을 더 부드럽게해 남자다워 보이지 않을 수 있습니다. 이마가 넓으면 가르마 형태를 만들면 주시면 좋습니다.",
        recommend: ["웬만하면 다 어울림...부럽"],
      },
      female: {
        hair:
          "얼굴 전체가 갸름하면서도 턱주위가 가늘어서 둥근 형태의 타원형 얼굴로, 갸름한 얼굴형을 잘보여줄수 있는 포니테일 스타일이나, 컬이 들어간 레이어드 S컬펌으로 끝을 가볍게 표현해주면 더욱 이쁘게 보일수 있습니다. 이마를 가리는 무거운 느낌의 뱅은 답답한 느낌을 줄수있기에 피하는게 좋습니다",
        recommend: ["웬만하면 다 어울립니다..."],
      },
    },
    long: {
      type: "긴 얼굴형",
      typeImage: "./assets/image/long.png",
      content:
        "상대방에게 좋은 이미지를 심어주는 얼굴형은 아니기때문에 상대방이 느끼기에는 이기적이고, 독단적인 사람이라고 평하기 쉬어 초면에 상대방과 쉽게 친해지기 어려움\n 다른 얼굴형에 비해 의욕감이 강하고 독립심이 강해 어떤 일을 행함에 있어 끝까지 혼자힘으로 밀어붙이는 경우도 있어 그만큼 자신감 있다는것으로 받아들이면 됨.",
      male: {
        hair:
          "얼굴 세로길이가 가로보다 길며 이마, 광대뼈, 턱 굴곡이 거의 없이 일자로 떨어지는것이 특징으로 앞머리를 내려 얼굴 면적을 작게해주고 옆으로 넓어 보이는 헤어스타일을 추천헙니다.",
        recommend: [
          "소프트 투 블록",
          "볼륨펌",
          "이마가 살짝 보이는 애즈 펌",
          "쉐도우 펌",
        ],
      },
      female: {
        hair:
          "얼굴 넓이에 있어 이미나 볼, 그리고 턱선에서 거의 변화가 없는 좁은 형태로 세련되고 샤프해 보일 수 있지만 인상이 강하고 날카로워 보이기 쉬운 얼굴로 수평적으로 넓게 보이도록 만들어 주기 위해 볼륨이 필요합니다.\n앞머리를 내어 얼굴 길이를 작게해주고 웨이브 볼륨펌 형태의 헤어스타일이 이상적입니다.",
        recommend: ["미디엄~롱기장의 루즈한 S컬펌", "시스루뱅"],
      },
    },
    circle: {
      typeImage: "./assets/image/circle.png",
      content:
        "얼굴형이 둥근것 처럼 둥글둥글 시원한 성격을 가지고 띠고 있다. 처음 사람을 마주 했을때 가장 먼저 눈에 들어오는 부분은 얼굴입니다. 초면에 상대방에게 호의적으로 보였다면 그 사람에게 쉽게 다가가고 어울릴 수 있을 것입니다.",
      male: {
        hair:
          "가로와 세로의 길이가 비슷하고 얼굴선이 부드럽고 각이 없는것이 특징으로 헤어에 각을 살려주거나 얼굴을 조금 길어보이게 하면 턱선을 살려줘 선명한 인상을 줄수 있다. 양 옆의 헤어는 짧게 하고 볼륨을 주어 길어 보이게 하면 좋습니다.",
        recommend: ["리젠트 펌", "가르마 펌", "스핀 스왈로펌"],
      },
      female: {
        hair:
          "둥글둥글한 턱선이 특징으로 얼굴의 넓이와 길이가 거의 비슷해 발랄하고 귀여운 느낌을 줘서 나이에 비해 어려보이지만 볼에 살이 있어 보여 통통해보이기 쉽습니다.\n 얼굴을 최대한 길어보이도록 라기 위해 자연스럽게 떨어지는 라인 스타일이 좋으며 앞머리를 내는 것보다 이마를 드러내는것이 더 어울립니다",
        recommend: ["레이어드 C컬펌", "포니테일", "뿌리 볼륨펌"],
      },
    },
    "inverted-triangle": {
      type: "역삼각형",
      typeImage: "./assets/image/inverted.png",
      content:
        "진지함과 성실함, 잔꾀를 부릴 줄 모르는 우직함을 상대방에게 강한 인상을 심어줄 수 있습니다. 강한 인상이란 자신감에서 비롯되는 행동으로 주변 사람들에게는 믿음이 통하는 자신으로 비춰질수 있습니다.",
      male: {
        hair:
          "턱은 뾰족하고 광대와 이마로 갈수록 넓어지는 것이 특징으로 날카로워 보일수 있어 부르러운 실루엣과 풍성한 볼륨을 주어 부드러운 인상을 주는것이 좋음. 윗머리를 풍성한 볼륨을 주어 옆면의 얼굴형을 머리의 볼륨을 통해 가로로 늘려 시선 분산하는것이 좋습니다.",
        recommend: ["가일 컷", "크롭컷", "가르마 펌", "투 블록"],
      },
      female: {
        hair:
          "이미가 넓고 턱이 뾰족해 이지적이면서 시크한 인상을 주지만 자칫하면 날카롭고 차가운 인상을 줄 수 있으며 넓은 이마에 비해 아래쪽으로 갈수록 좁아지기 때문에 턱 부위를 넓게 보이도록 해주는 헤어스타일이 적절합니다",
        recommend: ["똥머리", "포니테일", "턱선에서 어깨 길이에 뱅 스타일"],
      },
    },
    angled: {
      type: "각진 얼굴형",
      typeImage: "./assets/image/angled.png",
      content:
        "이마와 턱이 날카롭게 각이 져있어 얼굴에 감정이 잘 드러나는 편입니다. 안정적이고, 똑똑하며 논리적으로 생각하는 성격을 가지고있지만 별로 사교적이지 않다는 인상을 상대방에 줄수 있지만 알면 알수록 아주 흥미로운 사람입니다.",
      male: {
        hair:
          "남성적인 이미지를 갖고 있어 정갈한 포마드 스타일로 장점을 부각하면 매력적이지만 자칫하면 공격적이거나 투박해보일수 있으며 다가가기 어려운 이미지가 될 수 있기 때문에 부드러운 인상을 주기 위해 부드러운 펌을 해주는것이 좋습니다.",
        recommend: ["소프트 투블록", "가르마 펌", "리젠트 펌"],
      },
      female: {
        hair:
          "자칫 고집스럽고 강렬한 인상을 줄 수 있지만 세련된 멋을 줄수 있습니다. 머리 위쪽에 불륨을 넣어 부드러운 곡선의 헤어, 안쪽으로 말려들어가는 스타일이나, S컬 웨이브 펌이 잘 어울립니다.",
        recommend: ["보브 헤어 스타일", "굵은 웨이브가 들어간 롱헤어 스타일"],
      },
    },
  };
  const showItems = (result) => {
    const title = resultContainer.querySelector(".result-title"),
      content = resultContainer.querySelector(".result-content p"),
      hair = resultContainer.querySelector(".result-hair p"),
      image = resultContainer.querySelector(".type-image"),
      recommend = resultContainer.querySelector(".recommend");
    if (result.title !== undefined) {
      title.textContent = `당신의 얼굴은 ${result.title} 입니다`;
      content.textContent = `${result.content}`;
      hair.textContent = isMale
        ? `${result.male.hair}`
        : `${result.female.hair}`;
      image.src = `${result.typeImage}`;
      image.alt = `${result.type}`;
      recommend.textContent = `추천 스타일: ${(isMale
        ? result.male.recommend
        : result.female.recommend
      ).join(",")}`;
    } else {
      title.textContent = `알수없음`;
      resultContainer.querySelector(".result-hair h3").textContent = "";
      resultContainer.querySelector(".result-content h3").textContent = "";
    }
  };
  //분석 결과 출력
  const showResult = () => {
    let result = [],
      maxValue = 0;
    Object.keys(resultObj).forEach((item) => {
      if (maxValue < resultObj[item]) {
        maxValue = resultObj[item];
        result = [item, resultObj[item]];
      }
    });
    resultContainer.classList.remove("hide");
    resultContainer.classList.add("show");

    showItems(types[result[0]]);
    /*if (types[result[0]].type !== undefined) {
      title.textContent = `당신의 얼굴은 ${types[result[0]].type} 입니다`;
      content.textContent = `${types[result[0]].content}`;
      hair.textContent = isMale
        ? `${types[result[0]].male.hair}`
        : `${types[result[0]].female.hair}`;
      image.src = `${types[result[0]].typeImage}`;
      image.alt = `${types[result[0]].type}`;
      recommend.textContent = `추천 스타일: ${(isMale
        ? types[result[0]].male.recommend
        : types[result[0]].female.recommend
      ).join(",")}`;
    }*/
  };
  const selectGender = (e) => {
    const { target } = e,
      male = document.querySelector("#male"),
      female = document.querySelector("#female");
    if (target.id === "male") {
      isMale = true;
      if (!target.classList.contains("selected")) {
        male.classList.add("selected");
        female.classList.remove("selected");
      }
    } else {
      isMale = false;
      if (!target.classList.contains("selected")) {
        male.classList.remove("selected");
        female.classList.add("selected");
      }
    }
  };
  // Load the image model and setup the webcam
  const init = async () => {
    const modelURL = URL + "model.json";
    const metadataURL = URL + "metadata.json";
    // load the model and metadata
    // Refer to tmImage.loadFromFiles() in the API to support files from a file picker
    // or files from your local hard drive
    // Note: the pose library adds "tmImage" object to your window (window.tmImage)
    model = await tmImage.load(modelURL, metadataURL);
    maxPredictions = model.getTotalClasses();

    await predict();
  };
  // run the webcam image through the image model
  const predict = async () => {
    // predict can take in an image, video or canvas html element
    const prediction = await model.predict(image, false); //predict(webcam.canvas);
    for (let i = 0; i < maxPredictions; i++) {
      resultObj[prediction[i].className] = prediction[i].probability.toFixed(2);
    }
    loadingWrapper.classList.remove("show");
    loadingWrapper.classList.add("hide");
    showResult();
  };

  //사진 업로드시 분석 행,
  const onChange = (e) => {
    const {
      target: { files },
    } = e;
    const reader = new FileReader();
    reader.readAsDataURL(files[0]);
    loadingWrapper.classList.add("show");
    loadingWrapper.classList.remove("hide");
    if (imageContainer.classList.contains("hide")) {
      imageContainer.classList.add("show");
      imageContainer.classList.remove("hide");
      reader.onload = () => {
        image.src = reader.result;
        init(); //male
      };
    } else {
      imageContainer.classList.add("hide");
      imageContainer.classList.remove("show");
      image.src = "";
    }
    form.classList.toggle("hide");
  };
  file.addEventListener("change", onChange);
  gender.addEventListener("click", selectGender);
})();

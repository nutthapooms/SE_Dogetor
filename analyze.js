var pet = new Vue({
    el: '#petinfo',
    data: {
      petval: '',
      breedval: '',
      gendval: '',
      petinfo: {
        name: '',
        age: '',
        breed: '',
        gend: ''
      },
      gendall: [
        'Dog (male)',
        'Bitch (female)'
      ],
      breedall: [
        'Husky',
        'Labrador',
        'Golden'
      ],
      petinfoall: [
        { name: 'Husky',
          age: '2 years',
          breed: 'Husky',
          gend: 'Dog (male)' } ,
        { name: 'The Rock',
          age: '10 years',
          breed: 'Golden',
          gend: 'Dog (male)' } ,
        { name: 'Trump',
          age: '3 months',
          breed: 'Labrador',
          gend: 'Bitch (female)' } ,
      ]
    },
    methods: {
      changePetInfo : function(){
        this.petinfo = this.petinfoall[this.petval-1];
        this.breedval = this.breedall.indexOf(this.petinfo.breed);
        this.gendval = this.gendall.indexOf(this.petinfo.gend);
      },
      changeBreed: function(){
        this.petinfo.breed = this.breedall[this.breedval-1];
      },
      changeGender: function(){
        this.petinfo.gend = this.gendall[this.gendval-1];
        //document.getElementById('gender').options[this.gendval].text;
      }
    } 
})

var symptom = new Vue({
  el: '#symptom',
  data: {
    typeval : '',
    typename : '',
    symplist: [
    ],
    sympdet: { 
      name: '',
      detail: '',
      pic1: '',
      pic2: ''
    },
    sympsummary: [
    ],
    sympresult: [
    ],
    diseaseall: [
      { name: 'พยาธิตัวตืด',
        symplist: ['ถ่ายเหลว', 'ผอมเกินควร', 'ท้องมาน'],
        prob: 0,
      },
      { name: 'ลมแดด',
        symplist: ['เหงือกแดง', 'ปัสสาวะน้อย', 'หอบ', 'ช็อก', 'อาเจียนเลือด', 'ชัก', 'กล้ามเนื้อกระตุก', 'กล้ามเนื้ออ่อนแรง', 'เดินไม่ตรง', 'อุณภูมิสูง'],
        prob: 0,
      },
      { name: 'ต้อหิน',
        symplist: ['ตาขุ่นมัว'],
        prob: 0,
      },
      { name: 'ไตวาย',
        symplist: ['ปัสสาวะมาก'],
        prob: 0,
      },
      { name: 'คุชชิ่ง',
        symplist: ['ขนร่วง', 'มีไขมันคอไหล่', 'ปัสสาวะมาก', 'กล้ามเนื้ออ่อนแรง'],
        prob: 0,
      },
      { name: 'ท้องเสีย',
        symplist: ['ถ่ายเหลว', 'อาเจียนอาหาร', 'เบื่ออาหาร', 'ซึม'],
        prob: 0,
      },
      { name: 'พิษสุนัขบ้า',
        symplist: ['ลิ้นห้อย', 'อยู่ไม่นิ่ง'],
        prob: 0,
      },
      { name: 'ภาวะหลอดอาหารขยายใหญ่',
        symplist: ['มีน้ำมูก', 'อาเจียนอาหาร', 'ไอ'],
        prob: 0,
      }
    ],
    typenameall : [
      'ส่วนผิวหนัง',
      'ส่วนใบหน้าและศรีษะ',
      'การขับถ่ายและทางเดินอาหาร',
      'การหายใจ',
      'อื่นๆ'
    ],
    symplistall: [
      // Type 1
      [ { name: 'ขนร่วง',
          detail: 'ขนร่วงตามตัวแบบสมมาตร ผิวหนังสีเข้ม มีการติดเชื้อที่ผิวหนังซ้ำซ้อน',
          pic1: 'doge0.jpg',
          pic2: 'doge0.jpg',
          check: false } ],
      // Type 2
      [ { name: 'เหงือกแดง',
          detail: 'เหงือกมีลักษณะแดงก่ำ',
          pic1: 'doge1.jpg',
          pic2: 'doge1.jpg',
          check: false },
        { name: 'ตาขุ่นมัว',
          detail: 'กระพริบตา ลูกตาจมไปในเบ้าตา เห็นเส้นเลือดสีแดงบริเวณตาขาว ด้านหน้าตวงตาขุ่น ม่านตาขยาย ไม่ตอบสนองต่อแสง',
          pic1: 'jhin.jpg',
          pic2: 'jhin.jpg',
          check: false },
        { name: 'มีไขมันคอไหล่',
          detail: 'พบก้อนไขมันตามคอไหล่',
          pic1: 'doge0.jpg',
          pic2: 'doge0.jpg',
          check: false },
        { name: 'ลิ้นห้อย',
          detail: 'อ้าปากตลอดเวลา ลิ้นห้อย',
          pic1: 'doge3.jpg',
          pic2: 'doge3.jpg',
          check: false },
        { name: 'มีน้ำมูก',
          detail: 'มีน้ำมูกไหล จมูกชื้น',
          pic1: 'doge2.jpg',
          pic2: 'doge2.jpg',
          check: false } ],
      // Type 3
      [ { name: 'ถ่ายเหลว',
          detail: 'อุจจาระเหลวมากขึ้นกว่าปกติ',
          pic1: 'doge1.jpg',
          pic2: 'doge1.jpg',
          check: false },
        { name: 'ปัสสาวะน้อย',
          detail: 'ปัสสาวะน้อยกว่าที่ควรเป็น',
          pic1: 'doge2.jpg',
          pic2: 'doge2.jpg',
          check: false },
        { name: 'ปัสสาวะมาก',
          detail: 'ปัสสาวะในปริมาณมากกว่าที่ควรเป็น',
          pic1: 'doge0.jpg',
          pic2: 'doge0.jpg',
          check: false },
        { name: 'อาเจียนอาหาร',
          detail: 'อาเจียนเป็นอาหารที่รับประทานเข้าไป มีการขย่อนอาหารออกมา',
          pic1: 'doge4.jpg',
          pic2: 'doge4.jpg',
          check: false },
        { name: 'อาเจียนเลือด',
          detail: 'อาเจียนเป็นเลือด',
          pic1: 'doge1.jpg',
          pic2: 'doge1.jpg',
          check: false },
        { name: 'เบื่ออาหาร',
          detail: 'รับประทานอาหารน้อยกว่าปกติ หรือไม่รับประทานเลย',
          pic1: 'doge3.jpg',
          pic2: 'doge3.jpg',
          check: false },
        { name: 'ผอมเกินควร',
          detail: 'กินมากขึ้นแต่ผอมกว่าที่ควรจะเป็น',
          pic1: 'jhin.jpg',
          pic2: 'jhin.jpg',
          check: false },
        { name: 'ท้องมาน',
          detail: 'ท้องบวมป่องผิดปกติ เหมือนมีน้ำอยู่ภายในช่องท้อง',
          pic1: 'doge1.jpg',
          pic2: 'doge1.jpg',
          check: false },
        { name: 'กระหายน้ำผิดปกติ',
          detail: 'กินน้ำมาก ฉี่มาก กินเก่ง',
          pic1: 'doge4.jpg',
          pic2: 'doge4.jpg',
          check: false } ],
      // Type 4
      [ { name: 'หอบ',
          detail: 'หายใจหอบผิดปกติ',
          pic1: 'jhin.jpg',
          pic2: 'jhin.jpg',
          check: false } ],
      // Type 5
      [ { name: 'ช็อก',
          detail: 'อ่อนแรงอย่างรุนแรง เท้าเย็น ชีพจรเบาฟังได้ยาก ความดันเลือดต่ำมาก ไม่มีแรงและไม่กระตือรือร้น หายใจหอบถึงขั้นระบบหายใจล้มเหลว เลือดออก',
          pic1: 'jhin.jpg',
          pic2: 'jhin.jpg',
          check: false },
        { name: 'ชัก',
          detail: 'สูญเสียการควบคุมร่างกาย กล้ามเนื้อกระตุก ขับถ่ายโดยไม่ได้ตั้งใจ มึนงง อาเจียน เดินไปอย่างไร้จุดมุ่งหมาย',
          pic1: 'doge0.jpg',
          pic2: 'doge0.jpg',
          check: false },
        { name: 'ซึม',
          detail: 'ไม่สดใสร่าเริง ดูไม่ค่อยมีเรี่ยวแรง ไม่ค่อยตอบสนอง',
          pic1: 'doge2.jpg',
          pic2: 'doge2.jpg',
          check: false },
        { name: 'ไอ',
          detail: 'มีอาการไอคล้ายมนุษย์',
          pic1: 'doge0.jpg',
          pic2: 'doge0.jpg',
          check: false },
        { name: 'กล้ามเนื้อกระตุก',
          detail: 'กล้ามเนื้อกระตุกผิดสังเกต ไม่สามารถควบคุมได้',
          pic1: 'doge1.jpg',
          pic2: 'doge1.jpg',
          check: false },
        { name: 'กล้ามเนื้ออ่อนแรง',
          detail: 'ดูไม่มีแรง การขยับไม่เป็นธรรมชาติ',
          pic1: 'doge0.jpg',
          pic2: 'doge0.jpg',
          check: false },
        { name: 'อยู่ไม่นิ่ง',
          detail: 'ลุกนั่งเดินไปมาบ่อยครั้ง',
          pic1: 'doge2.jpg',
          pic2: 'doge2.jpg',
          check: false },
        { name: 'เดินไม่ตรง',
          detail: 'เดินเบี้ยวไปมาบ่อยครั้ง',
          pic1: 'jhin.jpg',
          pic2: 'jhin.jpg',
          check: false },
        { name: 'อุณภูมิสูง',
          detail: 'อุณหภูมิสูงกว่า 39 องศาเซลเซียส',
          pic1: 'doge2.jpg',
          pic2: 'doge2.jpg',
          check: false } ],
    ]
  },
  methods: {
    changeSymptomType: function(){
      this.typename = this.typenameall[this.typeval-1];
      this.symplist = this.symplistall[this.typeval-1];
    },
    showSymptomInfo: function(symp){
      this.sympdet = symp;
    }
    // hideSymptomInfo: function(){
    //   this.sympdet[0].name = '';
    //   this.sympdet[0].pic = '';
    //   this.sympdet[0].detail = '';
    // }
  }
})

function summaryResult() {
  // Check data
  if(pet.$data.petinfo.name == '' || pet.$data.petinfo.age == '' || pet.$data.petinfo.breed == '' || pet.$data.petinfo.gend == ''){
    alert("Please fill in all information.");
  }
  else{
    //alert(pet.$data.petinfo.name);
    // Get checked symptom
    symptom.$data.sympsummary = [];
    symptom.$data.sympresult = [];
    for (i in symptom.$data.symplistall){
      for (j in symptom.$data.symplistall[i]){
        if(symptom.$data.symplistall[i][j].check == true){
          symptom.$data.sympsummary.push(symptom.$data.symplistall[i][j].name);
          for (k in symptom.$data.diseaseall){    
            var index = symptom.$data.diseaseall[k].symplist.indexOf(symptom.$data.symplistall[i][j].name);
            if(index != -1){
              symptom.$data.diseaseall[k].prob++;
            }
          }
        }
      }
    }
    // Analyze symptom
    for (i in symptom.$data.diseaseall){
      var prob = symptom.$data.diseaseall[i].prob / symptom.$data.diseaseall[i].symplist.length;
      if(prob > 0.5){
        symptom.$data.sympresult.push(symptom.$data.diseaseall[i].name);
      }
      symptom.$data.diseaseall[i].prob = 0;
    }
  }
}
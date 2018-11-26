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
        'male',
        
        'female'
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
          detail: 'ขนร่วงตามตัวแบบสมมาตร ผิวหนังสีเข้ม มีการติดเชื้อที่ผิวหนัง',
          pic1: '/static/Disease/fur_fall1.jpg',
          pic2: '/static/Disease/fur_fall2.jpg',
          check: false } ],
      // Type 2
      [ { name: 'เหงือกแดง',
          detail: 'เหงือกมีลักษณะแดงก่ำ คล้ายเลือดออก',
          pic1: '/static/Disease/red_gum1.jpg',
          pic2: '/static/Disease/red_gum2.jpg',
          check: false },
        { name: 'ตาขุ่นมัว',
          detail: 'ลูกตาจมไปในเบ้าตา เห็นเส้นเลือดสีแดงบริเวณตาขาว ด้านหน้าตวงตาขุ่น ม่านตาขยาย ไม่ตอบสนองต่อแสง',
          pic1: '/static/Disease/glaucoma1.jpg',
          pic2: '/static/Disease/glaucoma2.jpg',
          check: false },
        { name: 'มีไขมันคอไหล่',
          detail: 'พบก้อนไขมันตามคอและไหล่ ลักษณะเป็นลูกๆ',
          pic1: '/static/Disease/lump1.jpg',
          pic2: '/static/Disease/lump2.jpg',
          check: false },
        { name: 'ลิ้นห้อย',
          detail: 'อ้าปากตลอดเวลา ลิ้นห้อย',
          pic1: '/static/Disease/hang_tongue1.jpg',
          pic2: '/static/Disease/hang_tongue2.jpg',
          check: false },
        { name: 'มีน้ำมูก',
          detail: 'มีน้ำมูกไหล จมูกเปียกกว่าปกติ',
          pic1: '/static/Disease/snot1.jpg',
          pic2: '/static/Disease/snot2.jpg',
          check: false } ],
      // Type 3
      [ { name: 'ถ่ายเหลว',
          detail: 'อุจจาระเหลวคล้ายน้ำ ไม่เป็นก้อน',
          pic1: '/static/Disease/diarrhea1.jpg',
          pic2: '/static/Disease/diarrhea2.jpg',
          check: false },
        { name: 'ปัสสาวะน้อย',
          detail: 'ปัสสาวะน้อยกว่าที่ควรเป็น ปัสสาวะไม่ออก หรือไม่ค่อยปัสสาวะ',
          pic1: '/static/Disease/less_pee1.jpg',
          pic2: '/static/Disease/less_pee2.jpg',
          check: false },
        { name: 'ปัสสาวะมาก',
          detail: 'ปัสสาวะในปริมาณมาก หรือปัสสาวะบ่อยครั้ง',
          pic1: '/static/Disease/more_pee1.jpg',
          pic2: '/static/Disease/more_pee2.jpg',
          check: false },
        { name: 'อาเจียนอาหาร',
          detail: 'อาเจียนอาหารที่รับประทานเข้าไป หรือมีการขย่อนอาหารออกมา',
          pic1: '/static/Disease/vomit1.jpg',
          pic2: '/static/Disease/vomit2.jpg',
          check: false },
        { name: 'อาเจียนเลือด',
          detail: 'อาเจียนเลือดออกทางปาก',
          pic1: '/static/Disease/blood1.jpg',
          pic2: '/static/Disease/blood2.jpg',
          check: false },
        { name: 'เบื่ออาหาร',
          detail: 'รับประทานอาหารน้อยหรือไม่รับประทานเลย',
          pic1: '/static/Disease/bored_food1.jpg',
          pic2: '/static/Disease/bored_food2.jpg',
          check: false },
        { name: 'ผอมเกินควร',
          detail: 'กินมากขึ้น แต่ผอมกว่าที่ควรจะเป็น',
          pic1: '/static/Disease/thin1.jpg',
          pic2: '/static/Disease/thin2.jpg',
          check: false },
        { name: 'ท้องมาน',
          detail: 'ท้องบวมป่องเหมือนมีน้ำอยู่ภายในช่องท้อง',
          pic1: '/static/Disease/dropsy1.jpg',
          pic2: '/static/Disease/dropsy2.jpg',
          check: false },
        { name: 'กระหายน้ำผิดปกติ',
          detail: 'กินน้ำมากหรือกินบ่อย กินเก่ง',
          pic1: '/static/Disease/thirsty1.jpg',
          pic2: '/static/Disease/thirsty2.jpg',
          check: false } ],
      // Type 4
      [ { name: 'หอบ',
          detail: 'หายใจหอบผิดปกติ ดูหายใจติดขัด',
          pic1: '/static/Disease/gasp1.jpg',
          pic2: '/static/Disease/gasp2.jpg',
          check: false } ],
      // Type 5
      [ { name: 'ช็อค',
          detail: 'อ่อนแรงอย่างรุนแรง เท้าเย็น ชีพจรเบาฟังยาก ความดันเลือดต่ำมาก ไม่มีแรงและไม่กระตือรือร้น หายใจหอบ มีเลือดออก บางตัวอาจสลบอย่างกระทันหัน',
          pic1: '/static/Disease/shock1.jpg',
          pic2: '/static/Disease/shock2.jpg',
          check: false },
        { name: 'ชัก',
          detail: 'สูญเสียการควบคุมร่างกาย ไม่สามารถควบคุมการขับถ่าย มึนงง เดินไปอย่างไร้จุดมุ่งหมาย',
          pic1: '/static/Disease/twitch1.jpg',
          pic2: '/static/Disease/twitch2.jpg',
          check: false },
        { name: 'ซึม',
          detail: 'ไม่สดใสร่าเริง ดูไม่มีเรี่ยวแรง ไม่ค่อยตอบสนอง',
          pic1: '/static/Disease/depress1.jpg',
          pic2: '/static/Disease/depress2.jpg',
          check: false },
        { name: 'ไอ',
          detail: 'มีอาการไอคล้ายมนุษย์',
          pic1: '/static/Disease/cough1.jpg',
          pic2: '/static/Disease/cough2.jpg',
          check: false },
        { name: 'กล้ามเนื้อกระตุก',
          detail: 'กล้ามเนื้อกระตุก ไม่สามารถควบคุมได้',
          pic1: '/static/Disease/jerky1.jpg',
          pic2: '/static/Disease/jerky2.jpg',
          check: false },
        { name: 'กล้ามเนื้ออ่อนแรง',
          detail: 'ดูไม่มีเรี่ยวแรง เชื่องช้า ขยับไม่เป็นธรรมชาติ',
          pic1: '/static/Disease/weak1.jpg',
          pic2: '/static/Disease/weak2.jpg',
          check: false },
        { name: 'อยู่ไม่นิ่ง',
          detail: 'ลุก นั่ง หรือเดินไปมาบ่อยครั้ง',
          pic1: '/static/Disease/not_still1.jpg',
          pic2: '/static/Disease/not_still2.jpg',
          check: false },
        { name: 'เดินไม่ตรง',
          detail: 'เดินเบี้ยวหรือเซไปมา',
          pic1: '/static/Disease/walk1.jpg',
          pic2: '/static/Disease/walk2.jpg',
          check: false },
        { name: 'อุณภูมิสูง',
          detail: 'อุณหภูมิสูงกว่า 39 องศาเซลเซียส',
          pic1: '/static/Disease/high_tem1.jpg',
          pic2: '/static/Disease/high_tem2.jpg',
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
    },
    summaryResult: function(){
      // Get checked symptom
      for (i in this.symplistall){
        for (j in this.symplistall[i]){
          if(this.symplistall[i][j].check == true){
            this.sympsummary.push(this.symplistall[i][j].name);
            for (k in this.diseaseall){    
              var index = this.diseaseall[k].symplist.indexOf(this.symplistall[i][j].name);
              if(index != -1){
                this.diseaseall[k].prob++;
              }
            }
          }
        }
      }
      // Analyze symptom
      for (i in this.diseaseall){
        var prob = this.diseaseall[i].prob /= this.diseaseall[i].symplist.length;
        if(prob > 0.5){
          this.sympresult.push(this.diseaseall[i].name);
        }
      }

      

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
  pet.$data.petinfo.name = document.getElementById("name").value
  pet.$data.petinfo.age = document.getElementById("age").value
  pet.$data.petinfo.breed = document.getElementById("breed").value
  pet.$data.petinfo.gend = document.getElementById("gender").value
    
  
  
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
    if(symptom.$data.sympsummary.length == 0){
      alert("Please select at least one disease.");
      return;
    }
    // Analyze symptom
    for (i in symptom.$data.diseaseall){
      var prob = symptom.$data.diseaseall[i].prob / symptom.$data.diseaseall[i].symplist.length;
      if(prob > 0.5){
        symptom.$data.sympresult.push(symptom.$data.diseaseall[i].name);
      }
      symptom.$data.diseaseall[i].prob = 0;
    }
    if(symptom.$data.sympresult.length == 0){
      symptom.$data.sympresult[0] = '';
    }
    $.ajax({
      url:'/ananymous2',
      type:"POST",      
      data: {info:pet.$data.petinfo,result:symptom.$data.sympresult,sym:symptom.$data.sympsummary},
      success:function(result){
          document.open();
          document.write(result);
          document.close();
      }
  })
  
}
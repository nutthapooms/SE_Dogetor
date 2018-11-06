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
      pic: '',
      detail: ''
    },
    typenameall : [
        'ผิวหนัง',
        'ใบหน้า',
        'หู',
        'การขับถ่าย',
        'อื่นๆ' 
    ],
    symplistall: [
      // Type 1
      [ { name: 'คุชชิ่ง',
          detail: 'ขนร่วงตามตัวแบบสมมาตร ผิวหนังสีเข้ม มีการติดเชื้อที่ผิวหนังซ้ำซ้อน	พบก้อนไขมันตามคอไหล่										กินน้ำมาก ฉี่มาก หิวและกินเก่ง หอบหายใจเร็ว พุงย้อยอ้วน นอนไม่หลับ กล้ามเนื้ออ่อนแรง ตัวผู้ลูกอัณฑะหด',
          pic: 'doge0.jpg',
          check: false }],
      // Type 2
      [ { name: 'ต้อหิน',
          detail: 'กระพริบตา ลูกตาจมไปในเบ้าตา เห็นเส้นเลือดสีแดงบริเวณตาขาว ด้านหน้าตวงตาขุ่น ม่านตาขยาย ไม่ตอบสนองต่อแสง',
          pic: 'doge3.jpg',
          check: false }],
      // Type 3
      [ { name: 'พยาธิตัวตืด',
          detail: 'อุจจาระเหลวมากขึ้น กินมากขึ้นแต่ผอม ท้องมาน',
          pic: 'jhin.jpg',
          check: false },
        { name: 'ท้องเสีย',
          detail: 'ถ่ายเหลว อาเจียน เบื่ออาหาร น้ำหนักลด ซึม',
          pic: 'doge4.jpg', 
          check: false },
        { name: 'ภาวะหลอดอาหารขยายใหญ่ในสุนัข',
          detail: 'มีน้ำมูก	ขาก/ขย่อนอาหาร อาเจียน ไอ น้ำหนักลดลง',
          pic: 'doge4.jpg', 
          check: false } ],
      // Type 4
      [ { name: 'ไตวาย',
          detail: 'ปัสสาวะในปริมาณมาก ซึม เบื่ออาหาร อาเจียน ท้องเสีย',
          pic: 'jhin.jpg',
          check: false } ],
      // Type 5
      [ { name: 'ลมแดด',
          detail: 'เหงือกแดงก่ำ ปัสสาวะน้อย หอบหายใจ ช็อก อาเจียนเป็นเลิอด ชักกล้ามเนื้อกระตุก เดินไม่ตรง อุณหภูมิสูงกว่า 39 องศา',
          pic: 'jhin.jpg',
          check: false },
        { name: 'พิษสุนัขบ้า',
          detail: 'อ้าปากตลอดเวลา ลิ้นห้อย ลุกนั่งเดินไปมาบ่อยครั้ง',
          pic: 'jhin.jpg',
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

  

  
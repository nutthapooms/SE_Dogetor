var pet = new Vue({
    el: '#petinfo',
    data: {
        name: '',
        age: '',
        breed: '',
        gend: ''
    },
    methods: {
    } 
  })

var symptom = new Vue({
  el: '#symptom',
  data: {
    typeval : '',
    typename : '',
    symplist: [
    ],
    symplistall: [
      [ { name: 'Symp1_1',
          detail: 'Your pet will be sick and it isn\'t fine.',
          pic: 'doge0.jpg',
          check: false },
        { name: 'Symp1_2',
          detail: 'Sorry, Your pet will be death.',
          pic: 'doge1.jpg', 
          check: false },
        { name: 'Symp1_3',
          detail: 'Don\'t worry, Your pet will be well soon.',
          pic: 'doge2.jpg',
          check: false } ],
      [ { name: 'Symp2_1',
          detail: 'Your pet will be sick and it isn\'t fine.',
          pic: 'doge3.jpg',
          check: false },
        { name: 'Symp2_2',
          detail: 'Sorry, Your pet will be death.',
          pic: 'doge4.jpg', 
          check: false } ],
      [ { name: 'Symp3_1',
          detail: 'Your pet will be sick and it isn\'t fine.',
          pic: 'jhin.jpg',
          check: false } ],      
    ],
    sympdet: [
      { name: '',
        pic: '',
        detail: ''}
    ]
  },
  methods: {
    showSymptomInfo: function(symp){
      this.sympdet[0].name = symp.name;
      this.sympdet[0].pic = symp.pic;
      this.sympdet[0].detail = symp.detail;
    },
    // hideSymptomInfo: function(){
    //   this.sympdet[0].name = '';
    //   this.sympdet[0].pic = '';
    //   this.sympdet[0].detail = '';
    // }
    changeSymptomType: function(){
      // Get symptom type value
      var value = document.getElementById("symptomtype").value;
      // Show symptom type(value)
      this.typename = document.getElementById("symptomtype").options[value].text;
      // Show symptom list of type(value)
      this.symplist = this.symplistall[value-1];
    }
  }
})

  

  
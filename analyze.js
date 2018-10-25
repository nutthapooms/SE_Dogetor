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
        'Skin',
        'Nose',
        'Mouth',
        'Eyes',
        'Ears' 
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

  

  